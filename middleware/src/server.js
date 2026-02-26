const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mock Data Store
const orders = {
  'ORDER-001': {
    id: 'ORDER-001',
    items: [
      { sku: 'SKU-ABC', name: 'Premium Gin', quantity: 1 },
      { sku: 'SKU-DEF', name: 'Tonic Water', quantity: 2 }
    ],
    hasGiftMessage: false
  },
  'ORDER-002': {
    id: 'ORDER-002',
    items: [
      { sku: 'SKU-XYZ', name: 'Whisky Set', quantity: 1 }
    ],
    hasGiftMessage: true,
    giftMessageCode: 'GIFT-123'
  },
  'ORDER-003': {
    id: 'ORDER-003',
    items: [],
    hasGiftMessage: false
  }
};

// GET /api/order/:id
app.get('/api/order/:id', (req, res) => {
  const orderId = req.params.id;
  const order = orders[orderId];

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Simulate Mintsoft API response structure
  res.json({
    orderId: order.id,
    items: order.items,
    hasGiftMessage: order.hasGiftMessage,
    giftMessageCode: order.giftMessageCode // In real scenario, maybe we check against a known code or just boolean
  });
});

// POST /api/order/:id/dispatch
app.post('/api/order/:id/dispatch', (req, res) => {
  const orderId = req.params.id;
  const order = orders[orderId];

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Simulate dispatch process
  console.log(`Dispatching Order: ${orderId}`);

  // Simulate API delay
  setTimeout(() => {
    res.json({ success: true, message: 'Order dispatched successfully', labelUrl: 'http://mock-label-url.com/label.pdf' });
  }, 1000);
});

app.listen(port, () => {
  console.log(`Middleware server running on port ${port}`);
});
