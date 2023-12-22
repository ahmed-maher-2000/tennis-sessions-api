const express = require('express')
const router = express.Router()
const academys = require('../controllers/academyController')
const protect = require('../middlewares/protect')
const restrictTo = require('../utils/restrictTo')

router.get('/', academys.getAllAcademys)
router.get('/search', academys.searchAcademy)
router.get('/:id', academys.getAcademy)

router.use(protect)
router.use(restrictTo('admin', 'manager'))
router.post('/', academys.createAcademy)
router
    .route('/:id')

    .patch(academys.updateAcademy)
    .delete(academys.deleteAcademy)

module.exports = router
