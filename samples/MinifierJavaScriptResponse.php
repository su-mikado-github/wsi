<?php
namespace Samples;

require_once 'JShrink/Minifier.php';

use WSI\Asset;
use WSI\JavaScriptResponse;
use WSI\Request;
use WSI\Status;
use JShrink\Minifier;

class MinifierJavaScriptResponse extends JavaScriptResponse {

    protected function path_exists_rendering(Request $request, Status $status, $path) {
        if (ob_start()) {
            parent::path_exists_rendering($request, $status, $path);
            echo Minifier::minify(ob_get_clean());
        }
    }

    public function __construct(Asset $asset) {
        parent::__construct($asset);
    }
}

