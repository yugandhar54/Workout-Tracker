require('dotenv').config()
const dns = require('dns')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const workoutRoutes = require('./routes/workouts')
const userRoutes = require('./routes/user')

// Force public DNS for MongoDB SRV resolution on some networks.
dns.setServers(['8.8.8.8', '1.1.1.1'])

const app = express()

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use('/api/workouts', workoutRoutes)
app.use('/api/user', userRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Workout Tracker backend is online' })
})

const PORT = process.env.PORT || 4000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error)
  })
