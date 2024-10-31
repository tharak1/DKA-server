const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000
app.use(cors());

app.use(express.json()); 
app.use('/api/forgotPassword',require("./Routes/SendMailRoutes"));

app.listen(port,"0.0.0.0",()=>{
    console.log("server is live at ",port);  
});