function ViewManager(){

    this.layer  =  new LayerManager();

    this.eventServicer = new EventServicer();
    this.eventRequestor = new EventRequestor();

}

function EventServicer(){
    this.process = function(_data,e){

        if(!EventHandlerRegistry[e]){
            console.warn('no match : ' + e + ' in EventHandlerRegistry , please registry it ');
        }else{
            EventHandlerRegistry[e].processData(_data)
        }
    }

}

function EventRequestor(){
    this.eventHandler = function(eventDOMTarget){
        var wsr = eventDOMTarget.WSR;
        actor.processWSR(wsr);
    };



    var loginDiv = $('.divLogin');
    loginDiv.find('#user_loginBtn').unbind('click').bind('click',function(event){
        var actee = {};
        actee.username = loginDiv.find('#user_login').attr("value");
        actee.password = loginDiv.find('#user_pass').attr("value");
        this.WSR = new WSRPack(ActionType.Login,actee)
        view.eventRequestor.eventHandler(this);
    });

    // Load Menu Button
    $('#loadMenuBtn').unbind('click').bind('click',function(event){
        this.WSR = new WSRPack(ActionType.INIT_LOADMENU,'');
        view.eventRequestor.eventHandler(this);
    });

    //log out button
    $("#btn_signOut").unbind('click').bind('click',function(event){
        this.WSR = new WSRPack(ActionType.Logout,'');
        view.eventRequestor.eventHandler(this);
    });

    $("#btn_worlds").unbind('click').bind('click',function(event){
        this.WSR = new WSRPack(ActionType.SearchWorld,'');
        view.eventRequestor.eventHandler(this);
    });

    $("#btn_currentWorld").unbind('click').bind('click',function(event){
        this.WSR = new WSRPack(ActionType.CurrentWorld,'');
        view.eventRequestor.eventHandler(this);
    });

    $("#btn_balance").unbind('click').bind('click',function(event){
        this.WSR = new WSRPack(ActionType.Balance,'');
        view.eventRequestor.eventHandler(this);
    });

    $("#loadContact").unbind('click').bind('click',function(event){
        this.WSR = new WSRPack(ActionType.LoadContact,'');
        view.eventRequestor.eventHandler(this);
    });

    $("#loadChatRooms").unbind('click').bind('click',function(event){
        this.WSR = new WSRPack(ActionType.LoadChatRooms,'');
        view.eventRequestor.eventHandler(this);
    });


    var interval ;
    $("#refresh_msg").unbind('click').bind('click',function(){
        this.WSR = new WSRPack('ACT_LOADMSG',data.chatActee);
        view.eventRequestor.eventHandler(this);
        clearInterval(interval);
        $(this).css({'background-color':'#0088cc'});
        $("#refresh_msg_per_2s").css({'background-color':'white'});
    });

    $("#refresh_msg_per_2s").unbind('click').bind('click',function(){
        clearInterval(interval);
        interval = setInterval(function(){
            var wsr = {};
            wsr.WSR = new WSRPack('ACT_LOADMSG',data.chatActee);
            view.eventRequestor.eventHandler(wsr);
        },2000);
        $(this).css({'background-color':'#0088cc'});
        $("#refresh_msg").css({'background-color':'white'});
    });


    // 注册 单击空白区域隐藏弹出层
    $(document).click(function(event) {
        view.layer.panel.popPanel.hide(500);
        view.layer.panel.insertTopPanel.hide(500);
        view.layer.panel.insertBottomPanel.hide(500);
    });

    // 注册 阻止单击自身时 弹出层自身隐藏
    $("#divPop").click(function(event){
        event.stopPropagation();
    });

    (function initialPage(){
        var documentWidth = document.width;
        $("#page-list").css({"width":2*documentWidth});

        $("#page-right").css({"left":documentWidth});

        $($("#footer #dot-list li").get(0)).unbind("click").bind("click",function(){
            view.layer.panel.page.toggle();
        });
        $($("#footer #dot-list li").get(1)).unbind("click").bind("click",function(){
            view.layer.panel.page.toggle();
        });

        $("#page-right").unbind("dragend").bind("dragend",function(event){
            if(event.originalEvent.clientX>150){
                view.layer.panel.page.toggle();
            }
        });

        $("#page-left").unbind("dragend").bind("dragend",function(event){
            if(event.originalEvent.clientX<-150){
                view.layer.panel.page.toggle();
            }
        });

    })();


}






/** Controller Begin */

function Controller(){
    this.isInPopDiv = false;
    this.initialize = function(_MetaData){};
    this.preProcess = function(){};
    this.process = function(value,key,_metaData){
        if(Utils.isImageLink(value)){
            value = ImageCache.getImage(Utils.composeToImgFullLink(_metaData,value),this.isInPopDiv);
        }
        return value;
    };
}

function CanvasController(bgImgKey,objectImgKey,columnCount,rowCount,domObject){

    this.bgImgKey  =   bgImgKey;
    this.objectImgKey = objectImgKey;
    this.columnCount    = columnCount;

    domObject.unbind('click').bind('click',function(event){
        var actee = getActeeFromCanvas(event);
        if(actee){
            this.WSR = new WSRPack(ActionType.Move, actee );
            view.eventRequestor.eventHandler(this);
        }
    });

    function getActeeFromCanvas(event){
        var clickedNXY  =   getNavigationCoordinateFromClickedXY(event);
        var i = 0 , j = -1 , mapJSON = data.newData.map;
        for(var key in mapJSON){
            i = key % 7 ;
            if(i == 0 ) j++ ;
            if(i == clickedNXY.x && j == clickedNXY.y){
                if(mapJSON[key].type != -1){
                    data.isNewMapData = false;
                    $('#divMapTip').empty().append(ImageCache.getGif('gif_horizontal'));
                    return mapJSON[key].name;
                }
            }
        }
    }

    /* Private */
    function getNavigationCoordinateFromClickedXY(event){
        var NX , NY ;
        for(var i = 0 ; i < rowCount ; i++ ){
            if(64*i <= event.offsetY && event.offsetY < 64*(i+1) ){
                NY = i ;
                break;
            }
        }
        for(var j = 0 ; j < columnCount ; j++ ){
            if(64*j <= event.offsetX && event.offsetX < 64*(j+1) ){
                NX = j ;
                break;
            }
        }
        return{
            x:NX,
            y:NY
        }
    };

}
CanvasController.prototype = new Controller();
CanvasController.prototype.constructor = CanvasController;


function InteractController(displayNameKey,actionKey,acteeKey){

    var action , actee , a , row;
    var serverActionError = arguments[3];   //for chat

    this.initialize = function(_MetaData){
        row = undefined;
    };

    this.preProcess = function(){
        action  =   undefined;
        actee   =   undefined;
        a = $('<a/>').attr({href:'javascript:void(0)'}).addClass('btn');
        if(!row){
            row = $('<tr/>');
        }
        return row;
    }

    this.process = function(value,key,_metaData){

        value = InteractController.prototype.process.apply(this,arguments);      // invoke parent Controller's method process()
        if(Utils.isImage(value)){
            return value ;
        }

        key == displayNameKey ? a.append(value) :key == actionKey ? action= value : key == acteeKey ?
            actee = value :{};

        var actionType = action , acteeParam = actee ;
        if( actionType ){
            a.unbind('click').bind('click',function(){
                this.WSR = new WSRPack(actionType,acteeParam);
                view.eventRequestor.eventHandler(this);
                view.layer.panel.popPanel.hide();
            });
            return a ;
        }

        if(serverActionError){          // for chat
            a.unbind('click').bind('click',function(){
                this.WSR = new WSRPack(serverActionError,acteeParam);
                view.eventRequestor.eventHandler(this);
                view.layer.panel.popPanel.hide();
            });
            return a ;
        }
//        return value ;
    }
}
InteractController.prototype = new Controller();
InteractController.prototype.constructor = InteractController;

function DDPTableController(){
    var sections , controls , ctrl , img , action  , actee;
    var actionServerError = arguments[0];
    this.isInPopDiv = true;

    this.initialize = function(_MetaData){
        sections = _MetaData['_Sections'];
        controls = _MetaData['_Controls'];

        for(var name in sections){
            for(var index in sections[name]){
                if(sections[name][index].indexOf('CTRL_') != -1) ctrl = sections[name][index];
                if(sections[name][index].indexOf('IMG_') != -1) img = sections[name][index];
            };
        }

        if(controls){
            for(var name in controls[ctrl]){
                if(controls[ctrl][name].indexOf('ACT') != -1) action = controls[ctrl][name];
                if(controls[ctrl][name].indexOf('Actee') != -1) actee = controls[ctrl][name];
            }
        }
    }

    this.process = function(value,key,_metaData){
        value = DDPTableController.prototype.process.apply(this,arguments);      // invoke parent Controller's method process()

        if(key == actee ){
            var a = $('<a/>');
            a.addClass('btn').append(controls[ctrl][0]).unbind('click').bind('click',function(){
                if(actionServerError){                       // for buildings  , here , the wrong action type came from server
                    action = actionServerError;
                }
                this.WSR = new WSRPack(action,value);
                view.eventRequestor.eventHandler(this);
                view.layer.panel.popPanel.hide();
            });
            return a ;
        }
        return value;
    }
}
DDPTableController.prototype = new Controller();
DDPTableController.prototype.constructor = DDPTableController;


/** Controller End */