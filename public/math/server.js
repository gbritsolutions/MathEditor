const fs = require("fs");
const express = require("express");
const path = require("path");
PORT = 8081;

// Instantiate an Express application
const app = express();

app.use(express.static(path.join(__dirname) + ''));

app.get("/", (req, res) => {
    //res.sendFile(path.join(__dirname) + "/demos/index.html");
    console.log("Requested IP:",req.ip);
})

app.post("/save", (request, response) => {
    console.log("Requested IP:",request.ip);
    if (request.method == 'POST') {
        var body = '';

        request.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function () {
            var json_data = JSON.parse(body);
	    html = decodeURIComponent(json_data["html"]);
	    url = decodeURIComponent(json_data["url"]);
	    foo = url.replace(/\//g,"_") + ".html";
	    fs.writeFileSync('/tmp/' + foo, html);
        });
    }
})

//Start the server

app.listen(PORT, function (err) {
    if (err) {
	console.log(err)
    }
    else {
	console.log("Express server listening on PORT", PORT);
    }
});


