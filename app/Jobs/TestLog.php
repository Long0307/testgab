<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use DB;

class TestLog implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    // Truyền dữ liệu vào job
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    // Xử lý job 
    public function handle(): void
    {
        DB::table('products')->insert([
            'name' => 'kayla',
            'quantity' => 'kayla',
            'price' => 'kayla',
            'producers' => 'kayla',
            'description' => 'kayla'
        ]);
        \Log::info('hello world');
    }
}
