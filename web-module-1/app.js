// Збирання Express-застосунку: JSON-парсер, /health, роутер замовлень,
// 404 для невідомих маршрутів і єдиний обробник помилок.

const express = require("express");
const ordersRouter = require("./src/routes/orders.routes");
const { ValidationError } = require("./src/validation/orders.validation");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const API_VERSION = "1.0";

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", version: API_VERSION });
});

app.use("/orders", ordersRouter);

app.use((req, res) => {
  res.status(404).json({
    error: { code: "ROUTE_NOT_FOUND", message: "Route not found" },
  });
});

// Express 5 передає сюди і синхронні винятки, і відхилені промиси з обробників.
app.use((error, req, res, next) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: error.message,
        details: error.details,
      },
    });
  }

  // Некоректний JSON, виявлений express.json().
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid JSON body",
        details: ["Request body must contain valid JSON"],
      },
    });
  }

  console.error(error);
  return res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Unexpected server error" },
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Orders API is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
