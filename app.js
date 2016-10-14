var fs = require('fs')
    , http = require('http')
    , url = require("url")
    , path = require('path')
    , socketio = require('socket.io');

var data =  require('./server/DataManager');

// print process.argv
var isShutDownWebSocket = false;
process.argv.forEach(function(val, index, array) {
    console.log(index + ': ' + val);
    if (index == 2) {
        if(val == '--websocket=false') isShutDownWebSocket = true;
    }
});

var server = http.createServer(function (req, res) {

    res.writeHead(200, {
        'Content-type':'text/html'
    });

    router(req, res, url.parse(req.url).pathname, handle);

}).listen(8080, function () {
    console.log('Listening at: http://localhost:8080');

    if (!isShutDownWebSocket){
        data.startListening(socketio,server);
    } else {

    }
});


var router = function (req, res, pathname, handle) {
    console.log("request has arrived -- request url path : "+pathname);

    ifStaticFileRequst(req, res, pathname);

    if (typeof handle[pathname] === 'function') {
        handle[pathname](req, res);
    }
};

var handle  = {
    '/':function (req, res) {

        var timestamp = getCookie(req.headers.cookie,'timestamp');

        if(!timestamp){
            timestamp = new Date().getTime();
            res.writeHead(200,{
                'Content-type':'text/html',
                'set-cookie':'timestamp = ' + timestamp
            });
        }

        res.end(fs.readFileSync(__dirname + '/client/index.html'))
    },

    '/favicon.ico':function(req,res){
        res.end(fs.readFileSync(__dirname + '/client/resources/images/brand.png'))
    }

};

function ifStaticFileRequst(request, response, requestPath) {
    /*if(requestPath.substring(0,7) !=='/client' ){
        return ;
    }*/

    var ext = path.extname(requestPath);
    ext = ext ? ext.slice(1) : 'unknown';

    var realPath = __dirname  + '/client' + requestPath;
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write("This request URL " + requestPath + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    var contentType = mime[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
};

var mime = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "zip": "application/zip",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
}



function getCookie(cookie,name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(!cookie) {
        return null;
    }
    if(arr = cookie.match(reg)){
        return unescape(arr[2]);    // The escape and unescape functions are deprecated. Use encodeURI, encodeURIComponent, decodeURI or decodeURIComponent to encode and decode escape sequences for special characters.
                                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Deprecated_and_obsolete_features
    } else {
        return null;
    }
}

function setCookie(cookie,name,value)
{
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function delCookie(cookie,name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null) cookie= name + "="+cval+";expires="+exp.toGMTString();
}