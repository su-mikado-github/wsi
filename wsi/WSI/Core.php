<?php
namespace WSI;

require_once 'PropertySupport.php';
require_once 'SystemException.php';
require_once 'Logger.php';
require_once 'Module.php';
require_once 'Plugin.php';
require_once 'Resource.php';
require_once 'Request.php';
require_once 'Status.php';
require_once 'RedirectStatus.php';
require_once 'Processer.php';
require_once 'Asset.php';
require_once 'Response.php';
require_once 'TextResponse.php';
require_once 'BinaryResponse.php';
require_once 'HtmlResponse.php';
require_once 'JavaScriptResponse.php';
require_once 'CssResponse.php';
require_once 'JsonResponse.php';
require_once 'Database.php';
require_once 'DatabaseConnector.php';
require_once 'DatabaseConnection.php';
require_once 'Container.php';

require_once 'Utils.php';

$include_path = get_include_path();
if (strpos($include_path, dirname(__DIR__)) === false) {
    set_include_path($include_path . PATH_SEPARATOR . dirname(__DIR__));
}

// @error_log("REQUEST_URI => '{$_SERVER['REQUEST_URI']}'");
// @error_log("PATH_INFO => '{$_SERVER['PATH_INFO']}'");

class Core {
    use PropertySupport;

    private static $instance = null;

    //
    public static function instance() {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private $default_id = '/index.html';

    private $publish_path;

    private $log_directory = null;

    private $log_mapping = [];

    private $groups = [];

    private $assets = [];

    private $connectors = [];

    private $resource_dirs = [];

    private $module_dir;

    private $environments = [];

    protected function __construct() {
        //
        $this->publish_path = dirname($_SERVER['SCRIPT_FILENAME']);
//        Logger::dump($this->publish_path);
    }

    protected function url_params(Status $status) {
        if (0 < count($status->params)) {
            $params = $status->params;
            return '?' . implode('&', array_map(function($name) use($params) { return $name . '=' . urlencode($params[$name]); }, array_keys($params)));
        }
        else {
            Logger::debug('Params is none.');
            return '';
        }
    }

    public function get_default_id() {
        return $this->default_id;
    }

    public function set_default_id($value) {
        if (substr($value, 0, 1) !== '/') {
            $value = '/' . $value;
        }
        $this->default_id = $value;
        return $this;
    }

    public function get_publish_path() {
        return $this->publish_path;
    }

    public function get_log_directory() {
        return $this->log_directory;
    }

    public function set_log_directory($value) {
        if (!file_exists($value)) {
            if (mkdir($value, null, true) === false) {
                $value = null;
            }
        }

        $this->log_directory = $value;
        return $this;
    }

    public function get_log_mapping() {
        return $this->log_mapping;
    }

    public function set_log_mapping(array $log_mapping) {
        $this->log_mapping = $log_mapping;
        return $this;
    }

    public function get_groups() {
        return $this->groups;
    }

    public function set_groups(array $groups) {
        $this->groups = [];
        $this->groups['/wsi'] = dirname(__DIR__);

        foreach ($groups as $group_name => $group_path) {
            if (file_exists($group_path)) {
                if (is_dir($group_path)) {
                    $this->groups[$group_name] = $group_path;
                }
                else if (substr($group_path, strrpos($group_path, '.') === '.phar') === '.phar') {
                    if (substr($group_path, 0, strlen('phar://')) !== 'phar://') {
                        $this->groups[$group_name] = "phar://{$group_path}";
                    }
                    else {
                        $this->groups[$group_name] = $group_path;
                    }
                }
                else if (is_file($group_path)) {
                    Logger::warn("Unknown type file '$group_path'.");
                }
                else {
                    Logger::warn("Unknown type '$group_path'.");
                }
            }
            else {
                Logger::warn("Not found path '$group_path'.");
            }
        }
        return $this;
    }

    public function get_assets() {
        return $this->assets;
    }

    public function set_assets(array $assets) {
        $this->assets = $assets;
        return $this;
    }

    public function get_connectors() {
        return $this->connectors;
    }

    public function set_connectors(array $connectors) {
        $this->connectors = $connectors;
        return $this;
    }

    public function get_resource_dirs() {
        return $this->resource_dirs;
    }

    public function set_resource_dirs(array $resource_dirs) {
        $this->resource_dirs = $resource_dirs;
        return $this;
    }

    public function get_module_dir() {
        return $this->module_dir;
    }

    public function set_module_dir($module_dir) {
        $this->module_dir = $module_dir;
        return $this;
    }

    public function get_group_path($group) {
        $groups = $this->get_groups();
        return (isset($groups[$group]) ? $groups[$group] : null);
    }

    public function get_asset($type) {
        if (isset($this->assets[$type])) {
            return $this->assets[$type];
        }
        else if (isset($this->assets['*'])) {
            return $this->assets['*'];
        }
        else {
            Logger::error("Not defined asset setting of '{$type}'.");
            throw new SystemException('システムエラーが発生しました。');
        }
    }

    public function get_environments() {
        return $this->environments;
    }

    public function set_environments(array $environments) {
        $this->environments = $environments;
        return $this;
    }

    public function get_environment($name, $default=null) {
        $environments = $this->get_environments();
        return (isset($environments[$name]) ? $environments[$name] : $default);
    }

    public function set_environment($name, $value) {
        $this->environments[$name] = $value;
        return $this;
    }

    public function env($names, $default=null) {
        $config_names = (is_array($names) ? $names : (is_string($names) ? explode("/", $names) : []));
        if (!$config_names) {
            return $default;
        }

        $current = $this->get_environments();
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

    public function run() {
//        Logger::dump('include path => ' . get_include_path());

        session_start();
        try {
            foreach ($this->groups as $group => $group_path) {
                Plugin::load($group, $group_path);
            }

            $request = Request::instance();

            $status = Processer::build($this)->execute($request);
            if ($status instanceof RedirectStatus) {
                header("Location: {$status->url}{$this->url_params($status)}");
                http_response_code(301);
            }
            else if ($status instanceof Status) {
                Response::build($request)->render($request, $status);
            }
        }
        catch (SystemException $ex) {
            Logger::except($ex);
            http_response_code($ex->getCode());
        }
        catch (\Exception $ex) {
            Logger::except($ex);
            http_response_code(500);
        }
        finally {
            session_write_close();
        }
    }
}
