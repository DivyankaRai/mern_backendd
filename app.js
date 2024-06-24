const express = require('express')
const router = require('./routes/router')
const cors = require('cors')
require("dotenv").config({ path: '.env'})
const cookieParser = require('cookie-parser')
require('./db/db')

const app = express()
app.use(cors({
    origin: 'https://667913ed120fca60450c8b60--eloquent-praline-44b1e3.netlify.app', // Replace with your frontend's URL
    credentials: true 
}));
app.use(express.json())
app.use(cookieParser())
app.use(router)
app.use("/uploads", express.static("./uploads"))


app.listen(8000,()=>{
    console.log("server started")
})
