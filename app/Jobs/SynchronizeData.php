<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Encore\Admin\Config\ConfigModel;

class SynchronizeData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;


    protected $products;
    public $tries = 3;
    /**
     * Create a new job instance.
     *   
     * @param  array  $data
     * @return void
     */
    public function __construct($products)
    {
        $this->products = $products;
        $this->onQueue('SynchronizeData');
    }

 /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(): void
    {

        dd(config('admin.database.connection'));
        // $api_token = ConfigModel::where('name', 'api_token')->pluck('value')->first();

        // $api_url = ConfigModel::where('name', 'api_url')->pluck('value')->first();

        // $response = Http::withToken($api_token)->post($api_url.'/api/productss', $this->products->attributesToArray());

        // if($response->status() != 201){
        //     throw new Exception($response->body(), 1);
        // }
    }
}
