if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const db = require('./db.js');
const brandsRouter = require('./routes/brand.js');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));
app.use(express.static('node_modules/bootstrap/dist'));
app.use(express.static('node_modules/jquery/dist'));
app.use(express.static('node_modules/axios/dist'));
app.use(express.static('node_modules/lit-html'));
app.use(express.json());

const port = process.env.PORT || 7000;

server.listen(port, () => {
  console.log('listening on port ' + port);
})


app.get('/admin', async (req, res) => {
  try {
    const data = await db
      .select('table_name')
      .from('information_schema.tables')
      .where('table_schema', 'public');

    //console.log(data)

    res.render('dashboard', {
      title: "MCVPerformance | panel admin",
      tables: data
    })
  }
  catch (err) {
    console.log(err)
    res.send(err)
  }

});


app.use(brandsRouter);

// reload page redirect admin
app.use((req, res) => {
  res.redirect('/admin')
})





