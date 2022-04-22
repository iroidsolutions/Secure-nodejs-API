var express  = require("express"),
	app = express(),
	http = require("http").Server(app).listen(3000);
	upload = require("express-fileupload");
	app.use(upload());

console.log("Server started");
app.get("/",function(req,res){

	res.sendFile(__dirname+"/index.html");
})

app.post("/",function(req,res){


			console.log(req.files);
			var file = req.files.filename,
			filename = file.name;
			file.mv("uploads/"+filename,function(error){

				if(error){
					console.log("error");
					res.send("erorr");
				}else{

					console.log("Done!");
					res.send("Done!");
				}

			})
	
})

