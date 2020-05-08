<?php
namespace WSI;

require_once 'PropertySupport.php';
//require_once 'Logger.php';

class Status {
    use PropertySupport;

    public static function redirect($url) {
        //
        return (new Status(0))->set_url($url);
    }

    public static function ok($message=null) {
        //
        if ($message == null) {
            return new Status(0);
        }
        else {
            return (new Status(0))->set_message($message);
        }
    }

    public static function error($code, $message=null) {
        //
        if ($message == null) {
            return new Status($code);
        }
        else {
            return (new Status($code))->set_message($message);
        }
    }

    private $code;

    private $url;

    private $source;

    private $message;

    private $params = [];

    protected function __construct($code) {
        //
        $this->code = $code;
    }

    public function get_code() {
        return $this->code;
    }

    public function is_error() {
        return ($this->code !== 0);
    }

    public function get_url() {
        return $this->url;
    }

    public function set_url($value) {
        $this->url = $value;
        return $this;
    }

    public function get_source() {
        return $this->source;
    }

    public function set_source($value) {
        $this->source = $value;
        return $this;
    }

    public function get_message() {
        return $this->message;
    }

    public function set_message($value) {
        $this->message = $value;
        return $this;
    }

    public function get_params() {
        return $this->params;
    }

    public function set_params(array $params) {
        $this->params = $params;
        return $this;
    }

    public function set_param($name, $value) {
        $this->params[$name] = $value;
        return $this;
    }

    public function get_param($name) {
        return @$this->params[$name];
    }

    public function remove_param($name) {
        unset($this->params[$name]);
        return $this;
    }
}

