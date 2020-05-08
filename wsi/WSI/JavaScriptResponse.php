<?php
namespace WSI;

require_once 'Response.php';

class JavaScriptResponse extends Response {

    public function __construct(Asset $asset) {
        parent::__construct($asset, 'text/javascript; charset=utf-8');
    }
}

