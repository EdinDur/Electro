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
            "SELECT productName, category, price, stock, productNew, sale, mImage 
            FROM products 
            WHERE productNew = true"
        );
    }

    public function get_product_by_name($productName){
        return $this->query_unique_single_row(
            "SELECT * FROM products WHERE productName = :productName",
            [
                ":productName" => $productName
            ]
        );
    }

    public function update_product_price($productName, $price) {
        try {
            if (!is_numeric($price) || $price < 0) {
                throw new Exception("Invalid price value");
            }

            $query = "UPDATE products SET price = :price WHERE productName = :productName";
            $params = [
                ':productName' => $productName,
                ':price' => $price
            ];
            
            $statement = $this->execute($query, $params);
            return $statement->rowCount() > 0;

        } catch (Exception $e) {
            error_log("Price update failed: " . $e->getMessage());
            throw $e;
        }
    }

    public function add_to_cart($productName, $quantity) {
        try {
            // Start transaction
            $this->conn->beginTransaction();

            // Check current stock
            $product = $this->query_unique_single_row(
                "SELECT stock FROM products WHERE productName = :productName FOR UPDATE",
                ["productName" => $productName]
            );

            if (!$product || $product['stock'] < $quantity) {
                $this->conn->rollBack();
                throw new Exception("Insufficient stock");
            }

            // Update the stock
            $result = $this->execute(
                "UPDATE products 
                SET stock = stock - :quantity 
                WHERE productName = :productName 
                AND stock >= :quantity",
                [
                    "productName" => $productName,
                    "quantity" => $quantity
                ]
            );

            if ($result->rowCount() === 0) {
                $this->conn->rollBack();
                throw new Exception("Failed to update stock");
            }

            
            $result = $this->execute(
                "INSERT INTO carts (username, productName, quantity, created_at) 
                VALUES (:username, :productName, :quantity, NOW())",
                [
                    "username" => $_SESSION['username'] ?? 'guest', 
                    "productName" => $productName,
                    "quantity" => $quantity
                ]
            );

            $this->conn->commit();
            return true;

        } catch (Exception $e) {
            $this->conn->rollBack();
            error_log("Database error: " . $e->getMessage());
            throw $e;
        }
    }
}