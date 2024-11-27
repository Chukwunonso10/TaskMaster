const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const PORT = process.env.port || 3000
const dotenv = require('dotenv')
const userRoutes = require('./routes/userRoutes')
const taskRoutes = require('./routes/taskRoutes')

dotenv.config()
const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/user', userRoutes)
app.use('/task', taskRoutes)

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
} )