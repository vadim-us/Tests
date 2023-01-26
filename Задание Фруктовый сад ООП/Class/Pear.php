<?php
include_once "Fruit.php";

class Pear extends Fruit
{
    const minWeight = 130;
    const maxWeight = 170;

    function __construct()
    {
        parent::__construct(self::minWeight, self::maxWeight);
    }
}
