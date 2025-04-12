const express = require('express');
const { XPProgress } = require("../models"); // Adjust the path based on your project structure
const xp_progress_ctrl = require('../controllers/xp_progress_ctrl');
const router = express.Router();



router.post('/addXPProgress', xp_progress_ctrl.createXPProgress)




module.exports = router;