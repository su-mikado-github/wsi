<?php
namespace WSI;

class Logger {
    const DEBUG = "debug";

    const TRACE = "trace";

    const DUMP = "dump";

    const INFORMATION = "information";

    const WARNING = "warning";

    const ERROR = "error";

    const EXCEPTION = "exception";

    public static function log($type, $message, callable $block=null) {
        if (empty($type)) {
            $type = self::DEBUG;
        }

        $log_directory = Core::instance()->log_directory;
        $log_mapping = Core::instance()->log_mapping;
        $log_suffix = (empty($log_mapping[$type]) ? $type : $log_mapping[$type]);

        $full_path = "{$log_directory}/wsi-{$log_suffix}.log";

        list($sec,$microsec) = explode('.', strval(microtime(true)));
        $datetime = date('Y-m-d H:i:s', $sec);
        if ($block) {
            $uniqid = uniqid();
            file_put_contents($full_path, "{$datetime}.{$microsec} <START:{$uniqid}> [{$type}] {$message}" . PHP_EOL, FILE_APPEND);
            try {
                call_user_func($block);
                file_put_contents($full_path, "{$datetime}.{$microsec} <END:{$uniqid}>" . PHP_EOL, FILE_APPEND);
            }
            catch (\Exception $ex) {
                file_put_contents($full_path, "{$datetime}.{$microsec} <EXCEPT:{$uniqid}> {$ex->getMessage()}" . PHP_EOL, FILE_APPEND);
                file_put_contents($full_path, $ex->getTraceAsString() . PHP_EOL, FILE_APPEND);
            }
        }
        else {
            file_put_contents($full_path, "{$datetime}.{$microsec} [{$type}] {$message}" . PHP_EOL, FILE_APPEND);
        }
    }

    public static function debug($message, callable $block=null) {
        self::log(self::DEBUG, $message, $block);
    }

    public static function trace($message, callable $block=null) {
        self::log(self::TRACE, $message, $block);
    }

    public static function dump($message, callable $block=null) {
        self::log(self::DUMP, print_r($message,true), $block);
    }

    public static function info($message, callable $block=null) {
        self::log(self::INFORMATION, $message, $block);
    }

    public static function warn($message, callable $block=null) {
        self::log(self::WARNING, $message, $block);
    }

    public static function error($message, callable $block=null) {
        self::log(self::ERROR, $message, $block);
    }

    public static function except(\Exception $ex, callable $block=null) {
        self::log(self::EXCEPTION, $ex->getMessage(), $block);
        self::log(self::EXCEPTION, $ex->getTraceAsString(), $block);
    }
}