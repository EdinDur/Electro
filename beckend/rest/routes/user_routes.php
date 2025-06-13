<?php

require_once __DIR__ . '/../services/UserService.class.php';

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

Flight::set('user_service', new UserService());

 /**
 * @OA\Post(
 *      path="/users/add",
 *      tags={"USERS"},
 *      summary="Add User",
 *      @OA\Response(
 *           response=200,
 *           description="Add to Cart"
 *      ),
 *      @OA\RequestBody(
 *          description="Adding Product to Cart",
 *          @OA\JsonContent(
 *              required={"username","email","psw"},
 *              @OA\Property(property="username", type="string", example="edin12345", description="User"),
 *              @OA\Property(property="email", type="string", example="edin12@gmail.com", description="E-Mail"),
 *              @OA\Property(property="psw", type="string", example="edin1234", description="Password")
 *          )
 *      )
 * )
 */

Flight::route('POST /users/add', function() {
    // Get raw POST data
    $rawData = Flight::request()->getBody();
    
    $payload = json_decode($rawData, true);

    // Validate payload
    if (!isset($payload['username']) || !isset($payload['email']) || !isset($payload['psw'])) {
        Flight::halt(400, "Invalid payload");
    }

    $user_service = new UserService();

    try {
        $user = $user_service->add_user($payload);

        if ($user) {
        
            unset($user["userPassword"]);
            
            $jwt_payload = [
                "user" => $user,
                "iat" => time(),
                "exp" => time() + (60*60*24*30) // valid for 30 days
            ];
            $token = JWT::encode($jwt_payload, JWT_SECRET, "HS256");

            Flight::json(array_merge($user, ["token" => $token]));
        } else {
            Flight::halt(500, "Failed to add the user");
        }
    } catch (Exception $e) {
        Flight::halt(500, "Internal Server Error $user");
    }
});

/**
 * @OA\Put(
 *      path="/users/edit",
 *      tags={"USERS"},
 *      summary="Change Password",
 *      @OA\RequestBody(
 *          required=true,
 *          description="Adding Product to Cart",
 *          @OA\JsonContent(
 *              required={"username","newPassword"},
 *              @OA\Property(property="username", type="string", example="edin12345", description="User"),
 *              @OA\Property(property="newPassword", type="string", example="edin1234", description="Password")
 *          )
 *      ),
 *      @OA\Response(
 *           response=200,
 *           description="Change Password"
 *      )
 * )
 */


Flight::route('PUT /users/edit', function() {
    $body = Flight::request()->getBody();

    $data = json_decode($body, true);

    $username = isset($data['username']) ? $data['username'] : null;
    $password = isset($data['newPassword']) ? $data['newPassword'] : null;

    $user = [
        'username' => $username,
        'newPassword' => $password
    ];

    $user_service = new UserService();

    $data = $user_service->edit_user($user);

    Flight::json(["Zavrseno"]);
});

/**
 * @OA\Get(
 *      path="/users",
 *      tags={"USERS"},
 *      @OA\Parameter(
 *          name="username",
 *          in="query",
 *          description="Username",
 *          required=false,
 *          @OA\Schema(type="string")
 *      ),
 *      @OA\Parameter(
 *          name="psw",
 *          in="query",
 *          description="Password",
 *          required=false,
 *          @OA\Schema(type="string")
 *      ),
 *      summary="Get user for login",
 *      @OA\Response(
 *           response=200,
 *           description="User"
 *      )
 * )
 */
Flight::route('GET /users', function() {
    $username = Flight::request()->query['username'];
    $password = Flight::request()->query['psw'];

    $user = [
        'username' => $username,
        'psw' => $password
    ];

    $user_service = new UserService();

    $data = $user_service->get_user_login($user);

    Flight::json([
        'data' => $data,
    ]);
});

/**
 * @OA\Delete(
 *      path="/users/delete",
 *      tags={"USERS"},
 *      @OA\Parameter(
 *          name="username",
 *          in="query",
 *          description="Delete user",
 *          required=true,
 *          @OA\Schema(type="string")
 *      ),
 *      summary="Delete user",
 *      @OA\Response(
 *           response=200,
 *           description="Delete user"
 *      )
 * )
 */
Flight::route('DELETE /users/delete', function() {
    $user = Flight::get('user');

    if (isset($user->username)) {
        $username = $user->username;
    } else {
        Flight::halt(400, "Username is required");
    }

    $user_service = new UserService();
    $result = $user_service->delete_user($username);

    if ($result) {
        Flight::json(["message" => "User $username deleted successfully"]);
    } else {
        Flight::halt(500, "Failed to delete user $username");
    }
});

Flight::route('GET /users/orders', function() {
    $user = Flight::get('user');
    if (!$user) {
        Flight::halt(401, "Unauthorized");
    }
    $orders = Flight::get('user_service')->get_user_orders($user->username);
    Flight::json(['data' => $orders]);
});

Flight::route('GET /orders/@order_id/items', function($order_id) {
    $items = Flight::get('user_service')->get_order_items($order_id);
    Flight::json(['data' => $items]);
});








