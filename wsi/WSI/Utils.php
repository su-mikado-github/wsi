<?php
use WSI\Request;
use WSI\SystemException;
use WSI\Core;
use WSI\Module;
use WSI\Logger;

function import($id) {
    return Module::import($id);
}

function url($url, array $params=[]) {
    if (substr($url, 0, 2) === '//') {
        $url = substr($url, 1);
    }
    else if (substr($url, 0, 1) === '/') {
        $url = dirname($_SERVER['SCRIPT_NAME']) . $url;
    }

    if (!$params) {
        return $url;
    }
    else {
        return $url . '?' . implode('&', array_map(function($name) use($params) { return $name . '=' . urlencode($params[$name]); }, array_keys($params)));
    }
}

class Utils {

    protected static function find_template_path($id) {
        $core = Core::instance();

        $index = strrpos($id, '.');
        if ($index === false) {
            Logger::error("Not template extension of '{$id}'.");
            throw new SystemException('システムエラー', 404);
        }
        $type = substr($id, $index);

        $group = @current(array_filter(array_keys($core->get_groups()), function($key) use($id) { return (substr($id, 0, strlen($key))===$key); }));

        $sub_path = @$core->get_asset($type)->directory_name . substr($id, strlen($group));

        $path = $core->publish_path . $group . $sub_path;
        if (file_exists($path)) {
            return $path;
        }
        Logger::warn("Not found template '{$id}' => {$path}");

        $group_path = $core->get_group_path($group);
        if ($group_path) {
            $path = $group_path . $sub_path;
            if (file_exists($path)) {
                return $path;
            }
        }
        Logger::warn("Not found template '{$id}' => {$path}");

        return false;
    }

    protected static function render_block_tag_template(Request $request, $path, array $attributes, callable $content) {
        if (ob_start()) {
            include $path;
            return ob_get_clean();
        }
        else {
            return false;
        }
    }

    protected static function render_simple_tag_template(Request $request, $path, array $attributes) {
        if (ob_start()) {
            include $path;
            return ob_get_clean();
        }
        else {
            return false;
        }
    }

    protected static function block_tag($id, array $attrs, callable $content) {
        //
        $path = self::find_template_path($id);
        if (!$path) {
            return null;
        }

        return self::render_block_tag_template(Request::instance(), $path, $attrs, $content);
    }

    protected static function simple_tag($id, array $attrs) {
        //
        $path = self::find_template_path($id);
        if (!$path) {
            return null;
        }

        return self::render_simple_tag_template(Request::instance(), $path, $attrs);
    }

    public static function __callstatic($name, array $arguments) {
        if (strcasecmp($name, 'template') === 0) {
            $p1 = (isset($arguments[0]) ? $arguments[0] : null);
            $p2 = (isset($arguments[1]) ? $arguments[1] : null);
            $p3 = (isset($arguments[2]) ? $arguments[2] : null);
            if (is_string($p1)) {
                $id = $p1;

                if (is_callable($p2) && !$p3) {
                    return self::block_tag($id, [], $p2);
                }
                else if (is_array($p2) && !$p3) {
                    return self::simple_tag($id, $p2);
                }
                else if (is_array($p2) && is_callable($p3)) {
                    return self::block_tag($id, $p2, $p3);
                }
                else if (!$p2 && !$p3) {
                    return self::simple_tag($id, []);
                }
            }
        }
        return false;
    }
}
