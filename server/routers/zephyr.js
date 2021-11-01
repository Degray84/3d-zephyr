const express = require('express')
const router = express.Router()
const {
	getModels,
	postModel,

} = require('../controllers/zephyr.js')

router
	.get('/models/', getModels)
	.post('/models/', postModel)

module.exports = router