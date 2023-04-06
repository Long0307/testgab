<?php

namespace App\Imports;

use App\Models\products;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use DB;

class ImportProducts implements ToCollection, WithHeadingRow
{
    // Đọc fiel excel
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) 
        {
            $data = [
                'name' => $row['name'],
                'quantity' => $row['quantity'],
                'price' => $row['price'],
                'producers' => $row['producers'],
                'description' => $row['description'],
            ];

            DB::table('products')->insert($data);
        }
    }

    /**
     * @return int
     */
    public function startRow(): int
    { 
        return 2;
    }
}
