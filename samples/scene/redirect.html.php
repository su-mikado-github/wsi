<?php
use WSI\Request;
use WSI\Status;

return function(Request $request) {
    return Status::redirect('/samples/common/login.html')->param('user', 'guest');
};