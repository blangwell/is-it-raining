require('dotenv').config();
const API_KEY = process.env.API_KEY
const PORT = process.env.PORT;
const axios = require('axios');
const ejsLayouts = require('express-ejs-layouts');
const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.use(ejsLayouts);

app.get('/', (req, res) => {
  // axios call OpenWeatherAPI current weather data
  res.render('home');
})

app.get('/search', (req, res) => {
  console.log(req.query.location)
  axios.get(`api.openweathermap.org/data/2.5/weather?q=${req.query.location}}&appid=${API_KEY}`)
  .then(response => {
    console.log(response)
    res.redirect('/', {data: response});
  })
  .catch(err => console.log(err))
  
  // axios.get(`api.openweathermap.org/data/2.5/weather?q=${req.body.location}&appid=${API_KEY}`)
  // .then(response => {
  //   console.log(response)
  //   res.redirect('results', {response: response});
  // })
  
})

app.listen(PORT || 3000, () => console.log(`server running on ${PORT}`)); 