<?php

require_once __DIR__ . "/../dao/CartDao.class.php";

class CartService {
    private $cart_dao;

    public function __construct() {
        $this->cart_dao = new CartDao();
    }
    public function add_to_cart($cart) {
        return $this->cart_dao->add_to_cart($cart);
    }
    public function get_cart($username) {
        return $this->cart_dao->get_cart($username);
    }
    public function delete_cart_all($username) {
        return $this->cart_dao->delete_cart_all($username);
    }
    public function delete_product_from_cart($username, $productName) {
        return $this->cart_dao->delete_product_from_cart($username, $productName);
    }
}