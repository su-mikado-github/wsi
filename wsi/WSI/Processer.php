<?php
namespace WSI;

require_once 'PropertySupport.php';
//require_once 'Logger.php';
require_once 'Request.php';
require_once 'Handler.php';
require_once 'DispatchHandler.php';
require_once 'Status.php';


function module_import($id) {
    return Module::import($id);
}

class Processer {
    use PropertySupport;

    public static function build(Core $core) {
        return new Processer($core);
    }

    private $core;

    protected function get_core() {
        return $this->core;
    }

    protected function include_handler($path, Request $request) {
        Logger::info("Include handler '{$request->id}' => {$path}");
        return include_once($path);
    }

    protected function handler(Request $request) {
        $core = $this->get_core();

        $sub_path = @$core->get_asset($request->type)->directory_name . $request->directory . $request->filename . '.php';

        $handler_path = $core->publish_path . $request->group . $sub_path;
        if (file_exists($handler_path)) {
            return $this->include_handler($handler_path, $request);
        }
        Logger::warn("Not found handler '{$request->id}' => {$handler_path}");

        $group_path = $core->get_group_path($request->group);
        if ($group_path) {
            $handler_path = $group_path . $sub_path;
            if (file_exists($handler_path)) {
                return $this->include_handler($handler_path, $request);
            }
        }
        Logger::warn("Not found handler '{$request->id}' => {$handler_path}");

        return false;
    }

    protected function __construct(Core $core) {
        $this->core = $core;
    }

    public function execute(Request $request) {
        //
        $handler = $this->handler($request);
        Logger::dump($handler);
        if (is_callable($handler)) {
            return $handler($request);
        }
        else if (is_string($handler) && class_exists($handler)) {
            return (new $handler())->action($request);
        }
        else if ($handler instanceof Handler) {
            return $handler->action($request);
        }
        else {
            return Status::ok();
        }
    }
}