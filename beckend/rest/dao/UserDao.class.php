<?php

require_once __DIR__ . '/BaseDao.class.php';

class UserDao extends BaseDao {
    public function __construct() {
        parent::__construct('users');
    }
    
    public function add_user($user) {
        if (!isset($user['username']) || !isset($user['email']) || !isset($user['psw'])) {
            return null;
        }
    
        $entity = [
            'username' => $user['username'],
            'email' => $user['email'],
            'userPassword' => $user['psw']
        ];
    
        return $this->insert($entity);
    }
    public function get_user_login($user) {
        if (!isset($user['username']) || !isset($user['psw'])) {
            return null;
        }

        $query = "SELECT * FROM users WHERE username = :username";
        $params = [
            "username" => $user['username']
        ];

        $row = $this->query_unique($query, $params);

        if ($row && password_verify($user['psw'], $row['userPassword'])) {
            return $row;
        } else {
            return null;
        }
    }
    public function edit_user($user) {
        $query = "UPDATE users SET userPassword = :newPassword WHERE username = :username";
    
        $params = [
            ":newPassword" => $user['newPassword'],
            ":username" => $user['username']
        ];
    
        return $this->query_unique($query, $params);
    }

    public function delete_user($username) {
        try {
            $query = "DELETE FROM users WHERE username = :username";
            $this->execute($query, [':username' => $username]);
            return true;
        } catch (PDOException $e) {
            error_log("Error in UserDao while deleting user: " . $e->getMessage());
            return false;
        }
    }

    public function get_user_orders($username) {
        $stmt = $this->connection->prepare("
            SELECT 
                o.id AS order_id,
                o.orderDate AS date,
                GROUP_CONCAT(CONCAT(oi.productName, ' x', oi.quantity) SEPARATOR ', ') AS items,
                o.totalPrice AS total,
                o.status
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.orderId
            WHERE o.username = :username
            GROUP BY o.id, o.orderDate, o.totalPrice, o.status
            ORDER BY o.orderDate DESC
        ");
        $stmt->execute(['username' => $username]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function get_order_items($order_id) {
        $stmt = $this->connection->prepare("
            SELECT productName, quantity, price
            FROM order_items
            WHERE orderId = :order_id
        ");
        $stmt->execute(['order_id' => $order_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function update_user_role($user_id, $role) {
        $query = "UPDATE users SET userRole = :role WHERE id = :user_id";
        return $this->query_unique($query, [
            ':role' => $role,
            ':user_id' => $user_id
        ]);
    }

    public function get_all_users() {
        return $this->query("SELECT id, username, email, userRole, created_at FROM users");
    }

}