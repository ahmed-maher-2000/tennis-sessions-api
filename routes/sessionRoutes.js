const express = require('express')
const router = express.Router()
const sessions = require('../controllers/sessionController')
const protect = require('../controllers/authController/protect')
const restrictTo = require('../utils/restrictTo')

router.use(protect)
router.get('/', sessions.getAllSessions)
router.get('/:id', sessions.getSession)

router.use(restrictTo('admin', 'manager'))
router
    .route('/:id')
    .post(sessions.createSession)
    .patch(sessions.updateSession)
    .delete(sessions.deleteSession)

module.exports = router
