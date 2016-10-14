function ActorManager(){

    this.processWSR = function(wsrPack){
        data.launchWSR(wsrPack);

        if(wsrPack.action != ActionType.Move  ){
            $('#divWsrTip').empty().append(ImageCache.getGif('gif_wsr_normal'));
        }
        if(wsrPack.action == ActionType.LoadCharacter){
            console.log(data.lastData);
            var array = data.lastData["resultworlds"];
            for(var index in array){
                if(wsrPack.actee == array[index]["worldcode"]){
                    $("#btn_currentWorld").empty().append(array[index]["worldname"]);
                    $("#btn_avatar").empty().append(array[index]["avatarname"]);
                }
            }
        }

        if(wsrPack.action == ActionType.LOADMSG ){          // special for chat
            data.chatActee = wsrPack.actee;
        }
        console.log('action:'+ wsrPack.action + '   actee:' + JSON.stringify(wsrPack.actee));
    };


    this.processDataEvent = function(_data){
        var data_        = _data.json;

        data.newData = data_;
        if(!data.lastData) {
            data.lastData = data_;
        }

        if(data_.map && data.lastData.map && (JSON.stringify(data.lastData.map) != JSON.stringify(data_.map))){
            data.isNewMapData = true ;
        }

        if(!data_.map || data.isNewMapData){
            $("#txt_rawData").val(JSON.stringify(data_));
        }

        var _MetaData = data_['_MetaData'];

        if(_MetaData['_ServiceResult'] == 1){
            var _DataPack = _MetaData['_DataPack'];
            var direction = DataEventRequestRegistry[_DataPack];

            if(!direction){
                console.warn('Data Pack Name : '+_DataPack+ ' has not registry in DataEventRequestRegistry ');
                direction = 'launch.DDP';  // by default
            }
            view.eventServicer.process(_data,direction);

        }else{
            direction = 'launch.DDP';  // by default
            view.eventServicer.process(_data,direction);
        }

        if(direction != 'launch.Navigation'){
            $('#divWsrTip').empty().append(ImageCache.getGif('gif_wsr_blank'));
        }

    };

};


var DataEventRequestRegistry = {
//    "Auth_WorldSearch"          : 'launch.none',

    "InWorld_Navigation"        : 'launch.Navigation',


    "DDP"                       : 'launch.DDP',
    "InWorld_Init_MenuItems"    : 'launch.Menu',

    "InWorld_BuildingList"      : 'launch.DDP',
    "InWorld_Interact"          : 'launch.DDP',

    "InWorld_MsgLines"          : 'launch.Chat'


}






var ActionType  =   {
    INIT_LOADMENU   : 'ACT_INIT_LOADMENU',

    Login           : 'AUTH_LOADUSER',

    Logout          : 'AUTH_LOGOUT',

    LoadCharacter   : 'META_LOADCHARACTER',

    Move            : 'ACT_MOVE',

    CreateBuildings : '14009',
    Build           : '14022',

    MSG             : '14024',
    LOADMSG         :  'ACT_LOADMSG',
    ADDMSG          :  'ACT_ADDMSG',

    Collect_Energy_Tile:'14000',


    MyBuildings     : 'ACT_MYASSET',
    MyAvatarOption  : 'ACT_AVATAROPTION',
    LoadAlliance    : 'ACT_LISTSOCIAL',

    LoadContact     : 'ACT_LOADCONTACTS',
    LoadChatRooms   : 'ACT_LOADCHATROOMS',
    TradeYard       : 'ACT_TRADEYARD',


    ACT_INTERACT    : 'ACT_INTERACT',

    SearchWorld     : 'Auth_SearchWorld',
    CurrentWorld    : 'ACT_NAVIGATE',
    Balance         : 'META_SERVICEMETER'

};


