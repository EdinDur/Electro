<?php

require_once __DIR__ . '/../services/AuthService.class.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

Flight::set('auth_service', new AuthService());

Flight::group("/auth", function(){
    /**
     * @OA\Post(
     *      path="/auth/login",
     *      tags={"AUTH"},
     *      summary="Login",
     *      @OA\Response(
     *           response=200,
     *           description="Patient data and JWT"
     *      ),
     *      @OA\RequestBody(
     *          description="Credentials",
     *          @OA\JsonContent(
     *              required={"username","psw"},
     *              @OA\Property(property="username", type="string", example="edin123456", description="User"),
     *              @OA\Property(property="psw", type="string", example="edin1234", description="Password")
     *          )
     *      )
     * )
     */
    Flight::route("POST /login", function(){
        $payload = json_decode(Flight::request()->getBody(), true);
    
        if (!isset($payload["username"]) || !isset($payload["psw"])) {
            Flight::halt(400, "Missing required fields");
        }
    
        $user = Flight::get("auth_service")->get_user_by_username($payload["username"]);
    
        if(!$user || !password_verify($payload["psw"], $user["userPassword"])) {
            Flight::halt(401, "Invalid username or password");
        }
    
        unset($user["userPassword"]);
        
        $jwt_payload = [
            "user" => $user,
            "iat" => time(),
            "exp" => time() + (60*60*24*30) // valid for 30 days
        ];
        $token = JWT::encode(
            $jwt_payload,
            JWT_SECRET,
            "HS256"
        );
        Flight::json(
            array_merge($user, ["token" => $token])
        );
    });
    

    /**
     * @OA\Post(
     *      path="/auth/logout",
     *      tags={"AUTH"},
     *      summary="Logout",
     *      security={
     *          {"ApiKey": {}}
     *      },
     *      @OA\Response(
     *           response=200,
     *           description="Success response if unable to verify JWT token"
     *      )
     * )
     */
    Flight::route("POST /logout", function(){
        try{
            $token = Flight::request()->getHeader("Authentication");
            if(!$token)
                Flight::halt(401, "Missing authentication header");

            $decoded_token = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));

            Flight::json([
                'jwt_decoded' => $decoded_token,
                'user' => $decoded_token->user
            ]);
        }
        catch(\Exception $e){
            Flight::halt(401,$e->getMessage());
        }
    });
});
