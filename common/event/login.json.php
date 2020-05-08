<?php
namespace Common\Event;

import('/common/Test.php');

use WSI\Container;
use WSI\Database;
use WSI\DispatchHandler;
use WSI\Request;
use WSI\Resource;
use WSI\Status;

class Login extends DispatchHandler {
    const SYSTEM_TOP_ID = '/system/top.html';

    const NORMAL_TOP_ID = '/common/top.html';

    protected $users;

    public function __construct() {
        $this->users = Resource::from('/common/m_users/select/all[login_id,password].sql');
    }

    public function gologin(Request $request) {
        $db = Database::connect();

        $sql = $this->users->load($_POST);
        $user = $db->row($sql, [ 'login_id'=>$_POST['loginId'], 'password'=>$_POST['loginPw'] ]);
        if (!$user) {
            return Status::error(-1, 'ログインIDかパスワードが間違えています。');
        }

        $container = Container::prepare()->set_param('user', $user);

        $url = url($user['admin_flag'] ? self::SYSTEM_TOP_ID : self::NORMAL_TOP_ID);
        return Status::ok()->set_url($url)->set_param("container_id", $container->id);
    }
}

return Login::class;
