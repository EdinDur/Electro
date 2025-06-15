<?php

require __DIR__ . '/../../../vendor/autoload.php';

if($_SERVER['SERVER_NAME'] == 'localhost' || $_SERVER['SERVER_NAME'] == '127.0.0.1'){
   define('BASE_URL', 'http://localhost/WebProgramming/beckend/');
} else {
   define('BASE_URL', 'https://electro-bcqmb.ondigitalocean.app/beckend/');
}


error_reporting(1);

$openapi = \OpenApi\Generator::scan(['../../../rest/routes/', './']);
header('Content-Type: application/x-yaml');
echo $openapi->toYaml();
?>
