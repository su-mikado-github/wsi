<?php
namespace WSI;

trait PropertySupport {

    public function __get($name) {
        $method_name = 'get_' . $name;
        if (method_exists($this, $method_name)) {
            return call_user_func([$this, $method_name]);
        }
        else if (property_exists($this, $name)) {
            return $this->{$name};
        }
        else {
            throw new \Exception("Undefined {$method_name}");
        }
    }

    public function __set($name, $value) {
        $method_name = 'set_' . $name;
        if (method_exists($this, $method_name)) {
            return call_user_func([$this, $method_name], $value);
        }
        else if (property_exists($this, $name)) {
            $this->{$name} = $value;
            return $this;
        }
        else {
            throw new \Exception("Undefined {$method_name}");
        }
    }
}