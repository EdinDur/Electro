<?php

require_once __DIR__ . '/../services/WishlistService.class.php';

Flight::set('wishlist_service', new WishlistService());

/**
 * @OA\Post(
 *      path="/wishlist/add",
 *      tags={"WISHLIST"},
 *      summary="Add to Wishlist",
 *      @OA\Response(
 *           response=200,
 *           description="Add to Wishlist"
 *      ),
 *      @OA\RequestBody(
 *          description="Adding Product to Wishlist",
 *          @OA\JsonContent(
 *              required={"productName","username"},
 *              @OA\Property(property="productName", type="string", example="MacBook Air M1", description="Product"),
 *              @OA\Property(property="username", type="string", example="edin1234", description="User")
 *          )
 *      )
 * )
 */
Flight::route('POST /wishlist/add', function() {
    $payload = Flight::request()->data->getData();
    $user = Flight::get('user');

    if (isset($user->username)) {
        $payload['username'] = $user->username;
    } else {
        Flight::halt(400, "Username is required");
    }

    $wishlist_service = new WishlistService();
    $wishlist = $wishlist_service->add_to_wishlist($payload);

    if ($wishlist) {
        Flight::json(['message' => "You have successfully added to wishlist", 'data' => $wishlist]);
    } else {
        Flight::json(['message' => "Failed to add to wishlist", 'data' => null]);
    }
});


    /**
     * @OA\Get(
     *      path="/wishlist",
     *      tags={"WISHLIST"},
     *      @OA\Parameter(
     *          name="username",
     *          in="query",
     *          description="User's Wishlist",
     *          required=false,
     *       @OA\Schema(type="string")
     *       ),
     *      summary="User's Wishlist ",
     *      @OA\Response(
     *           response=200,
     *           description="User's Wishlist"
     *      )
     * )
     */
    Flight::route('GET /wishlist', function() {
        $user = Flight::get('user');
    
        if (isset($user->username)) {
            $username = $user->username;
        } else {
            Flight::halt(400, "Username is required");
        }
    
        $wishlist_service = new WishlistService();
        $data = $wishlist_service->get_wishlist($username);
    
        Flight::json([
            'data' => $data,
        ]);
    });
    

/**
 * @OA\Delete(
 *      path="/wishlist/delete",
 *      tags={"WISHLIST"},
 *      @OA\Parameter(
 *          name="username",
 *          in="query",
 *          description="Delete user's wishlist",
 *          required=true,
 *          @OA\Schema(type="string")
 *      ),
 *      summary="Delete user's wishlist",
 *      @OA\Response(
 *           response=200,
 *           description="Delete user's wishlist"
 *      )
 * )
 */
Flight::route('DELETE /wishlist/delete', function() {
    $user = Flight::get('user');

    if (isset($user->username)) {
        $username = $user->username;
    } else {
        Flight::halt(400, "Username is required");
    }

    $wishlist_service = new WishlistService();
    $data = $wishlist_service->delete_wishlist_all($username);

    Flight::json(["message" => "Wishlist successfully emptied"]);
});

/**
 * @OA\Delete(
 *      path="/wishlist/delete-product",
 *      tags={"WISHLIST"},
 *      @OA\Parameter(
 *          name="productName",
 *          in="query",
 *          description="Product name to delete from wishlist",
 *          required=true,
 *          @OA\Schema(type="string")
 *      ),
 *      summary="Delete a product from user's wishlist",
 *      @OA\Response(
 *           response=200,
 *           description="Product deleted from wishlist"
 *      )
 * )
 */
Flight::route('DELETE /wishlist/delete-product', function() {
    $user = Flight::get('user');
    $productName = Flight::request()->query['productName'] ?? Flight::request()->data['productName'] ?? null;

    if (!isset($user->username) || !$productName) {
        Flight::halt(400, "Username and productName are required");
    }

    $wishlist_service = new WishlistService();
    $wishlist_service->delete_product_from_wishlist($user->username, $productName);

    Flight::json(["message" => "Product deleted from wishlist"]);
});