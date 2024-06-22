const express = require('express')
const router = require('./routes/router')
const cors = require('cors')
require("dotenv").config({ path: '.env'})
const cookieParser = require('cookie-parser')
require('./db/db')

const app = express()
app.use(cors({
    origin: 'https://client-51bybkk6l-divyankarais-projects.vercel.app', // Replace with your frontend's URL
    credentials: true // Required if your frontend and backend use cookies
}));
app.use(express.json())
app.use(cookieParser())
app.use(router)
app.use("/uploads", express.static("./uploads"))


app.listen(8000,()=>{
    console.log("server started")
})
