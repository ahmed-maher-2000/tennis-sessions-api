const express = require('express')
const router = express.Router()
const presences = require('../controllers/presenceController')
const protect = require('../controllers/authController/protect')
const restrictTo = require('../utils/restrictTo')

router.use(protect)

router.post(
    '/:token',
    presences.createPresenceMiddleware,
    presences.createPresence
)

router.use(restrictTo('admin'))
router.get('/', presences.getAllPresences)
router
    .route('/:id')
    .get(presences.getPresence)
    .patch(presences.updatePresence)
    .delete(presences.deletePresence)

module.exports = router
