const express = require('express')
const router = express.Router()
const applications = require('../controllers/applicationController')
const protect = require('../controllers/authController/protect')
const restrictTo = require('../utils/restrictTo')

router.post('/', applications.createApplication)

router.use(protect)
router.use(restrictTo('admin', 'manager'))

router.get('/', applications.getAllApplications)
router.get('/search', applications.searchApplication)

router
    .route('/:id')
    .post(applications.acceptOrRefuseApplication)
    .get(applications.getApplication)
    .patch(applications.updateApplication)
    .delete(applications.deleteApplication)

module.exports = router
