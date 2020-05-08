<?php
namespace WSI;

require_once 'Request.php';

interface Handler {
    public function action(Request $request);
}

