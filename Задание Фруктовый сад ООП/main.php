<?php
include_once "Class/AppleTree.php";
include_once "Class/PearTree.php";

class Garden
{
    private array $garden = ['apple' => [], 'pear' => []];
    private int $appleTreeInGarden = 0;
    private int $pearTreeInGarden = 0;

    private array $fruitHarvest = ['apple' => [], 'pear' => []];

    function __construct(int $appleTree = 10, int $pearTree = 15)
    {
        $this->FillGarden("AppleTree", $appleTree);
        $this->FillGarden("PearTree", $pearTree);

        $this->ShowStatus();
        $this->Input();
    }

    private function FillGarden(string $tree,  int $count)
    {
        for ($i = 0; $i < $count; $i++) {
            $this->Add($tree);
        }
    }

    private function Add(string $tree)
    {
        if ($tree == "AppleTree") {
            $countApple = $this->appleTreeInGarden++;
            $this->garden['apple'][$countApple] = new AppleTree($countApple + 1);
        }
        if ($tree == "PearTree") {
            $countPear = $this->pearTreeInGarden++;
            $this->garden['pear'][$countPear] = new PearTree($countPear + 1);
        }
    }

    private function ShowStatus()
    {
        $countApple = $this->appleTreeInGarden;
        $countPear = $this->pearTreeInGarden;

        echo "\nВ саду " . $countApple + $countPear . " деревьев\n";
        echo $countApple . " Яблонь и " . $countPear . " Груш\n";

        $this->AdvancedStatus();
    }

    private function FixInput(int &$input)
    {
        if ($input < 0) $input = 0;
        if ($input > 100) $input = 100;
    }

    private function AddTree()
    {
        $this->ShowStatus();

        $input = (int)readline("\nСколько добавить Яблонь? 0-100: ");
        $this->FixInput($input);
        $this->FillGarden("AppleTree", $input);

        $input = (int)readline("\nСколько добавить Груш? 0-100: ");
        $this->FixInput($input);
        $this->FillGarden("PearTree", $input);

        $this->ShowStatus();
    }

    private function Harvest()
    {
        echo "\nИдет сбор фруктов...\n";

        $count = 0;

        $this->TreeHarvest('apple', 'яблок', $count, $this->appleTreeInGarden);
        $this->TreeHarvest('pear', 'груш', $count, $this->pearTreeInGarden);

        if ($count > 0) {
            $this->AdvancedStatus();
        } else {
            echo "\nДеревья пусты, собирать нечего\n";
        }
    }

    private function TreeHarvest(string $fruit, string $name, int &$count, int $treeInGarden)
    {
        for ($i = 0; $i < $treeInGarden; $i++) {
            echo $this->garden[$fruit][$i]->GetID() . " на дереве " . $this->garden[$fruit][$i]->GetFruitCount() . " " . $name . "\n";

            $count += $this->garden[$fruit][$i]->GetFruitCount();

            $this->fruitHarvest[$fruit] = array_merge($this->fruitHarvest[$fruit], $this->garden[$fruit][$i]->Harvesting());
        }
    }

    private function AdvancedStatus()
    {
        $this->WeightCount('apple');
        $this->WeightCount('pear');
    }

    private function WeightCount(string $fruit)
    {
        $name = $fruit == 'apple' ? 'яблок' : 'груш';
        $totalWeight = 0;
        $Weight = "грамм";

        for ($i = 0; $i < count($this->fruitHarvest[$fruit]); $i++) {
            $totalWeight += $this->fruitHarvest[$fruit][$i]->GetWeight();
        }

        if ($totalWeight > 1000) {
            $totalWeight = $totalWeight / 1000;
            $Weight = "килограмм";
        }

        echo "\nВсего собрано " . $name . ": " . count($this->fruitHarvest[$fruit]) . " штук\n";
        echo "Общий вес " . $name . ": " . $totalWeight . " " . $Weight . "\n";
    }

    private  function Input()
    {
        $loop = true;
        while ($loop) {
            echo "\nКоманды: add (добавить деревья), harvest (начать сбор), status (показать Статус), exit (остановка скрипта)\n";

            $input = readline("Введите команду: ");

            switch ($input) {
                case 'add':
                    $this->AddTree();
                    break;
                case 'harvest':
                    $this->Harvest();
                    break;
                case 'status':
                    $this->ShowStatus();
                    break;
                case 'exit':
                    $loop = false;
                    break;
                default:
                    break;
            }
        }
    }
}

$garden = new Garden();
