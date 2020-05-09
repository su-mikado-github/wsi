<?php
namespace System\Event;

use WSI\DispatchHandler;
use WSI\Request;
use WSI\Status;

class Top extends DispatchHandler {
    public function __construct() {
        //
    }

    public function default_action(Request $request) {
        //
        session_destroy();

        return Status::ok();
    }
}

return Top::class;