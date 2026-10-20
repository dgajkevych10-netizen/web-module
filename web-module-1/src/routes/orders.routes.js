// HTTP-шар: розбір запиту, виклик сервісу, вибір статус-коду й формату відповіді.

const express = require("express");
const service = require("../services/orders.service");

const router = express.Router();

function orderNotFound() {
  return {
    error: { code: "ORDER_NOT_FOUND", message: "Order not found" },
  };
}

router.post("/", (req, res) => {
  const order = service.createOrder(req.body);
  res.status(201).location(`/orders/${order.id}`).json(order);
});

router.get("/", (req, res) => {
  const orders = service.listOrders();
  res.status(200).json({ orders, count: orders.length });
});

router.get("/:id", (req, res) => {
  const order = service.getOrder(req.params.id);
  if (!order) return res.status(404).json(orderNotFound());
  return res.status(200).json(order);
});

router.delete("/:id", (req, res) => {
  if (!service.deleteOrder(req.params.id)) {
    return res.status(404).json(orderNotFound());
  }
  return res.status(204).send();
});

module.exports = router;
