<?php
namespace WSI;

require_once 'PropertySupport.php';
//require_once 'Logger.php';

class Request {
    use PropertySupport;

    private static $instance = null;

    public static function instance() {
        if (!self::$instance) {
            self::$instance = new self(Core::instance());
        }
        return self::$instance;
    }

    private $context_path;

    private $id;

    private $sub_id;

    private $type;

    private $filename;

    private $group;

    private $directory;

    protected function __construct(Core $core) {
//        Logger::dump($_SERVER);

        $this->context_path = dirname($_SERVER['SCRIPT_NAME']);

        $path_info = @$_SERVER['PATH_INFO'];
        $id = (empty($path_info) || ($path_info==='/') ? $core->default_id : $path_info);

        $index = strrpos($id, ':');
        if ($index === false) {
            $this->id = $id;
            $this->sub_id = '';
        }
        else {
            $this->id = substr($id, 0, $index);
            $this->sub_id = substr($id, $index+1);
        }
        if (!$this->id) {
            $this->id = $core->default_id;
        }

        $index = strrpos($this->id, '.');
        if ($index === false) {
            throw new SystemException('システムエラー', 404);
        }
        else {
            $this->type = substr($this->id, $index);
        }

        $this->group = @current(array_filter(array_keys($core->get_groups()), function($key) { return (substr($this->id, 0, strlen($key))===$key); }));

        $path = substr($this->id, strlen($this->group));

        $index = strrpos($path, '/');
        if ($index === false) {
            $this->filename = '/' . basename($core->default_id);
        }
        else {
            $this->filename = substr($path, $index);
        }

        $this->directory = substr($this->id, strlen($this->group), strlen($this->id)-strlen($this->group)-strlen($this->filename));
//        Logger::dump($this);
    }

    public function get_context_path() {
        return $this->context_path;
    }

    public function get_id() {
        return $this->id;
    }

    public function get_sub_id() {
        return $this->sub_id;
    }

    public function get_type() {
        return $this->type;
    }

    public function get_filename() {
        return $this->filename;
    }

    public function get_group() {
        return $this->group;
    }

    public function get_directory() {
        return $this->directory;
    }
}