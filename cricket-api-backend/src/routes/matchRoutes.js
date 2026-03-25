const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

// GET /api/match/:id/playing-xi
router.get('/match/:id/playing-xi', matchController.getPlayingXI);

// GET /api/match/:id/stats
router.get('/match/:id/stats', matchController.getMatchStats);

module.exports = router;
