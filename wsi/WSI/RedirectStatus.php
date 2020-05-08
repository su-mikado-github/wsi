<?php
namespace WSI;

class RedirectStatus extends Status {

    public static function to($url, array $params=null) {
        //
        return (new RedirectStatus(0))->set_url($url)->set_params(!$params ? [] : $params);
    }

    protected function __construct() {
        parent::__construct(0);
    }
}

