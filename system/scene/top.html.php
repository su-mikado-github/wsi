<?php
namespace Samples\Common\Scene;

use WSI\Container;
use WSI\Core;
use WSI\Status;
use WSI\RedirectStatus;

return function($request) {
    if (!Container::get(@$_GET['container_id'])) {
        return RedirectStatus::to(url(Core::instance()->get_default_id()));
    }

    return Status::ok();
};
