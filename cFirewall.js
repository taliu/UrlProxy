var request= require("request");
var cheerio = require("cheerio");
var URL= require("url");
var express=require("express");
var app = express.Router();
app.get("/page",function(req,res){
	 var url=req.query.taliuurl;
     console.log(url);
	if(urlTest (url)){
		send(url,res);
	}else{
		console.log("error:"+url);
		res.send("无效的url："+url);
	}
});

app.get("/static",function(req,res){
	 var url=req.query.taliuurl;
	 request(url).pipe(res);
});

 function send(url,res){
	 
var options = {
  url: url,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36'
  }
};
	request(options, function (error, response, body) {
			var $=cheerio.load(body);
		   $('script,img').each(function(i, elem) {
			   var src= $(this).attr("src");
			   if(src){
				    src= trim(src);
				    $(this).attr("src",getRealUrl(url,src,1));
			   }
			});
	      
		   $('link').each(function(i, elem) {
			   var src= $(this).attr("href");
			   if(src){
				    src= trim(src);
				    $(this).attr("href",getRealUrl(url,src,1));
			   }
			});
			
			 $('a').each(function(i, elem) {
			   var src= $(this).attr("href");
			   if(src){
				    src= trim(src);
				    $(this).attr("href",getRealUrl(url,src));
			   }
			});
		res.send($.html());
      });
 }
  function getRealUrl(baseUrl,url,isStatic){
	  var rUrl=isStatic?"/static?taliuurl=":"/page?taliuurl=";
	  url=url||"";
	  if(url[0]=='/'&&url[1]=='/'){
		 url="http:"+url; 
	  }
	if(!urlTest (url)){
		 var u=URL.resolve(baseUrl,url);
		if(!urlTest (u)){
			u=url;
		}
		return rUrl+u;
	}
	return rUrl+url;
  }
  
  
  
  
  function trim(str){
	  return str.replace(/(\s+$)|(^\s+)/g,"")
  }
  
 function urlTest(url){
	 	var exp=/^http(s)?:////([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/i;
		return exp.test (url);
 }
module.exports = app;