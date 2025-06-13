<?php

require_once __DIR__ . '/BaseDao.class.php';

class CheckoutDao extends BaseDao {
    public function __construct() {
        parent::__construct('orders');
        if (!isset($this->conn)) {
            $this->conn = $this->connection;
        }
    }

    public function checkout_cart($username) {
        $stmt = $this->conn->prepare("CALL CheckoutCart(:username)");
        $stmt->execute(['username' => $username]);
        $result = $stmt->fetch();
        if (!$result || !isset($result['orderId'])) {
            throw new Exception("Failed to create order or get orderId from CheckoutCart procedure.");
        }
        return $result['orderId'];
    }

    private function null_if_empty($value) {
        return (isset($value) && $value !== '') ? $value : null;
    }

    public function insert_billing_details($orderId, $billing) {
        $stmt = $this->conn->prepare(
            "INSERT INTO billing_details (orderId, firstName, lastName, email, address, city, country, zipCode, telephone, orderNotes)
             VALUES (:orderId, :firstName, :lastName, :email, :address, :city, :country, :zipCode, :telephone, :orderNotes)"
        );
        $stmt->execute([
            "orderId" => $orderId,
            "firstName" => $this->null_if_empty($billing["fname"]),
            "lastName" => $this->null_if_empty($billing["lname"]),
            "email" => $this->null_if_empty($billing["email"]),
            "address" => $this->null_if_empty($billing["address"]),
            "city" => $this->null_if_empty($billing["city"]),
            "country" => $this->null_if_empty($billing["country"]),
            "zipCode" => $this->null_if_empty($billing["zip"]),
            "telephone" => $this->null_if_empty($billing["tel"]),
            "orderNotes" => $this->null_if_empty($billing["onotes"] ?? null)
        ]);
        return $this->conn->lastInsertId();
    }

    public function insert_payment($orderId, $payment) {
        $stmt = $this->conn->prepare(
            "INSERT INTO payments (orderId, paymentMethod, cardNumber, expirationMonth, expirationYear, ccv, paypalUsername, paypalVerificationCode, paymentStatus)
             VALUES (:orderId, :paymentMethod, :cardNumber, :expirationMonth, :expirationYear, :ccv, :paypalUsername, :paypalVerificationCode, :paymentStatus)"
        );
        $expMonth = $expYear = null;
        if (isset($payment["exp-date"])) {
            $expParts = explode("/", $payment["exp-date"]);
            if (count($expParts) === 2) {
                $expMonth = $expParts[0];
                $expYear = "20" . $expParts[1];
            }
        }
        $stmt->execute([
            "orderId" => $orderId,
            "paymentMethod" => $this->null_if_empty($payment["payment"]),
            "cardNumber" => $this->null_if_empty($payment["card-number"] ?? null),
            "expirationMonth" => $this->null_if_empty($expMonth),
            "expirationYear" => $this->null_if_empty($expYear),
            "ccv" => $this->null_if_empty($payment["ccv"] ?? null),
            "paypalUsername" => $this->null_if_empty($payment["username"] ?? null),
            "paypalVerificationCode" => $this->null_if_empty($payment["verification"] ?? null),
            "paymentStatus" => $this->null_if_empty($payment["paymentStatus"] ?? 'Pending')
        ]);
        return $this->conn->lastInsertId();
    }

    public function insert_order_summary($orderId, $billingId, $paymentId) {
        $stmt = $this->conn->prepare(
            "INSERT INTO order_summary (orderId, billingId, paymentId)
             VALUES (:orderId, :billingId, :paymentId)"
        );
        $stmt->execute([
            "orderId" => $orderId,
            "billingId" => $billingId,
            "paymentId" => $paymentId
        ]);
        return $this->conn->lastInsertId();
    }
}
