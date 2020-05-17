<?php
namespace WSI;

abstract class Enum {
    private static $enum = [];

    private static function initialize($class_name) {
        echo $class_name . PHP_EOL;
        if (!isset(self::$enum[$class_name])) {
            self::$enum[$class_name] = [];
            $ref_class = new \ReflectionClass($class_name);
            $ref_class->getConstants();
            foreach ($ref_class->getConstants() as $constant_name => $constant_value) {
                self::$enum[$class_name][$constant_name] = $ref_class->newInstance($constant_value);
            }
        }
    }

    final public static function __callStatic($label, $args) {
        $class_name = get_called_class();
        self::initialize($class_name);

        if (isset(self::$enum[$class_name][$label])) {
            return self::$enum[$class_name][$label];
        }
        else {
            throw new \InvalidArgumentException();
        }
    }

    final public static function names() {
        $class_name = get_called_class();
        self::initialize($class_name);

        return array_keys(self::$enum[$class_name]);
    }

    final public static function values() {
        $class_name = get_called_class();
        self::initialize($class_name);

        return array_values(self::$enum[$class_name]);
    }

    private $value;

    public function __construct($value) {
        $this->value = $value;
    }

    //元の値を取り出すメソッド。
    //メソッド名は好みのものに変更どうぞ
    final public function value() {
        return $this->value;
    }

    final public function __toString() {
        return (string)$this->value;
    }
}

// class Test1Enum extends Enum {
//     const Value1 = 1;
//     const Value2 = 2;
//     const Value3 = 3;

//     public function __constract($value) {
//         parent::__constract($value);
//     }
// }

// class Test2Enum extends Enum {
//     const Value1 = 1;
//     const Value2 = 2;

//     public function __constract($value) {
//         parent::__constract($value);
//     }
// }
