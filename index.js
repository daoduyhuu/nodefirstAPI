const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');

const usersRoute = require('./routes/users.route');


//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

//route
app.use('/users', usersRoute);
app.get('/',(req,res)=> res.status(200).json("trang chu"));



app.listen('3001', () => {
    console.log('sever started on port 3001');
});
