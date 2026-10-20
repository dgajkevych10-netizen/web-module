// Сховище замовлень у пам'яті процесу. Дані зникають після перезапуску.
// Нічого не знає про HTTP та бізнес-правила.

const orders = [];

function list() {
  return [...orders];
}

function findById(id) {
  return orders.find((order) => order.id === id);
}

function add(order) {
  orders.push(order);
  return order;
}

// Повертає true, якщо замовлення існувало й було видалене.
function remove(id) {
  const index = orders.findIndex((order) => order.id === id);
  if (index === -1) return false;
  orders.splice(index, 1);
  return true;
}

module.exports = { list, findById, add, remove };
