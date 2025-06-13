<?php

require 'vendor/autoload.php';

require 'rest/routes/middleware_routes.php';
require 'rest/routes/product_routes.php';
require 'rest/routes/user_routes.php';
require 'rest/routes/cart_routes.php';
require 'rest/routes/wishlist_routes.php';
require 'rest/routes/auth_routes.php';
require 'rest/routes/checkout_routes.php';

Flight::before('start', function(&$params, &$output){
    $path = Flight::request()->url;
    if (preg_match('#^/users|^/orders#', $path)) {
        $headers = getallheaders();
        // Use 'Authentication' header as before
        $authHeader = isset($headers['Authentication']) ? $headers['Authentication'] : null;
        if ($authHeader) {
            try {
                $decoded = \Firebase\JWT\JWT::decode($authHeader, new \Firebase\JWT\Key(JWT_SECRET, 'HS256'));
                Flight::set('user', $decoded->user);
            } catch (Exception $e) {
                Flight::halt(401, "Invalid or expired token");
            }
        } else {
            Flight::halt(401, "Missing or invalid Authentication header");
        }
    }
});

Flight::start();