const express=require('express');
const mongoose=require("mongoose");
const app = express();

app.use(require("./routes/data"))

app.use(express.json());
require("./model/model");

require('dotenv').config()
mongoose.set("strictQuery",false);
mongoose.connect(process.env.mongoUrl, {useNewUrlParser: true})
mongoose.connection.on("connected",()=> console.log("succefully connected to mongoose"));

mongoose.connection.on("err",()=> console.log("Not connected to mongoose"));
app.get("",function(req,res){
    res.sendFile("trail.html");
})


app.get("/",function(req,res){
    res.send("hello");
})

app.get("/shake",function(req,res){
    res.send("sooke");

})

app.listen(5000,()=>{
    console.log("server started on port 5000 succesfully");
})




