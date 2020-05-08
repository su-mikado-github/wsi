<?php
namespace WSI;

require_once 'Response.php';

class HtmlResponse extends Response {

    public function __construct(Asset $asset) {
        parent::__construct($asset, 'text/html; charset=utf-8');
    }
}

