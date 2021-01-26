require('dotenv').config();
const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT;
const axios = require('axios');
const ejsLayouts = require('express-ejs-layouts');
const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname + '/public')));
app.set('view engine', 'ejs');
app.use(ejsLayouts);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  next();
})

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/search', (req, res) => {
  axios.get(`https://api.openweathermap.org/data/2.5/weather?zip=${req.query.location}&APPID=${API_KEY}`)
  .then(response => {
    let describeWeather = response.data.weather[0].main;
    let tempFahr = Math.round(response.data.main.temp * (9 / 5) - 459.67);
    let feelsLikeFahr = Math.round(response.data.main.feels_like * (9 / 5) - 459.67);
    let yesOrNo;
    let raining;
    if (describeWeather === 'Rain') {
      yesOrNo = 'yes, it\'s raining';
      raining = true;
    } else {
      yesOrNo = 'no it isn\'t';
      raining = false;
    }
    res.render('results', {
      flash: req.flash,
      description: describeWeather,
      feelsLikeFahr: feelsLikeFahr,
      raining: raining,
      search: req.query.location,
      tempFahr: tempFahr,
      yesOrNo: yesOrNo
    });
  })
  .catch(err => {
    console.log(err);
    req.flash('error', 'please enter a valid zipcode')
    res.redirect('/')
  });
});

app.listen(PORT, () => console.log(`server running on ${PORT}`)); 