<?php
include_once "Tree.php";

class PearTree extends Tree
{
    const minHarvest = 0;
    const maxHarvest = 20;

    function __construct(int $id)
    {
        parent::__construct(false, "PearTree_" . $id, self::minHarvest, self::maxHarvest);
    }
}
