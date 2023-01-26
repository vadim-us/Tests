<?php
include_once "Apple.php";
include_once "Pear.php";

abstract class Tree
{
    private array $fruits = [];
    private int $countFruits;
    private string $id;

    function __construct(bool $isApple, string $id, int $minHarvest, int $maxHarvest)
    {
        $this->id = $id;
        $this->countFruits = rand($minHarvest, $maxHarvest);
        $this->FruitOnTree($isApple);
    }

    private function FruitOnTree(bool $isApple)
    {
        for ($i = 0; $i < $this->countFruits; $i++) {
            $this->fruits[$i] = $isApple ? new Apple() : new Pear();
        }
    }

    public function GetID(): string
    {
        return $this->id;
    }

    public function Harvesting(): array
    {
        $return = $this->fruits;
        $this->fruits = [];
        $this->countFruits = 0;
        return $return;
    }

    public function GetFruitCount(): int
    {
        return $this->countFruits;
    }
}
