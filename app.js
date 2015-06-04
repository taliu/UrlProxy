var express=require("express");
var app=new express();
app.use("/",require('./cFirewall'));
app.listen(5566,function(){
    console.log("web service listen at port 5566");
});
