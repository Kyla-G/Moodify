const express = require('express');
const xp_info_ctrl = require('../controllers/xp_info_ctrl');
const router = express.Router();


router.get('/getXpInfo/:user_id', xp_info_ctrl.getXPInfo)
router.post('/addXpInfo', xp_info_ctrl.addXPInfo)





module.exports = router;