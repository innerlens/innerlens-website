const express = require('express');
const router = express.Router();

router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Add more routes here
// router.post('/submit', (req, res) => { ... });

module.exports = router;
