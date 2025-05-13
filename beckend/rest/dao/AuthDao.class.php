<?php

require_once __DIR__ . '/BaseDao.class.php';

class AuthDao extends BaseDao {
    public function __construct() {
        parent::__construct('users');
    }

    public function get_user_by_username($uname) {
        $query = "SELECT * FROM users WHERE username = :uname OR email = :uname";
        return $this->query_unique_single_row($query, ["uname" => $uname]);
    }
}
