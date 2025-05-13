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
}