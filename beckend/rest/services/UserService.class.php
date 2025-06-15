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
        $user['newPassword'] = password_hash($user['newPassword'], PASSWORD_BCRYPT);
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
    public function get_user_orders($user_id) {
        return $this->user_dao->get_user_orders($user_id);
    }
    public function get_order_items($order_id) {
        return $this->user_dao->get_order_items($order_id);
    }
    public function get_user_by_username($username) {
        return $this->auth_dao->get_user_by_username($username);
    }

    public function get_all_users() {
        return $this->user_dao->get_all_users();
    }
    public function update_user_role($user_id, $role) {
        return $this->user_dao->update_user_role($user_id, $role);
    }
}
