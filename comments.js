// Create web server
// Create a new web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

// Set the port
app.set('port', 3000);

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Set the view engine
app.set('view engine', 'jade');

// Set the body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Set the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the comments file
var commentsFile = path.join(__dirname, 'data', 'comments.json');

// Create the comments file if it doesn't exist
if (!fs.existsSync(commentsFile)) {
  fs.writeFileSync(commentsFile, JSON.stringify([]));
}

// Create the home route
app.get('/', function(req, res) {
  // Read the comments from the comments file
  fs.readFile(commentsFile, 'utf8', function(err, data) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal server error');
      return;
    }

    // Parse the comments
    var comments = JSON.parse(data);

    // Render the home view
    res.render('home', {
      comments: comments
    });
  });
});

// Create the comment route
app.post('/comment', function(req, res) {
  // Read the comments from the comments file
  fs.readFile(commentsFile, 'utf8', function(err, data) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal server error');
      return;
    }

    // Parse the comments
    var comments = JSON.parse(data);

    // Create the new comment
    var comment = {
      name: req.body.name,
      text: req.body.text
    };

    // Add the new comment to the comments
    comments.push(comment);

    // Write the comments to the comments file
    fs.writeFile(commentsFile, JSON.stringify(comments), function(err) {
      if (err) {
        console.log(err);
        res.status(500).send('Internal server error');
        return;
      }

      // Redirect to the home page
      res.redirect('/');
    });
  });
});

// Start the server
app.listen(app.get