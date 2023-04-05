<?php

namespace App\Admin\Controllers;

use App\Models\products;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;
use App\Jobs\SynchronizeData;
use App\Imports\ProductImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Config;
use App\Admin\Extensions\Tools\ImportProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use DB;

class ProductController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'products';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new products());
        $grid->column('id', __('Id'));
        $grid->column('name', __('Name'));
        $grid->column('quantity', __('Quantity'));
        $grid->column('price', __('Price'));
        $grid->column('producers', __('Producers'));
        $grid->column('description', __('Description'));
        $grid->column('created_at', __('Created at'));
        $grid->column('updated_at', __('Updated at'));
        $grid->tools(function($tools) {
            $tools->append(new ImportProduct());
        });
        return $grid;
    }

    // public function import() 
    // {
    //     Excel::import(new UsersImport, 'users.xlsx');
    // }

    /**
     * Make a show builder.
     *
     * @param mixed $id
     * @return Show
     */
    protected function detail($id)
    {
        $show = new Show(products::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('name', __('Name'));
        $show->field('quantity', __('Quantity'));
        $show->field('price', __('Price'));
        $show->field('producers', __('Producers'));
        $show->field('description', __('Description'));
        $show->field('created_at', __('Created at'));
        $show->field('updated_at', __('Updated at'));

        return $show;
    }

    /**
     * Make a form builder.
     *
     * @return Form
     */
    protected function form()
    {
        $form = new Form(new products());

        $form->text('name', __('Name'));
        $form->text('quantity', __('Quantity'));
        $form->text('price', __('Price'));
        $form->text('producers', __('Producers'));
        $form->text('description', __('Description'));

        $form->saving(function (Form $form) {
            DB::connection('mysql2')->table('products')->insert([
                'name' => $form->name,
                'quantity' => $form->quantity,
                'price' => $form->price,
                'producers' => $form->producers,
                'description' => $form->description,
            ]);
        });

        return $form;
    }

    public function import(Request $request)
    {
        if ($request->hasFile('file')) {

            $file = $request->file('file');
            // $sheets = $request->get('sheets');
            // $product_id = $request->get('product_id');
            // $file->move('upload/file', $file->getClientOriginalName());
            // $import = new ProductImport($product_id);
            Excel::import(new ProductImport, $file->getClientOriginalName());
            // Sai ở đây
            // $import->onlySheets($sheets);
            echo 5;
            // $moveon = '/upload/file/'.$file->getClientOriginalName();
            echo 0;
            // Excel::import($import, public_path($moveon));
            // echo 1;
            // Log::info("Imported....");
            // echo 2;
            // return response()->json([
            //     'success' => true,
            //     'message' => 'Import successfull.'
            // ]);
        }else {
            return response()->json([
                'success' => false,
                'message' => 'Import failed.'
            ]);
        }
    }
}
