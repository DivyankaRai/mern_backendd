const mongoose = require('mongoose')
const DB = process.env.DATABASE
mongoose.set('strictQuery', false)

mongoose.connect(DB,{
}).then(()=>console.log("db connected")).catch((er)=>console.log(er))