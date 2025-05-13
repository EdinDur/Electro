<?php

require_once __DIR__ . '/../services/ProductService.class.php';

Flight::set('product_service', new ProductService());

    /**
     * @OA\Get(
     *      path="/products",
     *      tags={"PRODUCTS"},
     *      summary="Get all products",
     *      @OA\Response(
     *           response=200,
     *           description="All products"
     *      )
     * )
     */
Flight::route("GET /products", function(){

    $data = Flight::get("product_service")->get_product_display();
    Flight::json(['data' => $data], 200);
});

    /**
     * @OA\Get(
     *      path="/productsByCategory",
     *      tags={"PRODUCTS"},
     *      @OA\Parameter(
     *          name="category",
     *          in="query",
     *          description="Filter products by category",
     *          required=false,
     *       @OA\Schema(type="string")
     *       ),
     *      summary="Get products by category",
     *      @OA\Response(
     *           response=200,
     *           description="Get products by category"
     *      )
     * )
     */
Flight::route('GET /productsByCategory', function() {

    $category = Flight::request()->query['category'];   
    $product_service = Flight::get('product_service'); 
    $data = $product_service->get_product_by_category($category);
    
    Flight::json([
        'data' => $data,
    ]);
});

    /**
     * @OA\Get(
     *      path="/productsByName",
     *      tags={"PRODUCTS"},
     *      @OA\Parameter(
     *          name="productName",
     *          in="query",
     *          description="Filter products by name",
     *          required=false,
     *       @OA\Schema(type="string")
     *       ),
     *      summary="Get products by name",
     *      @OA\Response(
     *           response=200,
     *           description="Get products by name"
     *      )
     * )
     */
Flight::route('GET /productsByName', function() {

    $name = Flight::request()->query['productName'];
    $product_service = Flight::get('product_service');
    $data = $product_service->get_product_by_name($name);

    Flight::json([
        'data' => $data,
    ]);
});

    /**
     * @OA\Get(
     *      path="/productsByInput",
     *      tags={"PRODUCTS"},
     *      @OA\Parameter(
     *          name="input",
     *          in="query",
     *          description="Filter products by input",
     *          required=false,
     *       @OA\Schema(type="string")
     *       ),
     *      summary="Get products by input",
     *      @OA\Response(
     *           response=200,
     *           description="Get products by input"
     *      )
     * )
     */
Flight::route('GET /productsByInput', function() {
    $input = Flight::request()->query['input'];

    $product_service = new ProductService();

    $data = $product_service->get_product_by_search($input);

    Flight::json([
        'data' => $data,
    ]);
});

    /**
     * @OA\Get(
     *      path="/productsNew",
     *      tags={"PRODUCTS"},
     *      summary="Get all new products",
     *      @OA\Response(
     *           response=200,
     *           description="All new products"
     *      )
     * )
     */

Flight::route('GET /productsNew', function() {
    $product_service = new ProductService();

    $data = $product_service->get_product_new();

    Flight::json([
        'data' => $data,
    ]);
});