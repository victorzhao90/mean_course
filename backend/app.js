const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const path = require('path'); // Add this line to import the path module

const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://hbzhao1990:' + process.env.MONGO_ATALAS_PW + '@cluster0.ira4fu4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', 
    {useNewUrlParser: true}).then(() => {
        console.log('Connected to database');
    }).catch(() => {
        console.log('Connection failed');
    })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use((req,res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS,PUT");

    next();
})
app.use("/images", express.static(path.join("backend/images")));
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);


module.exports = app;