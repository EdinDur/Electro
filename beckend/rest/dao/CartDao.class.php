<?php

require_once __DIR__ . '/BaseDao.class.php';

class CartDao extends BaseDao {
    public function __construct() {
        parent::__construct('carts');
    }
    
    public function add_to_cart($cart) {
        if (!isset($cart['username']) || !isset($cart['productName'])) {
            return null;
        }
    
        $entity = [
            'username' => $cart['username'],
            'productName' => $cart['productName']
        ];  
        return $this->insert($entity);
    } 
    public function get_cart($username){
        return $this->query_unique(
        "SELECT p.mImage, p.productName, p.price
        FROM carts c
        JOIN products p ON c.productName = p.productName
        WHERE c.username = :username;",
        [
            ":username" => $username
        ]
        );
    } 
    public function delete_cart_all($username){
        $query = "DELETE FROM carts WHERE username = :username";    
            $this->execute($query, [
                ':username' => $username
            ]);         
    }
    
}