/*****  Base Grid Begin *****/

function Grid(){
    this.data       = null;
    this.domObject  = null;
    this.controller = null;
    this.metaData   = null;

    this.preRender = function(){};
    this.createRow = function(){};
    this.outputCell = function(row,cellData,key,args){};
    this.didOutputRow = function(row){};
    this.didRender  =   function(){};
}


Grid.prototype.setMetaData = function(_MetaData){
    this.metaData = _MetaData;
}

Grid.prototype.setData = function(data){
    this.data = data ;
};
Grid.prototype.setDOMObject = function(id){
    this.domObject = DOMHelper.getObjectElementByIdFromHTML(id);
};
Grid.prototype.setController = function(controller){
    this.controller = controller;
};
Grid.prototype.render =   function(){
    this.preRender();
    for(var name in this.data){
        var row = this.createRow();
        for(var key in this.data[name] ){
            this.outputCell(row,this.data[name][key],key,arguments);
        }
        this.didOutputRow(row);
    }
    this.didRender();
}

/*****  Base Grid End *****/


/*****  CanvasGrid Begin *****/

function CanvasGrid(domObjectId){
    if (domObjectId) this.setDOMObject(domObjectId);
    var canvasGrid = this;
    var canvas = this.domObject.get(0);
    var context2D = canvas.getContext('2d');
    var i  , j  ;
    this.preRender = function(){
        if(!canvas);
        if(!context2D)context2D = canvas.getContext('2d')
        canvas.width = canvas.width;
        i = -1 ;
        j = -1 ;
    }

    this.createRow = function() {
        i ++ ;
        i = i % this.controller.columnCount ;
        if(i == 0 ) j++ ;
    }

    this.outputCell = function(row,cellData,key,args) {
        if(key != this.controller.bgImgKey && key != this.controller.objectImgKey) return ;

        if(args && args[0] && key == this.controller.objectImgKey && (i + j*7 == 24)) return;     // for Animation

        var imgFullURL = Utils.composeToImgFullLink(this.metaData,cellData);
        var img = ImageCache.getImage(imgFullURL);
        context2D.drawImage(img,img.width*i,img.height*j);

    }

    this.didOutputRow = function(row) {
    }

    this.didRender = function(){
    }

    this.animation = function(callback){
        var path = data.newData.effect['move.path'];
        var paths = {};
        for(var index in path){
            paths[index] = path[index].split(":");
        }
        var stepdelay = data.newData.effect['move.stepdelay'];
        var stepertile = data.newData.effect['move.stepertile'];

        var pic = ImageCache.getImage(Utils.composeToImgFullLink(this.metaData,data.newData.effect['image.start']));

        var distanceX = 0, distanceY = 0;
        for(var index in paths){
            distanceY += 64*parseInt(paths[index][0]);
            distanceX += 64*parseInt(paths[index][1]);
        }

        console.log("distanceX:" + distanceX + " distanceY:" + distanceY);
        var x = 192 , y = 192 ;
        var interval = setInterval(function(){
            if(distanceX != 0)x += distanceX/10 ;
            if(distanceY != 0)y += distanceY/10 ;
            move(pic,x,y,interval,distanceX,distanceY,callback);
        },50);
    }

    function move(pic,x,y,interval,distanceX,distanceY,callback){
        context2D.clearRect(0,0,canvas.width,canvas.height);
        canvasGrid.render(true);
        context2D.drawImage(pic,x, y);

        if(Math.abs(192 - x) > Math.abs(distanceX) || Math.abs(192 - y) > Math.abs(distanceY) || (distanceX == 0 && distanceY == 0) ){
            clearInterval(interval);
            callback();
        }
    }
}
CanvasGrid.prototype = new Grid();
CanvasGrid.prototype.constructor = CanvasGrid;

/*****  CanvasGrid End *****/





/*****  TableGrid Begin *****/

function TableGrid(){

    this.preRender = function(){
        this.domObject.empty();
        this.controller.initialize(this.metaData);
    }

    this.createRow = function() {
        var tr = this.controller.preProcess();
        if(tr){
            return tr;
        }else{
            return $('<tr/>');
        }
    }

    this.outputCell = function(tr,cellData,key) {

        cellData = this.controller.process(cellData,key,this.metaData);

        if(cellData){
            tr.append($('<td/>').append(cellData));
        }

    }

    this.didOutputRow = function(tr) {
        this.domObject.append(tr);
    }

    this.didRender = function(){
        this.domObject.find(':empty').each(function(){
            if(this.nodeName != 'IMG'){
                $(this).remove();
            }
        });
        this.domObject.addClass('table table-bordered table-condensed').css('border','solid 1px black');
    }
}
TableGrid.prototype = new Grid();
TableGrid.prototype.constructor = TableGrid;

/*****  TableGrid End *****/
