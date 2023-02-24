const express = require('express')
const router = express.Router()
const salaries = require('../controllers/salaryController')
const protect = require('../controllers/authController/protect')
const restrictTo = require('../utils/restrictTo')

router.use(protect)

router.get('/', salaries.getAllSalaries)
router.get('/:id', salaries.getSalary)

router.use(restrictTo('admin', 'manager'))
router.route('/:id').patch(salaries.updateSalary).delete(salaries.deleteSalary)

router.post('/', salaries.createSalary)
module.exports = router
