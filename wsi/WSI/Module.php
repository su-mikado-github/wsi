<?php
namespace WSI;

abstract class Module {

    protected static function import_module($id, $path) {
        Logger::info("Include module '{$id}' => {$path}");
        return ((include_once $path) !== false);
    }

    public static function import($id) {
        $core = Core::instance();

        $index = strrpos($id, '.');
        if ($index === false) {
            throw new SystemException('システムエラー', 404);
        }
        $type = substr($id, $index);
        if ($type !== '.php') {
            throw new SystemException('システムエラー', 500);
        }

        $group = @current(array_filter(array_keys($core->get_groups()), function($key) use($id) { return (substr($id, 0, strlen($key))===$key); }));

        $sub_path = $core->module_dir . substr($id, strlen($group));

        $path = $core->publish_path . $group . $sub_path;
        if (file_exists($path)) {
            return self::import_module($id, $path);
        }
        Logger::warn("Not found module '{$id}' => {$path}");

        $group_path = $core->get_group_path($group);
        if ($group_path) {
            $path = $group_path . $sub_path;
            if (file_exists($path)) {
                return self::import_module($id, $path);
            }
            Logger::warn("Not found module '{$id}' => {$path}");
        }
    }

    protected function __construct() {
        //
    }
}
