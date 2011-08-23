/**
 * Created by JetBrains PhpStorm.
 * User: altryne
 * Date: 25/5/11
 * Time: 03:42
 */


aelios = {
    o : {
        mapLoaded : 0
        ,firstTime : true
        ,dayOfWeek : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
        ,months : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        ,curDeg : {start:367,end:1080}
        ,degOffset : 90 //deg to start from bottom center
        ,titleWidth : 150,
        pointerPrevAngle : 0
    },
    init : function(){
        var map;
        var geocoder;

        //create a dummy div to animate canvas with jquery off of it
        $('<div id="one"/>').css({'display':'none','top':this.o.curDeg.end,'left':this.o.curDeg.start}).appendTo('body');

        //prevent canvas from premature painting, only paint on image load
        aelios.o.img = $('<img/>').attr('src','img/repeat.jpg').load(function(){
            //draw initial light stages on canvas
            aelios.drawLight(aelios.o.curDeg.start,aelios.o.curDeg.end,'nightCanvas');
            aelios.drawLight(aelios.o.curDeg.start,aelios.o.curDeg.end,'dayLightCanvas');
        })

        zodiac.init($('#marker'),$('#rotate'));
        //initiate google map
        this.createMap();
    },
    createMap : function(){
        //todo:search localstorage for previously set latlng
        var myLatlng = new google.maps.LatLng(51.5085932, -0.1247547);
        var myOptions = {
            zoom: 6,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            navigationControl: true,
            navigationControlOptions: {
                style:
                        google.maps.NavigationControlStyle.SMALL
            },
            mapTypeControl: false
        }
        geocoder = new google.maps.Geocoder();
        map = new google.maps.Map(document.getElementById("mainmap"), myOptions);
        this.bindMapEvents(map);


    },
    bindMapEvents : function(map){
        google.maps.event.addListener(map, 'dragend', function() {
            aelios.updateCurrentLocation(map.getCenter());
        });
//        google.maps.event.addListener(map, 'drag', function() {
//            aelios.animatePointer();
//        });
        google.maps.event.addListener(map, 'tilt_changed', function() {
            if(!aelios.o.firstTime){
                aelios.updateCurrentLocation(map.getCenter());
            }
        });
//        google.maps.event.addListener(map, 'zoom_changed', function() {
//            updateCurrentLocation(map.getCenter());
//        });
        google.maps.event.addListener(map, 'dragstart', aelios.dragstarted);
        google.maps.event.addListener(map, 'tilesloaded', function() {
            if(aelios.o.mapLoaded) return false;
            aelios.o.mapLoaded = true;
            aelios.getBoundingBox();
        });
        $('#mylocation').bind('click',function(){
            navigator.geolocation.getCurrentPosition(function(data){
                var myLatlng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
                map.setOptions({
                    zoom : 10
                });
                map.panTo(myLatlng);
                aelios.updateCurrentLocation(map.getCenter())
            });
        });
        $('#search').bind('click',aelios.search);
        $('#searchInput').bind('keydown',function(e){
            if(e.keyCode == 13){
                aelios.findLocation($(this).prop('value'));
            }
        });
        $('#overlay').bind('click',aelios.searchOff);
        
    },
    getBoundingBox : function(){
        ov = new google.maps.OverlayView();
        ov.draw = function () {};
        ov.onRemove = function () {};
        ov.setMap(map);
        projection = ov;
        prj = projection.getProjection();
        if(!prj) return;

        var container = $('#boundingBox');
        var padding = $('#boundingBox').width();
        var northeast = prj.fromContainerPixelToLatLng({x:container.offset().left + padding,y:container.offset().top});
        var southwest = prj.fromContainerPixelToLatLng({x:container.offset().left,y:container.offset().top + padding});
        return [Math.round(northeast.Oa*100)/100,Math.round(northeast.Pa*100)/100,Math.round(southwest.Oa*100)/100,Math.round(southwest.Pa*100)/100];
    },
    updateCurrentLocation : function(curLoc,stilldragging){
//        check online status
        if(navigator.onLine){
            document.querySelector('body').classList.remove('offline');
        }else{
            document.querySelector('body').classList.add('offline');
        }
        
        curLoc = curLoc || map.getCenter();
        $('#loader').fadeIn();
        //set timeout to use geonames results instead of googles geocoding (much more reliable)
        var timeout = 1000,t0;
        if (geocoder) {
            //get geodocing data from google
            var latlng = curLoc;
              geocoder.geocode({'latLng': latlng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    country = results[results.length-1].formatted_address.split(',')[0];
                    place = 'Somewhere...';
                } else {
                    place = 'Somewhere...';
                    country = 'World';
                }
                t0 = window.setTimeout(function(){
                    $('#location').html(place);
                    $('#country').html(country).css('width','');
                    aelios.o.titleWidth = $('#title').find('.titleCont').width();
                    $('#template').removeClass('drag');
                },timeout);
              });
            //cancel the rest of this function if function was called on mouse move event
            if(stilldragging) return false;
            //get bset matched city name and location from geonames
            var lat = curLoc.Oa;
            var lng = curLoc.Pa;
            var bounding = aelios.getBoundingBox();
            var citiesAjax = $.getJSON("http://api.geonames.org/citiesJSON?callback=?",
                    {
                        username: 'altryne',
                        north : bounding[0],
                        east : bounding[1],
                        south : bounding[2],
                        west : bounding[3],
                        maxRows :1,
                        timeout : 200
                    },function(data){
                        if(data.geonames && data.geonames.length > 0){
                            window.clearTimeout(t0);
                            $('#location').html(data.geonames[0].name);
                            $('#country').html(country).css('width','');
                            $('#template').removeClass('drag');
                            var latlng = new google.maps.LatLng(data.geonames[0].lat, data.geonames[0].lng);
                            aelios.animatePointer(latlng);
                        }
                    }
            );
            //get sunrise and sunset data from geonames
            var jqxhr = $.getJSON("http://ws.geonames.org/timezoneJSON?callback=?",
              {
                  'uID': 1,
                  lat:lat,
                  lng:lng,
                  'username' : 'altryne'
              },
              function(data) {
                  if (data && data.time) {
                      var _date = data.time.split(' ')[0];
                      day = new Date(_date.split('-').join('/'));
                      $('#time').html(data.time.split(' ')[1]);
                      //split datetime to time
                      aelios.updateLightHours(data.sunrise.split(' ')[1],data.sunset.split(' ')[1]);
                      $('#date').html(aelios.o.dayOfWeek[day.getDay()] + ', ' + aelios.o.months[day.getMonth()] + ' ' + day.getDate() + ', ' + day.getFullYear());
                  }
              }
            );
        }
    },
    animatePointer : function(latlng){
        if(latlng){
            divpixel = prj.fromLatLngToContainerPixel(latlng);
        }else{
            divpixel = {x:$('#marker').width(),y:$('#marker').height()};
        }

        pointerx = Math.round(divpixel.x - $('#marker').offset().left);
        pointery = Math.round(divpixel.y - $('#marker').offset().top);
        $('#pointer').animate({left:pointerx,top:pointery},1500);

        p1 = {x:$('#marker').width()/2,y:$('#marker').height()/2};
        //angle calculations
        var direction = {};
        direction.x =  (pointerx <= $('#marker').width() / 2) ? -1 : 1 ;
        direction.y =  (pointery <= $('#marker').height() / 2) ? -1 : 1 ;
        p2 = {x : pointerx * direction.x,y:pointery * direction.y};
        p2 = {x : pointerx,y:pointery};
        var angle = (2 * Math.atan2(p2.y - p1.y, p2.x - p1.y)) * 180 / Math.PI ;
        
        if(angle <= 0){
            angle = angle + 360;
        }
        if(angle >= 360){
            angle = angle - 360;
        }
        console.log(angle,aelios.o.pointerPrevAngle);
        $('#pointer')[0].style.webkitTransform = 'rotateZ(' + angle + 'deg)';
        aelios.o.pointerPrevAngle = angle;
    },
    dragstarted : function(){
        $('#template').addClass('drag');
//        aelios.animatePointer();
    },
    updateLightHours : function(beginTime,endTime) {
        var beginTime = beginTime.split(':');
        var beginTimeInMinutes = parseInt(beginTime[0], 10) * 60 + parseInt(beginTime[1], 10);
        var endTime = endTime.split(':');
        var endTimeInMinutes = parseInt(endTime[0], 10) * 60 + parseInt(endTime[1], 10);
        //piggyBack on jquery's animate, to animate canvas properties
        $('#one').animate({
            left:beginTimeInMinutes,
            top:endTimeInMinutes
            },{
            duration : 600,
            easing : 'easeOutBack',
            step : function(now,fx){
                aelios.drawLight(
                    parseInt($(this).css('left')),
                    parseInt($(this).css('top'))
                )
            }
        })
    },
    drawLight : function(beginDeg,endDeg,canvasElm){
        canvasElm = canvasElm || 'dayLightCanvas';
        //transform minutes to degrees each minute == 0.25 deg
        //probobly there's a smarter way then converting from time to minutes to degrees to radians
        beginDeg =  parseInt(beginDeg * .25,10) - this.o.degOffset;
        endDeg = parseInt(endDeg * .25,10) - this.o.degOffset;

        canvas = document.getElementById(canvasElm);
        context = canvas.getContext("2d");
        context.clearRect(0,0,canvas.offsetWidth,canvas.offsetHeight);
        context.beginPath();
        context.lineWidth = 44;
        centerX = centerY = canvas.offsetWidth / 2;
//        centerY = canvas.offsetHeight / 2;
        radius = canvas.offsetWidth / 2 - context.lineWidth/2;
        //one rad = (PI/180) * deg
        startingAngle = (Math.PI / 180) * beginDeg;
        endingAngle = (Math.PI / 180) * endDeg;
        counterclockwise = false;

        if(canvasElm == 'nightCanvas'){
            context.arc(centerX, centerY, radius, 0 , Math.PI*2, true);
            context.strokeStyle = context.createPattern(aelios.o.img[0], 'repeat')
            context.stroke();
        }else{
            context.arc(centerX, centerY, radius, startingAngle, endingAngle, counterclockwise);
            context.strokeStyle = "white"; // line color
            context.stroke();
        }
    },
    search : function(){
        $('.titleCont').animate({width:300,height:30,marginTop:15},{
            duration:200
        },{
            complete:function(){}
        });
        if($('body').is('.search')){
            aelios.findLocation($('#searchInput').prop('value'));
        }

        $('body').addClass('search');
    },
    searchOff : function(){
        $('body').removeClass('search');
        $('#searchInput').prop('value','');
        $('.titleCont').animate({width:aelios.o.titleWidth,height:50,marginTop:0},{
            duration:200,
            easing: 'swing',
            complete: function(){
                $('.titleCont').width('');
            }
        });

    },
    findLocation : function(address){

        $('#title .titleCont').removeClass('error');
        geocoder.geocode({ 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK && address != '') {
                aelios.searchOff();
                map.setCenter(results[0].geometry.location);
                aelios.updateCurrentLocation();
            } else {
                $('#title .titleCont').addClass('error');
                $('#searchInput').prop('value','');
            }
        })
    }
}

$(document).ready(function(){
    aelios.init();
});

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/
if(typeof document!=="undefined"&&!("classList" in document.createElement("a"))){(function(j){var a="classList",f="prototype",m=(j.HTMLElement||j.Element)[f],b=Object,k=String[f].trim||function(){return this.replace(/^\s+|\s+$/g,"")},c=Array[f].indexOf||function(q){var p=0,o=this.length;for(;p<o;p++){if(p in this&&this[p]===q){return p}}return -1},n=function(o,p){this.name=o;this.code=DOMException[o];this.message=p},g=function(p,o){if(o===""){throw new n("SYNTAX_ERR","An invalid or illegal string was specified")}if(/\s/.test(o)){throw new n("INVALID_CHARACTER_ERR","String contains an invalid character")}return c.call(p,o)},d=function(s){var r=k.call(s.className),q=r?r.split(/\s+/):[],p=0,o=q.length;for(;p<o;p++){this.push(q[p])}this._updateClassName=function(){s.className=this.toString()}},e=d[f]=[],i=function(){return new d(this)};n[f]=Error[f];e.item=function(o){return this[o]||null};e.contains=function(o){o+="";return g(this,o)!==-1};e.add=function(o){o+="";if(g(this,o)===-1){this.push(o);this._updateClassName()}};e.remove=function(p){p+="";var o=g(this,p);if(o!==-1){this.splice(o,1);this._updateClassName()}};e.toggle=function(o){o+="";if(g(this,o)===-1){this.add(o)}else{this.remove(o)}};e.toString=function(){return this.join(" ")};if(b.defineProperty){var l={get:i,enumerable:true,configurable:true};try{b.defineProperty(m,a,l)}catch(h){if(h.number===-2146823252){l.enumerable=false;b.defineProperty(m,a,l)}}}else{if(b[f].__defineGetter__){m.__defineGetter__(a,i)}}}(self))};