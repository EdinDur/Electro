<?php

require_once __DIR__ . "/../config.php";

class BaseDao{
    protected $connection;
    private $table;

    public function __construct($table) {
        $this->table = $table;
        try {
            $this->connection = new PDO(
                "mysql:host=" . Config::DB_HOST() . ";dbname=" . Config::DB_NAME() . ";port=" . Config::DB_PORT(),
                Config::DB_USER(),
                Config::DB_PASSWORD(), [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
            error_log("Connected to database successfully!");
        } catch (PDOException $e){
            echo "❌ Database connection failed: " . $e->getMessage();
            throw $e;
        }
    }

    protected function query($query) {
        $statement = $this->connection->prepare($query);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    protected function query_unique($query,$params){
        $statement = $this->connection->prepare($query);
        $statement->execute($params);
        return $statement->fetchAll(PDO::FETCH_ASSOC);;
    }

    protected function query_unique_single_row($query, $params) {
        $statement = $this->connection->prepare($query);
        $statement->execute($params);
        return $statement->fetch(PDO::FETCH_ASSOC);
    }

    public function insert($entity) {
        $columns = implode(', ', array_keys($entity));
        $values = ':' . implode(', :', array_keys($entity));
    
        $query = "INSERT INTO {$this->table} ({$columns}) VALUES ({$values})";
    
        $statement = $this->connection->prepare($query);
        $statement->execute($entity);
    
        return $entity;
    }
    
    protected function execute($query, $params) {
        $prepared_statement = $this->connection->prepare($query);
        if ($params) {
            foreach ($params as $key => $param) {
                $prepared_statement->bindValue($key, $param);
            }
        }
        $result = $prepared_statement->execute();
        if (!$result) {
            // Log or handle the error
            error_log("Error executing query: " . $prepared_statement->errorInfo()[2]);
        }
        return $prepared_statement;
    }
    
}
