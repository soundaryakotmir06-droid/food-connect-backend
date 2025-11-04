/**
 * Simple Express backend scaffold for Food Donation Platform
 * Demo endpoints: auth (Google token), donations CRUD, admin analytics
 */
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Demo in-memory store (replace with MongoDB in production)
let donations = [
  {
    id: 'don1',
    donor: 'Café Aroma',
    foodType: 'Veg Sandwich Packs',
    quantity: 50,
    weightKg: 25,
    preparedOn: '2025-10-29T13:00:00Z',
    bestBefore: '2025-10-29T20:00:00Z',
    pickupLocation: 'VV Mohalla, Mysuru',
    contact: '+91 9876543210',
    status: 'Delivered',
    ngo: 'Annapurna NGO',
    pickupTime: '2025-10-29T18:30:00Z'
  }
];

// Health
app.get('/api/health', (req, res) => res.json({status: 'ok'}));

// Get donations
app.get('/api/donations', (req, res) => {
  res.json(donations);
});

// Post donation (donor)
app.post('/api/donations', (req, res) => {
  const d = req.body;
  d.id = 'don' + (donations.length + 1);
  d.status = 'Pending';
  donations.push(d);
  res.status(201).json(d);
});

// Accept donation (NGO)
app.post('/api/donations/:id/accept', (req, res) => {
  const id = req.params.id;
  const donation = donations.find(x => x.id === id);
  if (!donation) return res.status(404).json({error: 'Not found'});
  donation.status = 'Accepted';
  donation.ngo = req.body.ngo || 'NGO';
  res.json(donation);
});

// Admin analytics (pie chart data)
app.get('/api/admin/analytics/donation-status', (req, res) => {
  const counts = donations.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1;
    return acc;
  }, {});
  res.json(counts);
});

app.listen(PORT, () => console.log('Server running on port', PORT));