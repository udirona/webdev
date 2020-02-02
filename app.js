var express = require('express');
var fs = require('fs');
var plantuml = require('node-plantuml');

var app = express();
 
plantuml.useNailgun(); // Activate the usage of Nailgun

const pumldir = './uml';

function header() {
  return String('<h1>Test Plant-UML-Server-Parser</h1>');
};

app.get('/', function(req, res) {
  fs.readdir(pumldir, (err, files) => {
    var filelist = "";
    files.forEach(file => {
        filelist += ('<li> <a href="png/'
                    + file 
                    + '">'
                    + file 
                    + '</li>');
    });
    res.send(header() 
        + "<ul>"
        + filelist
        + "</ul>");
    });
});

app.get('/png/:uml', function(req, res) {
    res.set('Content-Type', 'image/png');
    //var decode = plantuml.decode(req.params.uml);
    let file = pumldir+'/'+req.params.uml;
    var gen = plantuml.generate(file, {format: 'png'});
    //decode.out.pipe(gen.in);
    gen.out.pipe(res);
});
 
app.get('/svg/:uml', function(req, res) {
    res.set('Content-Type', 'image/svg+xml');
   
    var decode = plantuml.decode(req.params.uml);
    var gen = plantuml.generate({format: 'svg'});
   
    decode.out.pipe(gen.in);
    gen.out.pipe(res);
});
 
app.listen(8080);
