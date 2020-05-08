<?php
namespace Samples\Common\Scene;

use WSI\Container;
//use WSI\Database;
use WSI\Status;
use WSI\Logger;

return function($request) {
//     $db = Database::connect();

//     $user = $db->row('select * from m_users');
    $container = Container::get($_GET['container_id']);
    $user = $container->get_param('user');

    Logger::dump(['user' => $user]);

    return Status::ok()->set_params(['user' => $user]);
};
