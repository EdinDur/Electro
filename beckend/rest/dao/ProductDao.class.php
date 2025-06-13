<?php

require_once __DIR__ . '/BaseDao.class.php';

class ProductDao extends BaseDao {
    public function __construct() {
        parent::__construct('products');
    }
    
    public function get_product_display() {
        return $this->query(
            "SELECT productName, category, price, stock, productNew, sale, mImage FROM products"
        );
    }
    public function get_product_by_category($category){
        return $this->query_unique(
            "SELECT productName, category, price, productNew, sale, mImage FROM products WHERE category LIKE :category",
            [
                ":category" => $category
            ]
        );
    }
    public function get_product_by_search($input){
        return $this->query_unique(
            "SELECT productName, category, price, productNew, sale, mImage 
            FROM products 
            WHERE productName LIKE :input 
            OR category LIKE :input",
            [
                ":input" => "%$input%"
            ]
        );
    }
    public function get_product_new() {
        return $this->query(
            "SELECT productName, category, price, productNew, sale, mImage FROM products WHERE productNew = true"
        );
    }
    public function get_product_by_name($productName){
        return $this->query_unique_single_row(
            "SELECT *
            FROM products 
            WHERE productName LIKE :productName",
            [
                ":productName" => $productName
            ]
        );
    }
}