<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class homeController extends Controller
{
    public function index(){
        dispatch(new \App\Jobs\TestLog);
        return view('welcome');
    }
}
