function Utils(){};

Utils.isNumber = function(object){
    return object.constructor == Number ;
}

Utils.isString = function(object){
    return object.constructor == String ;
}

Utils.isObject = function(object){
    return object.constructor == Object ;
}

Utils.isArray = function(object){
    return object.constructor == Array ;
}

Utils.isImage = function(object){
    if(object.nodeName){
        return object.nodeName == 'IMG';
    }else{
        return object.constructor == Image ;
    }
}

Utils.isImageLink = function(content){
    return typeof content != 'string'? false : content.substring(content.length-4,content.length) == '.png';
}

Utils.isFullLink = function(content){
    return content.substring(0,7) == 'http://' || content.substring(0,4) == 'www.';
}

Utils.composeToImgFullLink = function(metaData,link){
    if(Utils.isImageLink(link)){
        if(!Utils.isFullLink(link)){
            link = context.serverBaseUrl + metaData._Config.root + '/' + link;
        }
    }
    return link;
}

Utils.cloneObj = function cloneObj(fromObj,toObj){
    if(typeof toObj == 'undefined'){
        toObj = {};
    }

    for(var i in fromObj){
        if(typeof fromObj[i] == "object"){
            toObj[i]={};
            cloneObj(fromObj[i],toObj[i]);
            continue;
        }
        toObj[i] = fromObj[i];
    }
    return toObj;
}
