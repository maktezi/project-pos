<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this -> id,
            'name' => $this -> name,
            'price' => $this -> price,
            'image' => $this -> image,
            'stocks' => $this -> stocks,
        ];
    }
}
