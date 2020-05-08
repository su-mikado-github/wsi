<?php
namespace WSI;

class Container {
    use PropertySupport;

    public static function prepare() {
        $container = new self();
        $_SESSION[$container->get_id()] = $container;
        return $container;
    }

    public static function get($id) {
        return (isset($_SESSION[$id]) ? $_SESSION[$id] : null);
    }

    private $id;

    private $params;

    protected function __construct() {
        //
        $this->id = uniqid();
        $this->params = [];
    }

    public function get_id() {
        return $this->id;
    }

    public function get_params() {
        return $this->params;
    }

    public function set_params(array $params) {
        $this->params = $params;
        return $this;
    }

    public function clear() {
        $this->params = [];
        return $this;
    }

    public function get_param($name, $default=null) {
        return (isset($this->params[$name]) ? $this->params[$name] : $default);
    }

    public function set_param($name, $value) {
        $this->params[$name] = $value;
        return $this;
    }

    public function is_exists($name) {
        return isset($this->params[$name]);
    }

    public function remove_param($name) {
        unset($this->params[$name]);
        return $this;
    }

    public function get_names() {
        return array_keys($this->params);
    }

    public function abandon() {
        if (isset($_SESSION[$this->get_id()])) {
            unset($_SESSION[$this->get_id()]);
        }
    }
}