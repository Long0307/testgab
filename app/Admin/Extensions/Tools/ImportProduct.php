<?php

namespace App\Admin\Extensions\Tools;

use Encore\Admin\Admin;
use Encore\Admin\Grid\Tools\AbstractTool;
use Illuminate\Support\Facades\Request;
use DB;

class ImportProduct extends AbstractTool
{
    public function render()
    {
        $users = DB::table('admin_users')->get();
        $data = [ 'users' => $users ];
        return view('admin.tools.import_products', $data);
    }
}