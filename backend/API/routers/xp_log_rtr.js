const express = require('express');
const { XPLog } = require("../models"); // Adjust the path based on your project structure
const xp_log_ctrl = require('../controllers/xp_log_ctrl');
const router = express.Router();



router.post('/addXPLog', xp_log_ctrl.createXPLog)
router.get('/getLogs/:user_ID', xp_log_ctrl.getXPLogsByUser)




module.exports = router;