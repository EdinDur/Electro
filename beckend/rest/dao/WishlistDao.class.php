<?php

require_once __DIR__ . '/BaseDao.class.php';

class WishlistDao extends BaseDao {
    public function __construct() {
        parent::__construct('wishlist');
    }

    public function add_to_wishlist($wishlist) {
        if (!isset($wishlist['username']) || !isset($wishlist['productName'])) {
            return null;
        }

        $entity = [
            'username' => $wishlist['username'],
            'productName' => $wishlist['productName']
        ];
        return $this->insert($entity);
    } 
    public function get_wishlist($username){
        return $this->query_unique(
        "SELECT p.mImage, p.productName, p.price
        FROM wishlist c
        JOIN products p ON c.productName = p.productName
        WHERE c.username = :username;",
        [
            ":username" => $username
        ]
        );
    } 
    public function delete_wishlist_all($username){
        $query = "DELETE FROM wishlist WHERE username = :username";
            $this->execute($query, [
                ':username' => $username
            ]);
    }
    public function delete_product_from_wishlist($username, $productName){
        $query = "DELETE FROM wishlist WHERE username = :username AND productName = :productName";
        $this->execute($query, [
            ':username' => $username,
            ':productName' => $productName
        ]);
    }
}