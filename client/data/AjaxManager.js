
function AjaxManager() {

    var ServerBaseUrl   =   'http://worlderland.com' ; //http://appingpoint.net';
    var JsonGateURL     =   ServerBaseUrl + '/Primus/JSONGate';
    var specificURL     =   JsonGateURL + "?Action=";

    this.requestWebServer = function(wsrPack) {   //JSON.stringify(wsrPack)
        var paramater = '';
        var action = wsrPack.action;
        var actee = wsrPack.actee;
        if(action == ActionType.Login) {
            paramater = "&username="+actee.username+"&password="+actee.password;
        } else if(action == ActionType.LoadCharacter){
            paramater = "&worldcode="+actee;
        }else{
            paramater = (typeof actee == 'undefined' ? '' : '&Actee='+actee);
        }

        var finalURL = specificURL + action + paramater;
        //jQuery.get(finalURL, null, this.webServerCallBack, 'json');


        var ajaxOptions = {
            url: finalURL,
            type: "get",
            dataType: "json",
            success: this.webServerCallBack,
            error: null,
            beforeSend: function(xhr){
                xhr.withCredentials = true;
            }
//            xhrFields: {
//                withCredentials: true
//            }
        };
        $.ajax(ajaxOptions);


        /*
        $.ajax({
            type : "Get",
            url :finalURL,
            data : null,
            dataType :"jsonp",
            jsonp: false,
            jsonpCallback: "webServerCallBack",
            success : function(data){
                alert(data);},
            error : function(httpReq,status,exception){
                alert(status+" "+exception);
            }
        });
        */

        /*
        $.ajax({
            type: 'GET',
            url:finalURL,
            data: null,
            success: function(data, textStatus, request){
                alert(request.getResponseHeader('some_header'));
            },
            error: function (request, textStatus, errorThrown) {
                alert(request.getResponseHeader('some_header'));
            }
        });
        */

        /*
        $.ajax(
            {
                type: "GET",
                url: finalURL,
                data: null,
                dataType: 'jsonp',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Cookie", "JSESSIONID=68E306BB0ECE4B8D31D69262206A00CD");
                },
                success: function(){
                    alert('success');
                },
                error: function (xhr) {
                    alert(xhr.responseText);
                }
            }
        );
        */
    }

    this.webServerCallBack = function(message, textStatus, request) {
        var cookieResponse = request.getResponseHeader('Set-Cookie');  // It won't work with HTTPOnly cookies though :)
        console.log(cookieResponse);

        var data = {
            action : message['_MetaData']['_ServiceLogged'],
            json : message          // JSON.parse(message)
        }

        actor.processDataEvent(data);
    }

}