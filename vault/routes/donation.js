var express = require('express');
var router = express.Router();
const marked = require('marked');
const fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('donation', {});
});


module.exports = router;
