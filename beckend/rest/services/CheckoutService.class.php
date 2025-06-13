<?php

require_once __DIR__ . '/../dao/CheckoutDao.class.php';

class CheckoutService {
    private $dao;

    public function __construct() {
        $this->dao = new CheckoutDao();
    }

    public function process_checkout($payload) {
        $username = $payload['username'];
        $billing = $payload['billing'];
        $payment = $payload['payment'];

        // 1. Call stored procedure to create order and get orderId
        $orderId = $this->dao->checkout_cart($username);

        // 2. Insert billing details
        $billingId = $this->dao->insert_billing_details($orderId, $billing);

        // 3. Insert payment details
        $paymentId = $this->dao->insert_payment($orderId, $payment);

        // 4. Insert order summary
        $summaryId = $this->dao->insert_order_summary($orderId, $billingId, $paymentId);

        return [
            "orderId" => $orderId,
            "billingId" => $billingId,
            "paymentId" => $paymentId,
            "summaryId" => $summaryId,
            "message" => "Order placed successfully"
        ];
    }
}
