<?php

require_once __DIR__ . "/../dao/UserDao.class.php";

class UserService {
    private $user_dao;

    public function __construct() {
        $this->user_dao = new UserDao();
    }
    public function add_user($user) {
        $user["psw"] = password_hash($user["psw"], PASSWORD_BCRYPT);
        return $this->user_dao->add_user($user);
    }
    public function get_user_login($user) {
        return $this->user_dao->get_user_login($user);
    }
    public function edit_user($user) {
        return $this->user_dao->edit_user($user);
    }
    public function delete_user($username) {
        try {
            return $this->user_dao->delete_user($username);
        } catch (Exception $e) {
            error_log("Error in UserService while deleting user: " . $e->getMessage());
            return false;
        }
    }
}
