var express = require('express');
var app = express();

app.use(express.static(__dirname + '/../public/app'));
console.log(__dirname + '/../public/app');
app.listen(3000);