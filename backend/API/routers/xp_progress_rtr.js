const express = require('express');
const XPProgress = require('../controllers/xp_progress_ctrl');
const router = express.Router();



router.post('/addXPProgress', XPProgress.createXPProgress)
router.get('/getXPProgress/:user_ID', XPProgress.getProgress)
// router.put('/updateProgress'), XPProgress.



module.exports = router;