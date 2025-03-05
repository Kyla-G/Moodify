const express = require('express');
const MoodEntries = require('../controllers/mood_entries_ctrl');
const router = express.Router();


// router.get('/getUser/:id', user_ctrl.getUserById)
// router.get('/getAllUsers', user_ctrl.getAllUsers)
// router.post('/addUser', user_ctrl.addUser);
// router.put('/updateUser/:id', user_ctrl.updateUserById)

router.post('/addMood', MoodEntries.addMood)
router.post('/addEmotion', MoodEntries.addEmotion)
router.get('/getEntry/:id', MoodEntries.getMoodEntryById)
router.get('/getAllEntries', MoodEntries.getAllMoodEntries)
router.put('/updateEntry/:id', MoodEntries.updateMoodEntryById)


module.exports = router;