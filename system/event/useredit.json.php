<?php
namespace System\Event;

use WSI\Database;
use WSI\DispatchHandler;
use WSI\Request;
use WSI\Resource;
use WSI\Status;

class Userlist extends DispatchHandler {
    public function __construct() {
        //
    }

    public function default_action(Request $request) {
        //
        $db = Database::connect();

        $sql = Resource::from('/system/m_users/select/all[user_id].sql');
        $user = $db->row($sql, $_GET);

        return Status::ok()->set_params(['user'=>$user]);
    }
}

return Userlist::class;
