const express = require('express')
const router = express.Router()
const scores = require('../controllers/scoreController')
const protect = require('../middlewares/protect')
const restrictTo = require('../utils/restrictTo')

router.use(protect)
router.get('/', scores.getAllScores)
router.get('/best-5-players', scores.getBestFivePlayers)
router.get('/:id', scores.getScore)

router.use(restrictTo('admin', 'trainer'))
router.post('/', scores.createScoreMiddleware, scores.createScore)
router
    .route('/:id')
    .patch(scores.updateScoreMiddleware, scores.updateScore)
    .delete(scores.deleteScore)

module.exports = router
