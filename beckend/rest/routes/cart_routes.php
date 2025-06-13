<?php

require_once __DIR__ . '/../services/CartService.class.php';

Flight::set('cart_service', new CartService());


/**
 * @OA\Post(
 *      path="/cart/add",
 *      tags={"CART"},
 *      summary="Add to Cart",
 *      @OA\Response(
 *           response=200,
 *           description="Add to Cart"
 *      ),
 *      @OA\RequestBody(
 *          description="Adding Product to Cart",
 *          @OA\JsonContent(
 *              required={"productName","username"},
 *              @OA\Property(property="productName", type="string", example="MacBook Air M1", description="Product"),
 *              @OA\Property(property="username", type="string", example="edin1234", description="User")
 *          )
 *      )
 * )
 */
Flight::route('POST /cart/add', function() {
    $payload = Flight::request()->data->getData();
    $user = Flight::get('user');

    if (isset($user->username)) {
        $payload['username'] = $user->username;
    } else {
        Flight::halt(400, "Username is required");
    }

    $cart_service = new CartService();
    $cart = $cart_service->add_to_cart($payload);

    if ($cart) {
        Flight::json(['message' => "You have successfully added to cart", 'data' => $cart]);
    } else {
        Flight::json(['message' => "Failed to add to cart", 'data' => null]);
    }
});


    /**
     * @OA\Get(
     *      path="/cart",
     *      tags={"CART"},
     *      @OA\Parameter(
     *          name="username",
     *          in="query",
     *          description="User's Cart",
     *          required=false,
     *       @OA\Schema(type="string")
     *       ),
     *      summary="User's cart ",
     *      @OA\Response(
     *           response=200,
     *           description="User's Cart"
     *      )
     * )
     */
    Flight::route('GET /cart', function() {
        $user = Flight::get('user');
    
        if (isset($user->username)) {
            $username = $user->username;
        } else {
            Flight::halt(400, "Username is required");
        }
    
        $cart_service = new CartService();
        $data = $cart_service->get_cart($username);
    
        Flight::json([
            'data' => $data,
        ]);
    });
    

/**
 * @OA\Delete(
 *      path="/cart/delete",
 *      tags={"CART"},
 *      @OA\Parameter(
 *          name="username",
 *          in="query",
 *          description="Delete user's cart",
 *          required=true,
 *          @OA\Schema(type="string")
 *      ),
 *      summary="Delete user's cart",
 *      @OA\Response(
 *           response=200,
 *           description="Delete user's cart"
 *      )
 * )
 */
Flight::route('DELETE /cart/delete', function() {

    $user = Flight::get('user');
    
    if (isset($user->username)) {
        $username = $user->username;
    } else {
        Flight::halt(400, "Username is required");
    }

    $cart_service = new CartService();
    $data = $cart_service->delete_cart_all($username);

    Flight::json(["message" => "Zavrseno"]);
});