<?php
namespace WSI;

interface DatabaseConnection {
    public function begin(callable $block);

    public function commit();

    public function rollback();

    public function row($sql, array $binds=[]);

    public function rowset($sql, array $binds=[]);

    public function update($sql, array $binds=[]);

    public function updates($sql, array $rowset);

    public function disconnect();
}

