function WebSocketManager(){

    var iosocket;

    this.connectToServer = function connectToServer(){
        if(!iosocket){
            iosocket = io.connect();
        }
    };

    this.disconnectToServer = function disConnectToServer(){
        if(!iosocket){
            iosocket.disconnect();
        }
    };

    this.startWebSocketListening = function startWebSocketListening(actionCallBack,disconnectCallBack){
        if(!iosocket){
            iosocket = io.connect();
        }

        iosocket.on('connect', function () {

            $('#divConnectStatus span').empty().append(ImageCache.getGif('gif_websocket_normal'));

            iosocket.on("Action",function(message){
                if(actionCallBack)actionCallBack(message);
            });

            iosocket.on('disconnect',function(){
                if(disconnectCallBack){
                    disconnectCallBack();
                }
                $('#divConnectStatus span').empty().append(ImageCache.getGif('gif_websocket_stop'));
            });

            iosocket.on('message',function(message){

            });

        });

        iosocket.on('reconnect', function () {
            console.log('reconnect');
        });

    };


    this.emitDataToServerWithWebSocket = function emitDataToServerWithWebSocket(wsrPack){
        iosocket.emit('Action',wsrPack);
    }



}