const express = require('express')
const fileUpload = require('express-fileupload');
const router = express.Router()
var common = require('./functions.js');
router.get('/', (req, res) => {
  res.render('index')
})

router.post('/test', (req, res) => {		
	common.add_weblink(req,res);
})

router.get('/contact', (req, res) => {
  res.render('contact')
})
router.get('/file_upload', (req, res) => {
  res.render('file_upload')
})
router.post('/upload', (req, res) => {
  res.render('upload')
})

module.exports = router
