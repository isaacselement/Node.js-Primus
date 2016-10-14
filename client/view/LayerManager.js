function LayerManager(){

    this.none = new Layer();

    this.panel    =  new PanelManager();


    this.layerNavigation = new LayerNavigation();
    this.layerMenu       = new LayerMenu();
    this.layerChat       = new LayerChat();

    this.layerPop     = new LayerPop();

}


// base class Layer
function Layer(){
    this.processData = function(data_){
        console.warn('no match layer to processData:\n ' + JSON.stringify(data_) + ' , \n please config to sublayer to process and override the method processData()');
    };
}


// LayerNavigation
function LayerNavigation(){
    var mapWindow = new CanvasGrid('map');
    var mapController = new CanvasController('url','url_front',7,7,mapWindow.domObject);
    mapWindow.setController(mapController);

    this.processData   = function(_data){
        if(!this.cl)this.cl = 0 ;
        this.cl++;
        if(!view.layer.panel.loginPanel.isHidden()){
            view.layer.panel.loginPanel.hide();
            view.layer.panel.navigatorPanel.show();
            $('#divWsrTip').empty().append(ImageCache.getGif('gif_wsr_blank'));
        }

        if(this.cl < 5 || data.isNewMapData){
            console.log("this.cl  "+this.cl + " data.isNewMapData " + data.isNewMapData)
            view.layer.panel.mapPanel.div.find('#divMapTip').empty().append(ImageCache.getGif('gif_horizontal_blank'));
            data.isNewMapData = false;

            mapWindow.setData(data.lastData.map);
            mapWindow.setMetaData(data.lastData._MetaData);
            mapWindow.animation(function(){
                mapWindow.setData(data.newData.map);
                mapWindow.setMetaData(data.newData._MetaData);
                mapWindow.render();
                data.lastData = data.newData;
            });
        }

        var tableData = data.newData;
        var _MetaData = data.newData._MetaData;

        view.layer.panel.interactorPanel.div.empty();
        for(var name in tableData ){
            if(name == '_MetaData' || name == 'effect' || name == 'map')continue;
            var table = new TableGrid();
            table.setDOMObject('tbl_'+name);
            table.setData(tableData[name]);
            table.setMetaData(_MetaData);

            for(var key in tableData[name]){
                if(tableData[name][key].hasOwnProperty( 'event' )){
                    table.setController(new InteractController('name','event','para'));
                } else{
                    table.setController(new Controller());
                }
                table.render();
            }
            if(table.domObject.find('tr').length>0 ){
                view.layer.panel.interactorPanel.div.append($('<div/>').append(table.domObject));
            }
        }

        $("#btn_balance").empty().append(_MetaData["_Balance"]);
        if(_MetaData._ServicePrompt){
            view.layer.panel.slideDownPanel.setComponent(_MetaData._ServicePrompt);
            view.layer.panel.slideDownPanel.show();
            $('#divWsrTip').empty().append(ImageCache.getGif('gif_wsr_blank'));
        }
    }
}
LayerNavigation.prototype = new Layer();
LayerNavigation.prototype.constructor = LayerNavigation;


// LayerMenu
function LayerMenu(){
    this.processData = function(data){
        var _data        = data.json;
        var _MetaData     =   _data['_MetaData'];

        var component = $('<point/>');
        var table = new TableGrid();
        var controller ;

        for(var name in _data){

            if(name != '_MetaData' && _data[name].length != 0){

                table.setDOMObject(name);
                table.setMetaData(_MetaData);
                table.setData(_data[name]);

                var isActionTypeInTableData = false;

                for(var key in _data[name]){
                    if(_data[name][key].hasOwnProperty( 'event' )){
                        isActionTypeInTableData = true ;
                        break;
                    }
                }

                if(isActionTypeInTableData){
                    controller = new InteractController('name','event','para');
                }else{
                    controller = new Controller();
                }

                controller.isInPopDiv = true;
                table.setController(controller);
                table.render();
            }
            component.append(table.domObject);
        }

        if(_MetaData._ServicePrompt){
            view.layer.panel.slideDownPanel.setComponent(_MetaData._ServicePrompt);
            view.layer.panel.slideDownPanel.show();

        }else if(component.children().length == 0){
            view.layer.panel.slideDownPanel.setComponent(" OH , No Data! ");
            view.layer.panel.slideDownPanel.show();
            return;
        }
        view.layer.panel.slideLeftPanel.setComponent(component);
        view.layer.panel.slideLeftPanel.show();
    }

}
LayerMenu.prototype = new Layer();
LayerMenu.prototype.constructor = LayerMenu;


// LayerChat
function LayerChat(){
    this.processData = function(data_){

        var component = $('<point/>');
        var table = new TableGrid();
        var controller ;

        var _data        = data_.json;

        var _MetaData     =   _data['_MetaData'];

        for(var name in _data){
            if(name != '_MetaData' && _data[name].length != 0){

                table.setDOMObject(name);
                table.setMetaData(_MetaData);
                table.setData(_data[name]);

                controller = new Controller();

                controller.isInPopDiv = true;
                table.setController(controller);
                table.render();
            }
            component.append(table.domObject);
        }

        if(_MetaData._ServicePrompt){
            component.append(_MetaData._ServicePrompt);
        }


        if(!this.cl){
            var mode = 'Black';

            this.cl = 0 ;
            $("#div-chat").show();
            $("#btn-speak").unbind('click').bind('click',function(){
                var actee = {};
                actee.actee = data.chatActee;
                actee.mode  = mode  ;
                actee.content =$('#content').attr("value");
                this.WSR = new WSRPack(ActionType.ADDMSG,actee);
                view.eventRequestor.eventHandler(this);
            });

            $('#divMsgCTRL').find('ul.dropdown-menu li').each(function(index){

                if(index!=6 && index !=7){
                    $(this).unbind('click').bind('click',function(){
                        $('#divMsgCTRL').find('ul.dropdown-menu li').each(function(index){
                            if(index!=6 && index !=7)$(this).css({'background-color':'white'});
                        });

                        $(this).css({'background-color':'#0088cc'});
                        mode = $(this).find('a').text();
                    });
                }
            });

        }

        view.layer.panel.page.pageRight.setComponent(component);
        view.layer.panel.page.hide();

    }
}
LayerChat.prototype = new Layer();
LayerChat.prototype.constructor = LayerChat;


function LayerPop(){
    this.processData   = function(data){
        var actionType  = data.action ;
        var _data        = data.json;

        var _MetaData     =   _data['_MetaData'];
        var serverActionError ;

        var component = $('<point/>');
        var table = new TableGrid();
        var controller ;

        var isSpecial = false;
        if(actionType == ActionType.CreateBuildings){
            serverActionError = ActionType.Build;                   // special for build

        }else if(actionType == ActionType.MSG || actionType == ActionType.LoadContact || actionType == ActionType.LoadChatRooms){
            serverActionError = ActionType.LOADMSG;                 // special for chat
            controller = new InteractController('Channel','event','Actee',serverActionError);
            isSpecial = true;

        }else if(actionType == ActionType.Login){
            serverActionError = ActionType.LoadCharacter;
            controller = new InteractController('worldname',' ','worldcode',serverActionError);
            isSpecial = true;

        }else if(actionType == ActionType.Logout){

            view.layer.panel.loginPanel.show();
            view.layer.panel.navigatorPanel.hide();

            serverActionError = "AUTH_PROFILEWORLD";
            controller = new InteractController('worldname',' ','worldcode',serverActionError);
            isSpecial = true;
        }



        if(_MetaData._Sections){
            controller = new DDPTableController(serverActionError);
            controller.isInPopDiv = true;
            table.setController(controller);
            table.setDOMObject('popTable');
            table.setMetaData(_MetaData);
            for(var name in _MetaData._Sections){
                table.setData(_data[name]);
                table.render();
                if(table.domObject.find('tr').length>0 ){
                    component.append(table.domObject);
                }
            }

        }else{
            for(var name in _data){

                if(name != '_MetaData' && _data[name].length != 0){

                    table.setDOMObject(name);
                    table.setMetaData(_MetaData);
                    table.setData(_data[name]);

                    var isActionTypeInTableData = false;

                    for(var key in _data[name]){
                        if(_data[name][key].hasOwnProperty( 'event' )){
                            isActionTypeInTableData = true ;
                            break;
                        }
                    }

                    if(!isSpecial){
                        if(isActionTypeInTableData){
                            controller = new InteractController('name','event','para');
                        }else{
                            controller = new Controller();
                        }
                    }

                    controller.isInPopDiv = true;
                    table.setController(controller);
                    table.render();
                }
                component.append(table.domObject);
            }


        }

        if(_MetaData._ServicePrompt){
            view.layer.panel.slideDownPanel.setComponent(_MetaData._ServicePrompt);
            view.layer.panel.slideDownPanel.show();

        }else if(component.children().length == 0){
            view.layer.panel.slideDownPanel.setComponent(" OH , No Data! ");
            view.layer.panel.slideDownPanel.show();
            return;
        }
        view.layer.panel.popPanel.setComponent(component);
        view.layer.panel.popPanel.show();
    }
}
LayerPop.prototype = new Layer();
LayerPop.prototype.constructor = LayerPop;