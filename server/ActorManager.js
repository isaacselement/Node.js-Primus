var url = require("url"),http = require('http');

var Cookies     =   {}  ;
var Requests    =   {}  ;


function sendGetRequestToWebService(id,reqUrl,callback,timeout){

    if(!Requests[id]){
        Requests[id] = {};
    }

    if(!this[id])this[id] = 0 ;
    var reqCount = ++this[id];

    var options = {
        host: url.parse(reqUrl).host,
        port: 80,
        path: url.parse(reqUrl).pathname + url.parse(reqUrl).search,
        headers:{
            'Cookie':Cookies[id],
            'Cache-Control': 'no-cache',
            'Connection':'close'
        }
    };

    console.log(options.path + ':' + reqCount);
    var start = new Date().getTime();

    Requests[id][reqCount] = http.get(options, function(res) {

        var end = new Date().getTime();
//        console.log(Requests[id][reqCount].path + ':  ' + reqCount + ' ---> Got response: '+ res.statusCode + ' '+ (end - start) + 'ms');
//        console.log("headers: ", res.headers);

        if(typeof res.headers['set-cookie'] != 'undefined'){
            Cookies[id] = res.headers['set-cookie'];
        }

        var jsonData = '' ;
        res.on('data', function(data) {
            jsonData += data ;
        }).on('end',function(){
            console.log(Requests[id][reqCount].path + ':  ' + reqCount + ' \<--- end ');
            if( typeof callback == 'function' && !Requests[id][reqCount].isAbort && !Requests[id][reqCount].isTimeout ){
                callback(jsonData,reqCount);
            }
//            console.log(jsonData.toString('ISO-8859-1'));
            delete Requests[id][reqCount];
        });
    }).on('error', function(e) {            // if it is Move request , should do sth such as send Move request again
        console.log(Requests[id][reqCount].path + ':  ' + reqCount + " Request on 'error' : " + e.message);
    });

    if(timeout){
        Requests[id][reqCount].setTimeout(timeout, function(){
            Requests[id][reqCount].isTimeout = true;
            Requests[id][reqCount].abort();
            Requests[id][reqCount].isAbort = true;
//            console.log(Requests[id][reqCount].path + ':  ' + reqCount + ' ---> request timeout&abort');
        });
    }
}



function sendPostRequestToWebService(id,reqUrl,callback,timeout,data){

    var options = {
        host: url.parse(reqUrl).host,
        port: 80,
        path: url.parse(reqUrl).pathname,
        headers:{
            'Cookie':Cookies[id],
            'Cache-Control': 'no-cache',
            'Connection':'close',
            'Content-Type': "application/x-www-form-urlencoded"         // tell that submit the form（enctype="application/x-www-form-urlencoded"） or upload file(enctype="multipart/form-data")
        },
        method: 'POST'

    };

    console.log("Post : " + options.path);
    var request = http.request(options, function(res) {

        var jsonData = '' ;
        res.setEncoding('utf8');
        res.on('data', function(data) {
            jsonData += data ;
        }).on('end',function(){
                console.log(request.path + ':  '  + ' \<--- end ');
                if( typeof callback == 'function' && !request.isAbort && !request.isTimeout ){
                    callback(jsonData);
                }
                delete request;
            });
    }).on('error', function(e) {
            console.log(request.path + ':  ' + " Request on 'error' : " + e.message);
        });

    if(timeout){
        request.setTimeout(timeout, function(){
            request.isTimeout = true;
            request.abort();
            request.isAbort = true;
        });
    }

    request.write(data);
    request.end();
}


module.exports.sendGetRequestToWebService = sendGetRequestToWebService;
module.exports.sendPostRequestToWebService = sendPostRequestToWebService;