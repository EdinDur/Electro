<?php

// Set the reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL ^ (E_NOTICE | E_DEPRECATED));

// Database access credentials
define('DB_NAME', 'electrodb');
define('DB_PORT', 3307);
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_HOST', '127.0.0.1'); // localhost

// JWT secret
define("JWT_SECRET","BK/7uQCS4]c/{:fy)Gm.X)XWz58?TS");
