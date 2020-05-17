<?php
namespace WSI\DB;

use WSI\DatabaseConnector;

require_once 'AbstractDatabaseConnection.php';

class MysqlDatabaseConnection extends AbstractDatabaseConnection {
    protected function connect($force=false) {
        if ($this->get_pdo()) {
            return $this->get_pdo();
        }
        else if ($force) {
            $connector = $this->get_connector();

            $dsn = "{$this->get_protocol()}:host={$connector->host}:{$connector->port};dbname={$connector->schema}";
            $pdo = new \PDO($dsn, $connector->get_username(), $connector->get_password(), $connector->get_options());
            foreach ($this->attributes as $attr_name => $attr_value) {
                $pdo->setAttribute($attr_name, $attr_value);
            }
            $this->set_pdo($pdo);
            return $pdo;
        }
        else {
            return null;
        }
    }

    public function __construct(DatabaseConnector $connector) {
        parent::__construct('mysql', $connector);
        //
    }
}

