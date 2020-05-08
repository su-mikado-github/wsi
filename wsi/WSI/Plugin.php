<?php
namespace WSI;

require_once 'PropertySupport.php';
require_once 'Logger.php';

class Plugin {
    use PropertySupport;

    const FILENAME = 'plugin.php';

    private static $plugins = [];

    public static function remove($group_name) {
        unset(self::$plugins[$group_name]);
    }

    public static function load($group_name, $group_path) {
        $path = $group_path . DIRECTORY_SEPARATOR . self::FILENAME;
        if (file_exists($path)) {
            $setting = include_once($path);
            if ($setting instanceof Plugin) {
                Logger::info("Load plugin '{$group_name}' => {$path}");
                self::$plugins[$group_name] = $setting;
                return true;
            }
            else {
                Logger::warn("Not load plugin '{$group_name}' => {$path}");
            }
        }
        else {
            Logger::warn("Not found setting of plugin '{$group_name}' => {$path}");
        }
        return false;
    }

    public static function find($group_name) {
        return (isset(self::$plugins[$group_name]) ? self::$plugins[$group_name] : null);
    }

    public static function build(array $config=null) {
        return new self($config);
    }

    public static function config($group_name, $name, $default=null) {
        $plugin = self::find($group_name);
        if ($plugin) {
            return $plugin->config_value($name, $default);
        }
        return $default;
    }

    private $config = [];

    protected function __construct(array $config=null) {
        //
        $this->config = (!$config ? [] : $config);
    }

    public function config_value($name, $default=null) {
        $config_names = (is_array($name) ? $name : (is_string($name) ? explode("/", $name) : []));
        if (!$config_names) {
            return $default;
        }

        $current = $this->get_config();
        foreach ($config_names as $cofig_name) {
            if (!$current) {
                return $default;
            }

            if (is_array($current) ? isset($current[$cofig_name]) : (is_object($current) ? property_exists($current, $cofig_name) : false)) {
                $current = (is_array($current) ? $current[$cofig_name] : $current->{$cofig_name});
            }
            else {
                $current = $default;
                break;
            }
        }
        return $current;
    }

    public function get_config() {
        return $this->config;
    }
}

