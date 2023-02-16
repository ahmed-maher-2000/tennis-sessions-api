const express = require('express')
const router = express.Router()
const requests = require('../controllers/requestController')
const protect = require('../controllers/authController/protect')
const restrictTo = require('../utils/restrictTo')

router.post('/', requests.createRequest)

router.use(protect)
router.use(restrictTo('admin', 'manager'))

router.get('/', requests.getAllRequests)
router.get('/search', requests.searchRequest)

router
    .route('/:id')
    .post(requests.acceptOrRefuseRequest)
    .get(requests.getRequest)
    .patch(requests.updateRequest)
    .delete(requests.deleteRequest)

module.exports = router
