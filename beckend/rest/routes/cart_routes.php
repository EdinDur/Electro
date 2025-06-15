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
 *              @OA\Property(property="username", type="string", example="edin1234", description="User"),
 *              @OA\Property(property="quantity", type="integer", example=2, description="Quantity")
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


    $payload['quantity'] = isset($payload['quantity']) ? (int)$payload['quantity'] : 1;

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


/**
 * @OA\Delete(
 *      path="/cart/delete-product",
 *      tags={"CART"},
 *      @OA\Parameter(
 *          name="productName",
 *          in="query",
 *          description="Product name to delete from cart",
 *          required=true,
 *          @OA\Schema(type="string")
 *      ),
 *      summary="Delete a product from user's cart",
 *      @OA\Response(
 *           response=200,
 *           description="Product deleted from cart"
 *      )
 * )
 */
Flight::route('DELETE /cart/delete-product', function() {
    $user = Flight::get('user');
    $productName = Flight::request()->query['productName'] ?? Flight::request()->data['productName'] ?? null;

    if (!isset($user->username) || !$productName) {
        Flight::halt(400, "Username and productName are required");
    }

    $cart_service = new CartService();
    $cart_service->delete_product_from_cart($user->username, $productName);

    Flight::json(["message" => "Product deleted from cart"]);
});