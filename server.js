var express = require('express');
var qs = require('querystring');
var bodyParser = require('body-parser')

var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

var mysql = require('mysql2');
var connection = mysql.createConnection({
  user: 'root',
  database: 'employees',
  password: 'nishant123'
});
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/JS'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/explore', function(req, res) {
  var query = req.query.q;
  if (req.method == 'POST') {
    query = req.body.q;
  }
  return process(query, req, res);

});

function process(query, req, res) {
  connection.execute(query, function(err, rows) {
    console.log(err);
    if (!err) {
      var data = [];
      for (i = 0; i < rows.length; i++) {
        data.push(rows[i].year);
        data.push(rows[i].track);
        data.push(rows[i].market_share);
      }
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.end(JSON.stringify({
        status: 'success',
        rows: JSON.stringify(rows)
      }));
    } else {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.end(JSON.stringify({
        status: 'failure',
        error: JSON.stringify(err)
      }));
    }
  });
};

var server = app.listen(3000, function() {
  console.log("We have started our server on port 3000");
});
