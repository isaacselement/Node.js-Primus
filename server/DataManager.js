var fs = require('fs');

var ServerBaseUrl   =   'http://appingpoint.net';
var JsonGateURL     =   '/Primus/JSONGate';

var intervalId = {} ;

var actor = require('./ActorManager');

var latestCount = {};
var latestData = {};

var ActionType = {
    Navigate        :'ACT_NAVIGATE',

    Login           :'AUTH_LOADUSER',
    Logout          :'AUTH_LOGOUT',
    LoadCharacter   :'META_LOADCHARACTER',

    Move            :'ACT_MOVE',

    ADDMSG          :  'ACT_ADDMSG'
};


module.exports.startListening = function startListening(socketio, server) {

    socketio.listen(server, { log:false }).on('connection', function (socket) {

        var cl = arguments.callee;
        if (!cl.count) cl.count = 0;
        cl.count++;
        console.log("websocket connected !  第" + cl.count + "次回调socket.io onConnection. socket_id  " + socket.id);


        var id = socket.id;
        if(!latestCount[id]){
            latestCount[id] = 0;
        }
        if(!latestData[id]){
            latestData[id] = '';
        }


        socket.on('Action', function (data) {
            var parameters = JSON.parse(data);
            var action = parameters.action;
            var actee = parameters.actee;

            if (action == ActionType.Login) {          //  LOGIN

                var login_url = assemblyRequestURL(action, actee);
                actor.sendGetRequestToWebService(id, login_url, function (data) {
                    emitDataToClientWithActionType(data, socket, action);
                });

            }else if (action == ActionType.LoadCharacter ){

                    var world_url = assemblyRequestURL(ActionType.LoadCharacter,actee);
                    actor.sendGetRequestToWebService(id, world_url, function (data) {
                        emitDataToClientWithActionType(data, socket,ActionType.LoadCharacter);


                        if (!(id in intervalId)) {

                            var map_url = assemblyRequestURL(ActionType.Navigate);

                            intervalId[id] = setInterval(function () {

                                if (true) {
                                        actor.sendGetRequestToWebService(id, map_url, function (data,reqCount) {
                                        var newData = JSON.parse(data);

                                        if(latestData[id]._MetaData){
                                            delete latestData[id]._MetaData._ServerGMTTime ;
                                        }
                                        delete newData._MetaData._ServerGMTTime ;

                                        if( latestCount[id] < reqCount  /*&&  JSON.stringify(latestData[id]) != JSON.stringify(newData) */){
                                            latestCount[id] = reqCount;
                                            latestData[id] = JSON.parse(data);
                                            console.log('------ send ------');
                                            emitDataToClientWithActionType(data, socket,ActionType.Navigate);
                                        }
                                    }, 1000);
                                }

                            }, 1000);
                        }

                    });

            } else {

                if (action == ActionType.Logout) {
                    if (intervalId[id]) {
                        clearInterval(intervalId[id]);
                        delete intervalId[id];
                    }
                }

                var actionURL = assemblyRequestURL(action, actee);

                if(action == ActionType.ADDMSG){
                    var postData = "Action=" + action +"&Actee=" + actee.actee + "&Mode=" + actee.mode + "&content=" + actee.content;
                    actor.sendPostRequestToWebService(id,ServerBaseUrl+JsonGateURL,function(jsonData){
                        emitDataToClientWithActionType(jsonData, socket, action);
                    },null,postData);

                }else {

                    actor.sendGetRequestToWebService(id, actionURL, function (data,reqCount) {
                        if(latestCount[id] < reqCount){
                            latestCount[id] = reqCount;
                            emitDataToClientWithActionType(data, socket, action);
                            latestData[id]  = new Buffer(data).toString();
                        }
                    });

                }

            }
        });

        socket.on('disconnect', function () {
            console.log(' Disconnect  socket id : ' + socket.id + '.');
            if (intervalId[id]) {
                clearInterval(intervalId[id]);
                delete intervalId[id];
            }
        });

    });
};


function emitDataToClientWithActionType(json,socket,actionType){
    var data = {};
    data.action     =   actionType;
    data.json       =   JSON.parse(json);
    socket.emit('Action',data);
}



function assemblyRequestURL(action,actee){
    var urlBase = ServerBaseUrl + JsonGateURL ;
    var urlSuffix = '';

    if(action == ActionType.Login){
        urlSuffix = "&username="+actee.username+"&password="+actee.password;

    }else if(action == ActionType.LoadCharacter){
        urlSuffix = "&worldcode="+actee;

    }else{
        urlSuffix = (typeof actee == 'undefined' ? '' : '&Actee='+actee);

    }

    return urlBase + "?Action=" + action + urlSuffix;
}