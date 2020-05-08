<?php
namespace WSI;

require_once 'Response.php';

class JsonResponse extends Response {

    /**
     * {@inheritDoc}
     * @see \WSI\Response::path_not_exists_rendering()
     */
    protected function path_not_exists_rendering(\WSI\Request $request, \WSI\Status $status) {
        echo json_encode([
            'code' => $status->code,
            'url' => $status->url,
            'message' => $status->message,
            'params' => $status->params,
        ]);
        return true;
    }

    public function __construct(Asset $asset) {
        parent::__construct($asset, 'application/json; charset=utf-8');
    }
}

