<?php
abstract class Fruit
{
    private int $weight;

    function __construct(int $minWeight, int $maxWeight)
    {
        $this->weight = rand($minWeight, $maxWeight);
    }

    public function GetWeight(): int
    {
        return $this->weight;
    }
}
