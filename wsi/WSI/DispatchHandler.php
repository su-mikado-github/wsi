<?php
namespace WSI;

abstract class DispatchHandler implements Handler {

    public function __construct() {
        //
    }

    public function default_action(Request $request) {
        //
        return Status::ok();
    }

    public function unknown_action(Request $request) {
        //
        return Status::error(404);
    }

    public function action(Request $request) {
        //
        $sub_id = $request->sub_id;
        if (!$sub_id) {
            return $this->default_action($request);
        }
        else if (method_exists($this, $sub_id)) {
            return call_user_func([$this, $sub_id], $request);
        }
        else {
            return $this->unknown_action($request);
        }
    }
}

