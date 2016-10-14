/*****  DOMHelper Begin *****/



function DOMHelper(){};


/**
 * @param id  : for example  , the specification , tag id named 'iptUserName' is <input> tag.
 *              the first three character should be representable HTML TAG TYPE
 * @return Jquery Object
 */
DOMHelper.getObjectElementByIdFromHTML = function(id){
    var jqueryObject = $('#'+id) ;

    if(jqueryObject.length == 0 ){
        var type = id.slice(0,3);

        if(type == 'anc'){                               // <a></a>
            jqueryObject = $('<a/>').attr({id:id});
        }else if(type == 'ipt'){                         // <input></input>
            jqueryObject = $('<input/>').attr({id:id});
        }else if(type == 'btn'){                         // <button></button>
            jqueryObject = $('<button/>').attr({id:id});
        }else if(type == 'spn'){                         // <span></span>
            jqueryObject = $('<span/>').attr({id:id});
        }else if(type == 'div'){                         // <div></div>
            jqueryObject = $('<div/>').attr({id:id});
        }else if(type == 'img'){                         // <img></img>
            jqueryObject = $('<img/>').attr({id:id});
        }else if(type == 'tbl'){
            jqueryObject = $('<table/>').attr({id:id}); // <table></table>
        }else{
            jqueryObject = $('<table/>').attr({id:id}); // table by default
        }

    }
    return jqueryObject;
};


DOMHelper.isDiv = function(object){
    return object.is('div');
};


DOMHelper.isTable = function(object){
    return object.is('table');
};


DOMHelper.isCanvas = function(object){
    return object.is('canvas');
};





/*****  DOMHelper End *****/
