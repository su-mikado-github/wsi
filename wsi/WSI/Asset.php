<?php
namespace WSI;

class Asset {
    use PropertySupport;

    public static function define($directory_name, $class_name, $content_type=null) {
        return new Asset($directory_name, $class_name, $content_type);
    }

    private $directory_name;

    private $class_name;

    private $content_type;

    protected function __construct($directory_name, $class_name, $content_type=null) {
        //
        $this->directory_name = $directory_name;
        $this->class_name = $class_name;
        $this->content_type = $content_type;
    }

    public function get_directory_name() {
        return $this->directory_name;
    }

    public function get_class_name() {
        return $this->class_name;
    }

    public function get_content_type() {
        return $this->content_type;
    }
}

