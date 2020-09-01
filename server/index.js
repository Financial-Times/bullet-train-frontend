const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const express = require('express');
const api = require('./api');
const spm = require('./middleware/single-page-middleware');
const webpackMiddleware = require('./middleware/webpack-middleware');
const EdTechAuth = require('@financial-times/ed-tech-auth')
const session = require('cookie-session')

const isDev = process.env.NODE_ENV !== 'production';
const app = express();
const port = process.env.PORT || 3000;
app.use(session({
    secret: process.env.SESSION_SECRET
  }))


  
  const auth = new EdTechAuth(app);
  app.use(auth.middleware);
  
  
  if (isDev) { // Serve files from src directory and use webpack-dev-server
    console.log('Enabled Webpack Hot Reloading');
    webpackMiddleware(app);
    app.set('views', 'web/');
    app.use(express.static('web'));
} else { // Serve files from build directory
    console.log('Running production mode');
    app.use(express.static('build'));
    app.set('views', 'build/');
}

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// parse various different custom JSON types as JSON
app.use(bodyParser.json());

app.use('/api', api());
app.use(spm);
app.get('/', (req, res) => {
    console.log('Returning index');
    if (isDev) {
        return res.render('index', {
            isDev,
        });
    }
    return res.render('static/index', {
        isDev,
    });
});

app.listen(port, () => {
    console.log(`Server listening on: ${port}`);
});
