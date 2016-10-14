function DataManager(){

    this.supportWebSocket = true;

    this.lastData;
    this.newData;
    this.isNewMapData = false ;

    this.chatActee;

    var ajaxManager = new AjaxManager();
    var webSocketManager = new WebSocketManager();

    this.startListeningService = function(actionCallBack,disconnectCallBack){
        try {
            webSocketManager.startWebSocketListening(actionCallBack,disconnectCallBack);
        } catch (error) {
            console.log('Websocket not supported!!!' + error);
            this.supportWebSocket = false;
        }
    };

    this.launchWSR = function(wsrPack){
        if (this.supportWebSocket) {
            webSocketManager.emitDataToServerWithWebSocket(JSON.stringify(wsrPack));
        } else {
            ajaxManager.requestWebServer(wsrPack);
        }
    }

    // Start the Service . launchFirstEngagement
    this.startListeningService(function(message){
        actor.processDataEvent(message);
    });
}

function WSRPack(action,actee) {
    this.action =   action;
    this.actee  =   actee;
}

