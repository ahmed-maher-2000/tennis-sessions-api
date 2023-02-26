const express = require('express')
const router = express.Router()
const packages = require('../controllers/packageController')
const protect = require('../controllers/authController/protect')
const restrictTo = require('../utils/restrictTo')

router.use(protect)

router.get('/', packages.getAllPackages)
router.get('/:id', packages.getPackage)

router.use(restrictTo('admin', 'manager'))
router.post('/', packages.createPackageMiddleware, packages.createPackage)
router
    .route('/:id')
    .patch(packages.updatePackage)
    .delete(packages.deletePackage)

module.exports = router
