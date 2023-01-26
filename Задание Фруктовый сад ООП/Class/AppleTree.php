<?php
include_once "Tree.php";

class AppleTree extends Tree
{
    const minHarvest = 40;
    const maxHarvest = 50;

    function __construct(int $id)
    {
        parent::__construct(true, "AppleTree_" . $id, self::minHarvest, self::maxHarvest);
    }
}
