<?php
namespace WSI;

class Resource {
    use PropertySupport;

    public static function from($id) {
        return new self(Core::instance(), $id);
    }

    private $core;

    private $id;

    private $group;

    private $type;

    protected function __construct(Core $core, $id) {
        //
        $this->core = $core;
        $this->id = $id;

        $index = strrpos($id, '.');
        if ($index === false) {
            throw new SystemException('システムエラー', 404);
        }
        $this->type = substr($id, $index);

        $this->group = @current(array_filter(array_keys($core->get_groups()), function($key) use($id) { return (substr($id, 0, strlen($key))===$key); }));
    }

    protected function load_resource($id, $path, array $params=[]) {
        Logger::info("Include resource '{$id}' => {$path}");
        if (ob_start()) {
            include $path;
            return ob_get_clean();
        }
        else {
            return false;
        }
    }

    public function get_core() {
        return $this->core;
    }

    public function get_id() {
        return $this->id;
    }

    public function get_group() {
        return $this->group;
    }

    public function get_type() {
        return $this->type;
    }

    public function load(array $params=[]) {
        $core = $this->get_core();

        $id = $this->get_id();
        $group = $this->get_group();
        $type = $this->get_type();

        $resource_dirs = $core->resource_dirs;

        $resource_dir = @$resource_dirs[$type];

        $sub_path = $resource_dir . substr($id, strlen($group));

        $path = $core->publish_path . $this->group . $sub_path;
        if (file_exists($path)) {
            return $this->load_resource($id, $path, $params);
        }
        Logger::warn("Not found resource '{$id}' => {$path}");

        $group_path = $core->get_group_path($group);
        if ($group_path) {
            $path = $group_path . $sub_path;
            if (file_exists($path)) {
                return $this->load_resource($id, $path, $params);
            }
            Logger::warn("Not found resource '{$id}' => {$path}");
        }

        return false;
    }
}

