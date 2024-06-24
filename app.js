const express = require('express')
const router = require('./routes/router')
const cors = require('cors')
require("dotenv").config({ path: '.env'})
const cookieParser = require('cookie-parser')
require('./db/db')

const app = express()
app.use(cors({
    origin: 'https://667946be3bf94c693d4ac52e--animated-palmier-872a68.netlify.app', 
    credentials: true 
}));
app.use(express.json())
app.use(cookieParser())
app.use(router)
app.use("/uploads", express.static("./uploads"))


app.listen(8000,()=>{
    console.log("server started")
})
