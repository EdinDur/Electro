<?php

// Set the reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL ^ (E_NOTICE | E_DEPRECATED));

/*
// Database access credentials
define('DB_NAME', 'electrodb');
define('DB_PORT', 3306);
define('DB_USER', 'root');
define('DB_PASSWORD', 'Ammarudin');
define('DB_HOST', '127.0.0.1'); // localhost

// JWT secret
define("JWT_SECRET","BK/7uQCS4]c/{:fy)Gm.X)XWz58?TS");
*/
    class Config {
        public static function DB_NAME() {
            return Config::get_env("DB_NAME", "electrodb");
        }
        public static function DB_PORT() {
            return Config::get_env("DB_PORT", 3306);
        }
        public static function DB_USER() {
            return Config::get_env("DB_USER", 'root');
        }
        public static function DB_PASSWORD() {
            return Config::get_env("DB_PASSWORD", 'Ammarudin');
        }
        public static function DB_HOST() {
            return Config::get_env("DB_HOST", 'localhost');
        }
        public static function JWT_SECRET() {
            return Config::get_env("JWT_SECRET", 'BK/7uQCS4]c/{:fy)Gm.X)XWz58?TS');
        }
        public static function get_env($name, $default){
            return isset($_ENV[$name]) && trim($_ENV[$name]) != "" ? $_ENV[$name] : $default;
        }
    }
?>