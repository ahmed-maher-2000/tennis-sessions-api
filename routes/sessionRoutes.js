const express = require('express')
const router = express.Router()
const sessions = require('../controllers/sessionController')
const protect = require('../controllers/authController/protect')
const restrictTo = require('../utils/restrictTo')

router.use(protect)
router.get('/', sessions.getAllSessions)
router.get('/search', sessions.searchSession)
router.get('/:id', sessions.getSession)

router.use(restrictTo('admin', 'manager'))
router
    .route('/:id')
    .post(sessions.createSessionMiddleware, sessions.createSession)
    .patch(sessions.updateAndDeleteSessionMiddleware, sessions.updateSession)
    .delete(sessions.updateAndDeleteSessionMiddleware, sessions.deleteSession)

module.exports = router
