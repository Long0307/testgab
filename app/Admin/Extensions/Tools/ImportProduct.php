<?php

namespace App\Admin\Extensions\Tools;

use Encore\Admin\Admin;
use Encore\Admin\Grid\Tools\AbstractTool;
use Illuminate\Support\Facades\Request;
use App\Models\products;

class ImportProduct extends AbstractTool
{
    public function render()
    {
        $products = products::all();
        $data = [ 'products' => $products ];
        return view('admin.tools.import_products', $data);
    }
}