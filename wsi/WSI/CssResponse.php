<?php
namespace WSI;

require_once 'Response.php';

class CssResponse extends Response {

    public function __construct(Asset $asset) {
        parent::__construct($asset, 'text/css; charset=utf-8');
    }
}

