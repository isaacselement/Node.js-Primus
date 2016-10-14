var actor;
var data;
var view;
var context;

var EventHandlerRegistry ;

$(document).ready(function(){
    actor   = new ActorManager()    ;
    data    = new DataManager()     ;
    view    = new ViewManager()     ;
    context = new ContextManager()  ;



    EventHandlerRegistry =  {
//        "launch.none"       :   view.layer.none,
        "launch.DDP"        :   view.layer.layerPop,
        "launch.Menu"       :   view.layer.layerMenu,
//        "launch.Tradeyard"  :   view.layer.none,
        "launch.Chat"       :   view.layer.layerChat,
//        "launch.Message"    :   view.layer.none,

        "launch.Navigation" :   view.layer.layerNavigation
    }

});
