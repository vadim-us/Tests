<?php
include_once "Fruit.php";

class Apple extends Fruit
{
    const minWeight = 150;
    const maxWeight = 180;

    function __construct()
    {
        parent::__construct(self::minWeight, self::maxWeight);
    }
}
