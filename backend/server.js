const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage for widget configurations
let widgetConfigs = {};

// Route to get data from Myntra API
app.get("/api/products/:id", async (req, res) => {
  const productId = req.params.id;
  const maxCount = req.query.maxCount || 15;
  const url = `https://myntra.com/gateway/v2/product/${productId}/cross-sell?maxCount=${maxCount}`;

  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from Myntra API" });
  }
});

// Route to fetch widget configuration
app.get("/api/widget/:id", (req, res) => {
  const widgetId = req.params.id;
  if (!widgetConfigs[widgetId]) {
    return res.status(404).json({ error: "Widget not found" });
  }
  res.json(widgetConfigs[widgetId]);
});

// Route to create/update widget configuration
app.post("/api/widget", (req, res) => {
  const { id, apiInfo, fieldMapping, uiConfig } = req.body;

  if (!id || !apiInfo) {
    return res.status(400).json({ error: "Widget ID and API info are required" });
  }

  widgetConfigs[id] = { apiInfo, fieldMapping, uiConfig };
  res.json({ message: "Widget configuration saved successfully" });
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
