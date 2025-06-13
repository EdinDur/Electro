<?php

require_once __DIR__ . '/../services/CheckoutService.class.php';

Flight::set('checkout_service', new CheckoutService());

Flight::route('POST /checkout', function() {
    $payload = json_decode(Flight::request()->getBody(), true);
    $result = Flight::get('checkout_service')->process_checkout($payload);
    Flight::json($result);
});
