// Бізнес-логіка замовлень: валідація, нормалізація, розрахунок total,
// генерація id і статусу. Не залежить від Express.

const { randomUUID } = require("node:crypto");
const store = require("../store/orders.store");
const { ValidationError, findOrderProblems } = require("../validation/orders.validation");

const DEFAULT_ORDER_STATUS = "created";

function makeOrderId() {
  return `ord-${randomUUID().slice(0, 8)}`;
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function calculateTotal(items) {
  return roundMoney(
    items.reduce((sum, item) => sum + item.quantity * item.price, 0),
  );
}

// Беремо з клієнта лише відомі поля: id, status і total клієнт задати не може.
function createOrder(input) {
  const problems = findOrderProblems(input);
  if (problems.length > 0) {
    throw new ValidationError(problems);
  }

  const items = input.items.map((item) => ({
    name: item.name.trim(),
    quantity: item.quantity,
    price: item.price,
  }));

  return store.add({
    id: makeOrderId(),
    customerName: input.customerName.trim(),
    items,
    total: calculateTotal(items),
    status: DEFAULT_ORDER_STATUS,
  });
}

const listOrders = () => store.list();
const getOrder = (id) => store.findById(id);
const deleteOrder = (id) => store.remove(id);

module.exports = { createOrder, listOrders, getOrder, deleteOrder };
