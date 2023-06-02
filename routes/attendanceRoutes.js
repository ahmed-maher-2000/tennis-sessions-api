const express = require('express')
const router = express.Router()
const attendances = require('../controllers/attendanceController')
const protect = require('../controllers/authController/protect')
const restrictTo = require('../utils/restrictTo')

router.use(protect)

router.post(
    '/',
    attendances.createAttendanceMiddleware,
    attendances.createAttendance
)

router.use(restrictTo('admin'))
router.get('/', attendances.getAllAttendances)
router
    .route('/:id')
    .get(attendances.getAttendance)
    .patch(attendances.updateAttendance)
    .delete(attendances.deleteAttendance)

module.exports = router
