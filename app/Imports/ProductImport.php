<?php

namespace App\Imports;

// use App\Models\products;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\SkipsUnknownSheets;
use Maatwebsite\Excel\Concerns\WithConditionalSheets;
use Maatwebsite\Excel\Concerns\WithProgressBar;
use Maatwebsite\Excel\Concerns\Importable;
// Đúng ra thằng này là import data
class ProductImport implements WithMultipleSheets, SkipsUnknownSheets, WithProgressBar
{
    use WithConditionalSheets;
    use Importable;
    private $product_id;
    public function __construct($product_id)
    {
        $this->product_id = $product_id;
    }

    public function conditionalSheets(): array
    {
        return [
            'products' => new ImportProducts(),
        ];
    }
    
    public function onUnknownSheet($sheetName)
    {
        // E.g. you can log that a sheet was not found.
        info("Sheet {$sheetName} was skipped");
    }

}
