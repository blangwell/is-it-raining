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
  res.render('home');
})

app.get('/search', (req, res) => {
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${req.query.location}&APPID=${API_KEY}`)
  .then(response => {
    console.log(response.data.weather[0]);
    let describeWeather = response.data.weather[0].main;
    let tempFahr = Math.round(response.data.main.temp * (9 / 5) - 459.67);
    let feelsLikeFahr = Math.round(response.data.main.feels_like * (9 / 5) - 459.67);
    res.render('results', {
      description: describeWeather,
      tempFahr: tempFahr,
      feelsLikeFahr: feelsLikeFahr
    });
  })
  .catch(err => console.log(err));
})

app.listen(PORT, () => console.log(`server running on ${PORT}`)); 