/* NameSpace */
function ImageCache(){} ;
//var ImageCache = {};

ImageCache.loadImage = function(url){
    var image = new Image();
    image.src = url;
    return image;
}

// Class method
ImageCache.getImage = function(url,isInPopDiv){
    var image;
    if(this[url]){
        image = this[url];
    }else{
        image= ImageCache.loadImage(url);
        this[url]  =  image;

        image.onerror = function(){
            delete ImageCache[url];
            console.error('Download image + ' + url +' failed');
        }

        if(!this.count) this.count = 0;
        console.log( ++this.count + ' new Image in ImageCache');
    }

    if(isInPopDiv){
        image = new Image();
        image.src = url;
        console.log('clone new image');
    }
    return image;
};

/* subNameSpace */
ImageCache.Gif = {};
ImageCache.getGif = function(gifName){
    var gif ;
    if(this.Gif[gifName]){
        gif = this.Gif[gifName];
    }else{
        gif = new Image();
        if(gifName.substring(gifName.length-5 , gifName.length) == '_stop' || gifName.substring(gifName.length-6 , gifName.length) == '_blank' ){
            gif.src = './resources/images/'+gifName+'.png';
        }else{
            gif.src = './resources/images/'+gifName+'.gif';
        }
        this.Gif[gifName] = gif;

        gif.onerror = function(){
            delete ImageCache.Gif[gifName];
            console.error('Download image + ' + gif.url +' failed');
        }
    }
    return gif;
}

// Load some gif first
ImageCache.getGif('gif_websocket_stop');
ImageCache.getGif('gif_websocket_normal');
ImageCache.getGif('gif_horizontal');
ImageCache.getGif('gif_horizontal_blank');
ImageCache.getGif('gif_dot_circle');
ImageCache.getGif('gif_rec_circle');

ImageCache.getGif('gif_wsr_normal');
ImageCache.getGif('gif_wsr_blank');
ImageCache.getGif('gif_wsr_stop');


/* sub NameSpace*/
ImageCache.Png = {};
ImageCache.getPng = function(pngName){
    var png ;
    if(this.Png[pngName]){
        png = this.Png[pngName];
    }else{
        png = new Image();
        png.src = '/client/resources/images/'+pngName+'.png';
        this.Png[pngName] = png;

        png.onerror = function(){
            delete ImageCache.Png[pngName];
            console.error('Download image + ' + png.url +' failed');
        }
    }
    return png;
}
