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
    
        $query = "SELECT * FROM users WHERE username = :username AND userPassword = :userPassword";
        $params = [
            "username" => $user['username'],
            "userPassword" => $user['psw']
        ];
    
        return $this->query_unique($query, $params);
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
    
    
}