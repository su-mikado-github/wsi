<?php
namespace WSI\DB;

use WSI\DatabaseConnection;
use WSI\DatabaseConnector;
use WSI\DatabaseException;
use WSI\Logger;
use WSI\PropertySupport;
use WSI\SystemException;
use WSI\Resource;

class PDODatabaseException extends DatabaseException {
    public function __construct(array $errorInfo) {
        parent::__construct($errorInfo[2], $errorInfo[0]);
    }
}

abstract class AbstractDatabaseConnection implements DatabaseConnection {
    use PropertySupport;

    private $protocol;

    private $connector;

    private $pdo;

    private $attributes = [];

    protected function get_sql_text($sql, array $binds) {
        if (!$sql) {
            return false;
        }
        else if (is_string($sql)) {
            return $sql;
        }
        else if ($sql instanceof Resource) {
            return $sql->load($this->get_protocol(), $binds);
        }
        else {
            return false;
        }
    }

    protected function get_connector() {
        return $this->connector;
    }

    protected function get_pdo() {
        return $this->pdo;
    }

    protected function set_pdo(\PDO $pdo=null) {
        $this->pdo = $pdo;
        return $this;
    }

    protected abstract function connect($force=false);

    protected function binds(\PDOStatement $statment, array $params=null) {
        if ($params) {
            $sql = $statment->queryString;
            foreach ($params as $param_name => $param_value) {
                $bind_name = ':' . $param_name;
                if (strpos($sql, $bind_name) !== false) {
                    if (is_null($param_value)) {
                        $statment->bindValue($bind_name, null, \PDO::PARAM_NULL);
                    }
                    else if (is_bool($param_value)) {
                        $statment->bindValue($bind_name, $param_value, \PDO::PARAM_BOOL);
                    }
                    else if (is_int($param_value)) {
                        $statment->bindValue($bind_name, $param_value, \PDO::PARAM_INT);
                    }
                    else if (is_string($param_value)) {
                        $statment->bindValue($bind_name, $param_value, \PDO::PARAM_STR);
                    }
                    else if (is_numeric($param_value)) {
                        $statment->bindValue($bind_name, $param_value, \PDO::PARAM_STR);
                    }
                }
            }
        }
        return $statment;
    }

    protected function error_check(\PDOStatement $statement) {
        Logger::dump($statement->errorInfo());
        throw new PDODatabaseException($statement->errorInfo());
    }

    protected function execute(\PDOStatement $statement, array $binds = []) {
        $result = $this->binds($statement, $binds)->execute();
        if ($result === false) {
            $this->error_check($statement);
        }
        return $result;
    }

    public function __construct($protocol, DatabaseConnector $connector) {
        $this->protocol = $protocol;
        $this->connector = $connector;
        //
    }

    public function get_protocol() {
        return $this->protocol;
    }

    public function get_attributes() {
        return $this->attributes;
    }

    public function set_attributes(array $attributes) {
        $this->attributes = $attributes;
        return $this;
    }

    public function get_attr($name) {
        return @$this->attributes[$name];
    }

    public function attr($name, $value) {
        $this->attributes[$name] = $value;
        return $this;
    }

    public function rollback() {
        $pdo = $this->connect();
        if ($pdo) {
            if ($pdo->inTransaction()) {
                return $pdo->rollBack();
            }
        }
        return false;
    }

    public function disconnect() {
        $this->set_pdo(null);
    }

    public function rowset($sql, array $binds = []) {
        $sql_text = $this->get_sql_text($sql, $binds);
        if (!$sql_text) {
            Logger::error("SQL statement is empty !!");
            throw new SystemException('システム・エラー');
        }
        Logger::dump($sql_text);

        $pdo = $this->connect(true);
        if ($pdo) {
            $statement = $pdo->prepare($sql_text);
            try {
                $this->execute($statement, $binds);

                $result = [];
                while ($row = $statement->fetch(\PDO::FETCH_BOTH)) {
                    $result[] = $row;
                }
                return $result;
            }
            finally {
                $statement->closeCursor();
            }
        }
        return false;
    }

    public function commit() {
        $pdo = $this->connect();
        if ($pdo) {
            if ($pdo->inTransaction()) {
                return $pdo->commit();
            }
        }

        return false;
    }

    public function update($sql, array $binds = []) {
        $sql_text = $this->get_sql_text($sql, $binds);
        if (!$sql_text) {
            Logger::error("SQL statement is empty !!");
            throw new SystemException('システム・エラー');
        }
        Logger::dump($sql_text);

        $pdo = $this->connect(true);
        if ($pdo) {
            $statement = $pdo->prepare($sql_text);
            return $this->execute($statement, $binds);
        }
        return false;
    }

    public function row($sql, array $binds = []) {
        $sql_text = $this->get_sql_text($sql, $binds);
        if (!$sql_text) {
            Logger::error("SQL statement is empty !!");
            throw new SystemException('システム・エラー');
        }
        Logger::dump($sql_text);

        $pdo = $this->connect(true);
        if ($pdo) {
            $statement = $pdo->prepare($sql_text);
            try {
                $this->execute($statement, $binds);
                return $statement->fetch(\PDO::FETCH_BOTH);
            }
            finally {
                $statement->closeCursor();
            }
        }
        return false;
    }

    public function updates($sql, array $rowset) {
        if (!$sql) {
            Logger::error("SQL statement is empty !!");
            throw new SystemException('システム・エラー');
        }
        if (!$rowset) {
            return [];
        }

        $pdo = $this->connect(true);
        if ($pdo) {
            return array_map(function($row) use($pdo, $sql) {
                $sql_text = $this->get_sql_text($sql, $row);
                Logger::dump($sql_text);

                $statement = $pdo->prepare($sql_text);
                return $this->execute($statement, $row);
            }, $rowset);
        }
        return false;
    }

    public function begin(callable $block) {
        $pdo = $this->connect(true);
        if ($pdo) {
            if ($pdo->inTransaction()) {
                $pdo->beginTransaction();
                try {
                    $block($this);
                    $pdo->commit();
                    return true;
                }
                catch (\Exception $ex) {
                    $pdo->rollBack();
                    throw $ex;
                }
            }
        }
        return false;
    }
}

