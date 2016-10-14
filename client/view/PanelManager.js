/*
mozzlia:

When an object is created, its __proto__ property is set to constructing function's prototype property. For example var fred = new Employee(); will cause fred.__proto__ = Employee.prototype;.

This is used at runtime to look up properties which are not declared in the object directly. E.g. when fred.doSomething() is executed and fred does not contain adoSomething, fred.__proto__ is checked, which points to Employee.prototype, which contains a doSomething, i.e. fred.__proto__.doSomething() is invoked.

Note that __proto__ is a property of the instances, whereas prototype is a property of their constructor functions.
*/
function PanelManager(){

    this.page                   = new PagePanel();
    this.page.pageLeft          = new PageLeftPanel();
    this.page.pageRight         = new PageRightPanel();

    this.loginPanel             = new Panel('divLogin');
    this.navigatorPanel           = new Panel("elementsWrap");

    this.mapPanel               = new Panel("mapWrap");
    this.interactorPanel        = new Panel("tableWrap");

    this.popPanel             =   new PopPanel();
    this.insertTopPanel       =   new InsertTopPanel();
    this.insertBottomPanel    =   new InsertBottomPanel();

    this.slideDownPanel   =   new SlideDownPanel();
    this.slideUpPanel     =   new SlideUpPanel();
    this.slideRightPanel  =   new SlideRightPanel();
    this.slideLeftPanel  =   new SlideLeftPanel();

}

// for the component's properties , such as position, width, height , in the panel.
function Bounds(x,y,width,height){
    this.x  = x ;
    this.y  = y ;
    this.width  = width ;
    this.height = height;
}

// base class Panel
function Panel(domObjectID){
    this.div = null ;
    if(domObjectID){
        this.div = DOMHelper.getObjectElementByIdFromHTML(domObjectID) ;
    }
}
Panel.prototype.show = function(speed){
    if(speed){
        this.div.show(speed);
    }else{
        this.div.show();
    }
};
Panel.prototype.hide = function(speed){
    if(speed){
        this.div.hide(speed);
    }else{
        this.div.hide();
    }
};

Panel.prototype.isHidden = function(){
  return this.div.is(":hidden");
};

Panel.prototype.setComponent = function(component){
    if(component instanceof Grid.prototype.constructor){
        component = component.domObject;
    }
    this.div.empty().append(component);
};
Panel.prototype.addComponent = function(component,bounds){
    if(component instanceof Grid.prototype.constructor){
        component = component.domObject;
    }
    if(bounds){
        component.css({"position":"relative","left":bounds.x,"top":bounds.y,"width":bounds.width,"height":bounds.height});
    }

    var isIn = false;
    this.div.children().each(function(index){
        if($(this).attr("id") == component.attr("id")){
            isIn = true;
        }else{
            isIn = false;
        }
    });

    if(!isIn){
        this.div.append(component);
    }
};

/* Occupied the flow of Html Dom */
function PopPanel(){

    this.div = DOMHelper.getObjectElementByIdFromHTML('divPop') ;

    this.show = function(speed){
        PopPanel.prototype.show.apply(this,arguments);
        $('#grey_background').show();
    };

    this.hide = function(speed){
        PopPanel.prototype.hide.apply(this,arguments);
        $('#grey_background').hide();
    };

}
PopPanel.prototype = new Panel();
PopPanel.prototype.constructor = PopPanel;



/* Occupied the flow of Html Dom */
function InsertTopPanel(){
    this.div = DOMHelper.getObjectElementByIdFromHTML('divInsertTop') ;
}
InsertTopPanel.prototype = new Panel();
InsertTopPanel.prototype.constructor = InsertTopPanel;

/* Occupied the flow of Html Dom */
function InsertBottomPanel(){
    this.div = DOMHelper.getObjectElementByIdFromHTML('divInsertBottom') ;
}
InsertBottomPanel.prototype = new Panel();
InsertBottomPanel.prototype.constructor = InsertBottomPanel;



/** SlidePanel Component Begin **/

//base class SlidePanel
function SlidePanel(){
    this.isVertical = true;
    this.toggled = true;

    this.parent = $('<div/>') ;
    this.div = null    ;

    this.animateUp      =   function(){};
    this.animateDown    =   function(){};
}
SlidePanel.prototype = new Panel();
SlidePanel.prototype.constructor = SlidePanel;
SlidePanel.prototype.initializeWithDomObj = function(domObjID){
    this.div = DOMHelper.getObjectElementByIdFromHTML(domObjID);
    var cssObj = {
        'margin':'0 auto',
        'border':'1px solid gray',
        'borderRadius':'3px',
        'boxShadow':'rgba(0, 0, 0, 0.5) 0 4px 18px',
        'backgroundColor':'rgba(0,0,0,0.3)'       // to solved Child elements will opacity too
//        'opacity':'0.8',                          // Child elements will opacity too
    }

    this.div.css(cssObj);
    if(this.isVertical){
        this.parent.css({'position':'fixed','width':'100%','height':'0px'/*,'border':'1px solid black'*/});
    }else{
        this.parent.css({'position':'fixed','top':0,'width':'0px','height':'100%'/*,'border':'1px solid black'*/});
    }

    $('body').append(this.parent.append(this.div));

}

SlidePanel.prototype.show = function(){
    this.animateUp();
}

SlidePanel.prototype.hide = function(){
    this.animateDown();
}

SlidePanel.prototype.toggle = function(){
    if(this.toggled){
        this.animateUp();
        this.toggled = !this.toggled;
    }else{
        this.toggled = !this.toggled;
        this.animateDown();
    }
}

SlidePanel.prototype.setComponent = function(component){
    if(component instanceof Grid.prototype.constructor){
        component = component.domObject;
    }
    var ref = this;
    this.div.empty().append(
        $('<div/>')
            .css({'display':'table','width':'100%','height':'100%','opacity':'1'})
            .append(($('<div/>').css({'display':'table-cell','verticalAlign':'middle'})
            .append(component).append($('<a/>').addClass('btn btn-primary').append('Hide').unbind('click').bind('click',
            function(){
                ref.hide();
            })
        ))
        ));

//    this.div.append(ImageCache.getPng('slide_div_hide'));
    if(typeof component != 'string'){
        if(!this.isVertical){
            this.div.css({'width':'auto'});
        }else{
            this.div.css({'height':'auto'});
        }
    }else{
        if(!this.isVertical){
            this.div.css({'width':'200px'});
        }else{
            this.div.css({'height':'200px'});
        }
    }
};



/* Occupied the flow of Html Dom */
function PagePanel(){
    this.div = DOMHelper.getObjectElementByIdFromHTML('page-list') ;

    this.animateUp = function(){
        this.div.animate({
                'left':0
            },
            200,
            function(){
                $($("#footer #dot-list li").get(0)).addClass("selected");
                $($("#footer #dot-list li").get(0)).siblings().removeClass("selected");
            });
    }

    this.animateDown = function(){
        this.div.animate({
                'left':-document.width
            },
            500,
            function(){
                $($("#footer #dot-list li").get(1)).addClass("selected");
                $($("#footer #dot-list li").get(1)).siblings().removeClass("selected");
            });
    }
}
PagePanel.prototype = new SlidePanel();
PagePanel.prototype.constructor = PagePanel;

PagePanel.prototype.setComponent = function(component){
    if(component instanceof Grid.prototype.constructor){
        component = component.domObject;
    }

    this.div.empty().append(
        $('<div/>')
            .css({'display':'table','width':'100%','height':'100%','opacity':'1'})
            .append(($('<div/>').css({'display':'table-cell','verticalAlign':'middle'})
            .append(component))
        ));

};

function PageLeftPanel(){
    this.div = DOMHelper.getObjectElementByIdFromHTML('page-left') ;

    this.animateUp = function(){
        this.prototype.div.animate({
                'left':0
            },
            200,
            function(){
                $($("#footer #dot-list li").get(0)).addClass("selected");
                $($("#footer #dot-list li").get(0)).siblings().removeClass("selected");
            });
    }

    this.animateDown = function(){
        this.prototype.div.animate({
                'left':-document.width
            },
            500,
            function(){
                $($("#footer #dot-list li").get(1)).addClass("selected");
                $($("#footer #dot-list li").get(1)).siblings().removeClass("selected");
            });
    }
}
PageLeftPanel.prototype = new PagePanel();
PageLeftPanel.prototype.constructor = PageLeftPanel;

function PageRightPanel(){
    this.div = DOMHelper.getObjectElementByIdFromHTML('page-right') ;
    var msgDiv = DOMHelper.getObjectElementByIdFromHTML('div-msg');

    this.animateUp = function(){
        this.prototype.div.animate({
                'left':0
            },
            200,
            function(){
                $($("#footer #dot-list li").get(0)).addClass("selected");
                $($("#footer #dot-list li").get(0)).siblings().removeClass("selected");
            });
    }

    this.animateDown = function(){
        this.prototype.div.animate({
                'left':-document.width
            },
            500,
            function(){
                $($("#footer #dot-list li").get(1)).addClass("selected");
                $($("#footer #dot-list li").get(1)).siblings().removeClass("selected");
            });
    }

    this.setComponent = function(component){
        if(component instanceof Grid.prototype.constructor){
            component = component.domObject;
        }

        msgDiv.empty().append(
            $('<div/>')
                .css({'display':'table','width':'100%','height':'auto','opacity':'1','overflow':'scroll'})
                .append(($('<div/>').css({'display':'table-cell','verticalAlign':'middle'})
                .append(component))
            ));
    }


}
PageRightPanel.prototype = new PagePanel();
PageRightPanel.prototype.constructor = PageRightPanel;


/* Not Occupied the flow of Html Dom yet ,before we create this node out */
function SlideDownPanel(domID){
    this.isVertical = true;

    if(!domID){
        this.initializeWithDomObj('divSlideDown');      // default
    }else{
        this.parent = $('<div/>') ;                   // when new another instance , for not share the same parent.
        this.initializeWithDomObj(domID);
    }
    this.parent.css({'top':'-5px'});

    var cssObj = {                                      // default
        'width' : '500px',
        'height': 'auto',
        'zIndex':'100'
    }
    this.div.css(cssObj);

    /* set the position */
    this.setOffsetTop = function(offsetTop){
        this.parent.css({'top':offsetTop});
    };
    this.setOffsetLeft = function(OffsetLeft){
        this.div.css({'position':'absolute','left':OffsetLeft});
    }

    this.animateUp = function(){
        this.div.slideDown(100);
    };

    this.animateDown = function(){
        this.div.slideUp(200);
    };
}
SlideDownPanel.prototype = new SlidePanel();
SlideDownPanel.prototype.constructor = SlideDownPanel;


/* Not Occupied the flow of Html Dom yet ,before we create this node out */
function SlideUpPanel(domID){
    this.isVertical = true;

    if(!domID){
        this.initializeWithDomObj('divSlideUp') ;
    }else{
        this.parent = $('<div/>') ;
        this.initializeWithDomObj(domID) ;
    }

    this.parent.css({'bottom':'-5px'});
    var cssObj = {
        'width' : '60%',
        'height': 'auto',
        'zIndex':'100'
    };
    this.div.css(cssObj);

    this.animateUp = function (){
        this.parent.animate({
            'bottom':this.div.height()+55
        },
        1000,
        function(){

        });
    };
    this.animateDown = function (){
        this.parent.animate({
                'bottom':-5
            },
            1000,
            function(){

            });
    }
}
SlideUpPanel.prototype = new SlidePanel();
SlideUpPanel.prototype.constructor = SlideUpPanel;


/* Not Occupied the flow of Html Dom yet ,before we create this node out */
function SlideRightPanel(){
    this.isVertical = false;
    this.initializeWithDomObj('divSlideRight') ;
    this.parent.css({'right':'-5px'});
    var cssObj = {
        'width' : '200px',
        'height': '60%',
        'zIndex':'101',
        'position':'absolute'
    };

    this.div.css(cssObj);

    this.animateUp = function (){
        this.parent.animate({
                'right':this.div.width()+3
            },
            1000,
            function(){

            });
    };
    this.animateDown = function (){
        this.parent.animate({
                'right':-5
            },
            1000,
            function(){

            });
    }
}
SlideRightPanel.prototype = new SlidePanel();
SlideRightPanel.prototype.constructor = SlideRightPanel;


/* Not Occupied the flow of Html Dom yet ,before we create this node out */
function SlideLeftPanel(){
    this.isVertical = false;
    this.initializeWithDomObj('divSlideLeft') ;

    this.parent.css({'left':'-5px'});
    var cssObj = {
        'width' : '200px',
        'height': '60%',
        'zIndex':'101',
        'float':'right'
    };

    this.div.css(cssObj);

    this.animateUp =function (){
        this.parent.animate({
                'left':this.div.width()+3
            },
            1000,
            function(){

            });
    };
    this.animateDown = function (){
        this.parent.animate({
                'left':-5
            },
            1000,
            function(){

            });
    }
}
SlideLeftPanel.prototype = new SlidePanel();
SlideLeftPanel.prototype.constructor = SlideLeftPanel;

/** SlidePanel Component End **/
