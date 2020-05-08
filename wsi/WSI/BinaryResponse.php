<?php
namespace WSI;

require_once 'Response.php';

class BinaryResponse extends Response {

    /**
     * {@inheritDoc}
     * @see \WSI\Response::path_not_exists_rendering()
     */
    protected function path_not_exists_rendering(\WSI\Request $request, \WSI\Status $status) {
        if (empty($status->source)) {
            return false;
        }
        else {
            readfile($status->source);
            return true;
        }
    }

    public function __construct(Asset $asset) {
        parent::__construct($asset, 'application/octet-stream');
    }
}

