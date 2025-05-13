<?php

require __DIR__ . '/../../../vendor/autoload.php';

define('BASE_URL', 'http://localhost/WebProgramming/beckend/');

error_reporting(1);

$openapi = \OpenApi\Generator::scan(['../../../rest/routes/', './']);
header('Content-Type: application/x-yaml');
echo $openapi->toYaml();
?>
