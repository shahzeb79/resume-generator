var http = require("http");
var fs = require("fs");
var resume = JSON.parse(fs.readFileSync('/src/resume.json', 'utf8'));
var theme = require("./index.js");
var path = require("path");

var port = 3000;
http.createServer(function(req, res) {
    var picture = resume.basics.picture && resume.basics.picture.replace(/^\//, "");

    if (picture && req.url.replace(/^\//, "") === picture.replace(/^.\//, "")) {
        var format = path.extname(picture);
        try {
            var image = fs.readFileSync(picture);
            res.writeHead(200, {
                "Content-Type": "image/" + format
            });
            res.end(image, "binary");
        } catch (error) {
            if (error.code === "ENOENT") {
                console.log("Picture not found !");
                res.end();
            } else {
                throw error;
            }
        }
    } else {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end(render());
    }
}).listen(port);

console.log("Preview: http://localhost:3000/");
console.log("Serving..");

function render() {
    try {
        return theme.render(JSON.parse(JSON.stringify(resume)));
    } catch (e) {
        console.log(e.message);
        return "";
    }
}
