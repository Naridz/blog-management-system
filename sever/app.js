require('dotenv').config()
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes.js');
const postRoutes = require('./routes/postRoutes');

const app = express()
const port = process.env.PORT || 4000;

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors())

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.listen(port, function () {
  console.log(`web server listening on port ${port}`)
})