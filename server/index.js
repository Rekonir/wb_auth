require('dotenv').config()

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware')

// Настройка Express для работы
const PORT = process.env.PORT || 5000;
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))
app.use('/api', router)
app.use(errorMiddleware)


const start = async () => {
  try {
    // Подлкючение к БД
    await mongoose.connect(process.env.DB_URL)
    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
  } catch (e) {
    console.log(e);
  }
}

start()
