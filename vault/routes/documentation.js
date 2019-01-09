var express = require('express');
var router = express.Router();
const marked = require('marked');
const fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
    let file = fs.readFileSync('./commands.md', 'utf8');
    res.render('documentation', {md: marked(file)});
});


module.exports = router;
