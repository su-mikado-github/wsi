<?php
namespace WSI;

class SystemException extends \Exception {
    public function __construct($message=null, $code=null, $previous=null) {
        parent::__construct($message, $code, $previous);
    }
}

class DatabaseException extends \Exception {
    public function __construct($message=null, $code=null, $previous=null) {
        parent::__construct($message, $code, $previous);
    }
}

