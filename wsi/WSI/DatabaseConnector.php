<?php
namespace WSI;

class DatabaseConnector {
    use PropertySupport;

    public static function define($class_name, $host, $port, $schema, $username, $password=null) {
        return new self($class_name, $host, $port, $schema, $username, $password);
    }

    private $class_name;

    private $host;

    private $port;

    private $schema;

    private $username;

    private $password;

    private $options = [];

    private $initializer;

    protected function __construct($class_name, $host, $port, $schema, $username, $password=null) {
        //
        $this->class_name = $class_name;
        $this->host = $host;
        $this->port = $port;
        $this->schema = $schema;
        $this->username = $username;
        $this->password = $password;
    }

    public function get_class_name() {
        return $this->class_name;
    }

    public function get_host() {
        return $this->host;
    }

    public function get_port() {
        return $this->port;
    }

    public function get_schema() {
        return $this->schema;
    }

    public function get_username() {
        return $this->username;
    }

    public function get_password() {
        return $this->password;
    }

    public function get_options() {
        return $this->options;
    }

    public function set_options(array $options) {
        $this->options = $options;
        return $this;
    }

    public function option($name, $value) {
        $this->options[$name] = $value;
        return $this;
    }

    public function get_intialiser() {
        return $this->initializer;
    }

    public function set_initializer(callable $initializer) {
        $this->initializer = $initializer;
        return $this;
    }
}

