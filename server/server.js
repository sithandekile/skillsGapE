const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const dbConnection=require('./config/db')

const app = express();

// Middleware
app.use(cors('*));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/userRoutes'));
app.use('/api/problems', require('./routes/probRoutes'));
app.use('/api/submissions', require('./routes/submition'));

// Start Server + DB
const PORT = process.env.PORT || 5000;
dbConnection(); 
app.listen(PORT,()=>{
  console.log('Server is now running on http:localhost:', PORT)
})
module.exports = app
