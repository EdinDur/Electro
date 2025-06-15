<?php

require_once __DIR__ . "/../dao/ProductDao.class.php";

class ProductService {
    private $product_dao;

    public function __construct() {
        $this->product_dao = new ProductDao();
    }
    public function get_product_display() {
        return $this->product_dao->get_product_display();
    }
    public function get_product_by_category($category) {
        return $this->product_dao->get_product_by_category($category);
    }
    public function get_product_by_search($input) {
        return $this->product_dao->get_product_by_search($input);
    }
    public function get_product_new() {
        return $this->product_dao->get_product_new();
    }
    public function get_product_by_name($productName) {
        return $this->product_dao->get_product_by_name($productName);
    }
    public function update_product_price($productName, $price) {
        try {
            if (empty($productName)) {
                throw new Exception("Product name cannot be empty");
            }
            return $this->product_dao->update_product_price($productName, $price);
        } catch (Exception $e) {
            error_log("Service layer error: " . $e->getMessage());
            throw $e;
        }
    }
    public function add_to_cart($productName, $quantity) {
        try {
            if (empty($productName)) {
                throw new Exception("Product name cannot be empty");
            }
            
            if (!is_numeric($quantity) || $quantity < 1) {
                throw new Exception("Invalid quantity. Must be at least 1");
            }

            
            $product = $this->product_dao->get_product_by_name($productName);
            if (!$product) {
                throw new Exception("Product not found");
            }

            if ($product['stock'] < $quantity) {
                throw new Exception("Insufficient stock. Only " . $product['stock'] . " available");
            }

            return $this->product_dao->add_to_cart($productName, $quantity);
        } catch (Exception $e) {
            error_log("Service layer error: " . $e->getMessage());
            throw $e;
        }
    }
}