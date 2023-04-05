<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use App\Models\Products;
use Maatwebsite\Excel\Concerns\ToCollection;

class ProductImport implements ToCollection
{
    /**
    * @param Collection $collection
    */
    public function collection(Collection $collection)
    {
        foreach ($rows as $row) 
        {
            Products::create([
                'name' => $row[0],
                'quantity' => $row[0],
                'price' => $row[0],
                'producers' => $row[0],
                'description' => $row[0],
            ]);
        }
    }
}
