<?php
namespace WSI;

class Database {
    const DEFAULT_CONNECTOR_ID = '*';

    private static $connections = [];

    public static function connect($connector_id=null, callable $initialiser=null) {
        //
        if (!$connector_id) {
            $connector_id = self::DEFAULT_CONNECTOR_ID;
        }

        if (isset(self::$connections[$connector_id])) {
            return self::$connections[$connector_id];
        }
        else {
            $connector = @Core::instance()->connectors[$connector_id];
            if (!$connector) {
                Logger::error("Not defined connection id '{$connector_id}'.");
                throw new SystemException('システムエラー');
            }

            $class_name = $connector->class_name;
            $connection = new $class_name($connector);
            if ($initialiser) {
                $initialiser($connection);
            }
            self::$connections[$connector_id] = $connection;
            return $connection;
        }
    }

    protected function __construct() {
        //
    }
}

