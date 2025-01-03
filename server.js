const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const globalConfigs = require('./routes/globalConfigs');
const users = require('./routes/user');
const posts = require('./routes/post');
const comments = require('./routes/comments');
const awards = require('./routes/awards');
// const mainRoute = require('./routes/index');

const app = express();

// const allowedOrigins = [ 'https://fitness-f.vercel.app',  'https://fitnessback-production.up.railway.app'];
//
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true, // Дозволяє cookie/авторизаційні заголовки
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'], // Заголовки
//   optionsSuccessStatus: 200, // Для preflight
// };
//
// app.use(cors(corsOptions));
//
// app.options('*', cors(corsOptions));

const corsOptions = {
  origin: true, // Тимчасово дозволяємо всі origins для тестування
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useFindAndModify: false ,  useUnifiedTopology: true,})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/configs', globalConfigs);
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/comments', comments);
app.use('/api/awards', awards);
// app.use('/', mainRoute);
app.get('/api', (req, res) => {
  res.status(200).send('Backend is running successfully!');
});

console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);


const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server running on port ${port}`));
