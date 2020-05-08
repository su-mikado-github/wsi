<?php
//require_once '../wsi/WSI/Core.php';
//require_once '../wsi/WSI/DB/MysqlDatabaseConnection.php';
require_once 'phar://wsi.phar/WSI/Core.php';
require_once 'phar://wsi.phar/WSI/DB/MysqlDatabaseConnection.php';

use WSI\Asset;
use WSI\Core;
use WSI\DatabaseConnector;
use WSI\DB\MysqlDatabaseConnection;

$today = date('Ymd');

Core::instance()
    // 起動画面
    ->set_default_id('/common/login.html')
    // ログファイルの出力先ディレクトリのパス
    ->set_log_directory('D:/Temp')
    //ログカテゴリ毎の出力先ログファイル名
    ->set_log_mapping([
        'debug' => 'develop-' . $today,
        'trace' => 'develop-' . $today,
        'dump' => 'develop-' . $today,
        'information' => $today,
        'warning' => $today,
        'error' => $today,
        'exception' => $today,
    ])
    //外部システムの接続先定義
    ->set_connectors([
        '*' => DatabaseConnector::define(MysqlDatabaseConnection::class, 'localhost', 3306, 'samples_db', 'samples_dbu', 'password') /*->set_initializer(function($connection) { $connection->attr(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION); })*/,
    ])
    //グループ定義
    ->set_groups([
        '/system' => realpath('../system'),
        '/common' => realpath('../common'),
        '/library' => realpath('../library'),
        //        '' => realpath(''),
    ])
    //拡張子毎の定義
    ->set_assets([
        '.html' => Asset::define('/scene', 'WSI\HtmlResponse', 'text/html; charset=UTF-8'),
        '.js' => Asset::define('/behavior', 'WSI\JavaScriptResponse', 'text/javascript; charset=UTF-8'),
        '.css' => Asset::define('/makeup', 'WSI\CssResponse', 'text/css; charset=UTF-8'),
        '.map' => Asset::define('/maps', 'WSI\TextResponse', 'text/plain; charset=UTF-8'),
        '.json' => Asset::define('/event', 'WSI\JsonResponse', 'application/json; charset=UTF-8'),
        '.pdf' => Asset::define('/report', 'WSI\BinaryResponse', 'application/pdf'),
        '.xlsx' => Asset::define('/report', 'WSI\BinaryResponse', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
        '.pptx' => Asset::define('/report', 'WSI\BinaryResponse', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'),
        '.txt' => Asset::define('/text', 'WSI\TextResponse', 'text/plain'),
        '.csv' => Asset::define('/data', 'WSI\CsvResponse', 'text/csv'),
        '.png' => Asset::define('/image', 'WSI\BinaryResponse', 'image/png'),
        '.jpeg' => Asset::define('/image', 'WSI\BinaryResponse', 'image/jpeg'),
        '.jpg' => Asset::define('/image', 'WSI\BinaryResponse', 'image/jpeg'),
        '.mpeg' => Asset::define('/video', 'WSI\BinaryResponse', 'video/mpeg'),
        '.mp4' => Asset::define('/video', 'WSI\BinaryResponse', 'video/mp4'),
        '*' => Asset::define('/resource', 'WSI\BinaryResponse', 'application/octet-stream'),
    ])
    //リソース・ファイル（拡張子）毎の格納先ディレクトリ名
    ->set_resource_dirs([
        '.sql' => '/sql',
    ])
    //モジュールの格納先ディレクトリ名
    ->set_module_dir('/module')
    //環境設定
    ->set_environments([

    ])
    //リクエスト処理の実行
    ->run()
;
