<?php

namespace System\Module;

use WSI\Enum;

class EFlags extends Enum {
    const Off = 0;
    const On = 1;
}

class ETypes extends Enum {
    const String = 1;
    const Text = 2;
    const Integer = 3;
    const Double = 4;
    const Date = 5;
    const DateTime = 6;
    const Time = 7;
    const Flag = 8;
    const Division1 = 9;
    const Division2 = 10;
    const Division3 = 11;
}