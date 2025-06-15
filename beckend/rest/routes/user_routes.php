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
            $token = JWT::encode($jwt_payload, Config::JWT_SECRET(), "HS256");

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
 *      summary="Get all users or filter by username/email",
 *      @OA\Parameter(
 *          name="username",
 *          in="query",
 *          description="Username or email for filtering (optional)",
 *          required=false,
 *          @OA\Schema(type="string")
 *      ),
 *      @OA\Parameter(
 *          name="psw",
 *          in="query",
 *          description="Password for login (optional)",
 *          required=false,
 *          @OA\Schema(type="string")
 *      ),
 *      @OA\Response(
 *           response=200,
 *           description="Returns user data"
 *      )
 * )
 */
Flight::route('GET /users', function() {
    $username = Flight::request()->query->username;
    $password = Flight::request()->query->psw;
    
    $user_service = Flight::get('user_service');

    // If both username and password provided, handle as login
    if ($username && $password) {
        $user = [
            'username' => $username,
            'psw' => $password
        ];
        $data = $user_service->get_user_login($user);
        Flight::json([
            'data' => $data,
        ]);
    } 
    // If only username/email provided, filter users
    elseif ($username) {
        $data = $user_service->get_user_by_username($username);
        Flight::json([
            'data' => $data,
        ]);
    }
    // If no parameters, return all users
    else {
        $data = $user_service->get_all_users();
        Flight::json([
            'data' => $data,
        ]);
    }
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

/**
 * @OA\Post(
 *     path="/users/update-role",
 *     tags={"USERS"},
 *     summary="Update user role",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"user_id","role"},
 *             @OA\Property(property="user_id", type="integer"),
 *             @OA\Property(property="role", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *          response=200,
 *          description="Role updated successfully"
 *     )
 * )
 */
Flight::route('POST /users/update-role', function() {
    $request = Flight::request();
    $user_id = $request->data->user_id;
    $role = $request->data->role;
    
    $user_service = Flight::get('user_service');
    $result = $user_service->update_user_role($user_id, $role);
    
    Flight::json(['message' => 'Role updated successfully']);
});

Flight::route('GET /users/get', function() {
    try {
        $users = Flight::get('user_service')->get_all_users();
        Flight::json(['data' => $users]);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});