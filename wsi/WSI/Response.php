<?php
namespace WSI;

require_once 'PropertySupport.php';
require_once 'Logger.php';
require_once 'Status.php';

abstract class Response {
    use PropertySupport;

    public static function build(Request $request) {
        $core = Core::instance();
        $type = $request->type;

        $asset = $core->get_asset($type);
        if ($asset instanceof Asset) {
            $class_name = $asset->class_name;
            if (class_exists($class_name)) {
                return new $class_name($asset);
            }
            else {
                Logger::error("Un defined class '{$class_name}'.");
                throw new SystemException('システムエラー', 500);
            }
        }
        else {
            Logger::error("Un defined asset setting of '{$type}'.");
            throw new SystemException('システムエラー', 500);
        }
    }

    private $asset;

    private $default_content_type;

    protected function __construct(Asset $asset, $default_content_type) {
        //
        $this->asset = $asset;
        $this->default_content_type = $default_content_type;
    }

    protected function make_path(Request $request) {
        $core = Core::instance();

        $sub_path = @$core->get_asset($request->type)->directory_name . $request->directory . $request->filename;

        $path = $core->publish_path . $request->group . $sub_path;
        if (file_exists($path)) {
            return $path;
        }

        $group_path = $core->get_group_path($request->group);
        if ($group_path) {
            $path = $group_path . $sub_path;
            if (file_exists($path)) {
                return $path;
            }
        }

        return false;
    }

    protected function path_exists_rendering(Request $request, Status $status, $path) {
        if (empty($status->source)) {
//             Logger::dump('path => ' . $path);
            include $path;
            return true;
        }
        else {
            readfile($status->source);
            return true;
        }
    }

    protected function path_not_exists_rendering(Request $request, Status $status) {
        return false;
    }

    public function render(Request $request, Status $status) {
        $content_type = (!$this->asset->content_type ? $this->default_content_type : $this->asset->content_type);
        if (!$content_type) {
            Logger::error("No set 'content_type' property of asset setting on '{$request->type}'.");
            throw new SystemException('システムエラー', 500);
        }
        header("Content-Type: {$content_type}");

        $path = $this->make_path($request);
        if ($path === false) {
            return $this->path_not_exists_rendering($request, $status);
        }
        else {
            return $this->path_exists_rendering($request, $status, $path);
        }
    }
}

