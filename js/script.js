/**
 * Created by JetBrains PhpStorm.
 * User: altryne
 * Date: 25/5/11
 * Time: 03:42
 */


aelios = {
    o : {
        mapLoaded : 0
        ,dayOfWeek : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
        ,months : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        ,curDeg : {start:367,end:1080}
        ,degOffset : 90 //deg to start from bottom center
    },
    init : function(){
        var map;
        var geocoder;

        //create 2 dummy divs to animate canvas with jquery off of them
        $('<div id="one"/>').css({'display':'none','top':this.o.curDeg.end,'left':this.o.curDeg.start}).appendTo('body');

        //prevent canvas from premature painting, only paint on image load
        aelios.o.img = $('<img/>').attr('src','img/repeat.jpg').load(function(){
            //draw initial light stages on canvas
            aelios.drawLight(aelios.o.curDeg.start,aelios.o.curDeg.end);
        })


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

//        this.updateCurrentLocation(map.getCenter());
        this.bindMapEvents(map);

    },
    bindMapEvents : function(map){
        google.maps.event.addListener(map, 'dragend', function() {
            aelios.updateCurrentLocation(map.getCenter());
        });
        google.maps.event.addListener(map, 'tilt_changed', function() {
            aelios.updateCurrentLocation(map.getCenter());
        });
//        google.maps.event.addListener(map, 'zoom_changed', function() {
//            updateCurrentLocation(map.getCenter());
//        });
        google.maps.event.addListener(map, 'dragstart', aelios.dragstarted);
        google.maps.event.addListener(map, 'tilesloaded', function() {
            if(aelios.o.mapLoaded) return false;
            aelios.o.mapLoaded = true;
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
    },
    updateCurrentLocation : function(curLoc){
        $('#loader').fadeIn();
        if (geocoder) {
            var latlngStr = String(curLoc);
            latlngStr = latlngStr.substring(1,latlngStr.length-1);
            latlngStr = latlngStr.split(",");
            var lat = parseFloat(latlngStr[0]);
            var lng = parseFloat(latlngStr[1]);
            var jqxhr = $.getJSON("http://ws.geonames.org/timezoneJSON?callback=?",
              {
                  'uID': 1,
                  lat:lat,
                  lng:lng,
                  'username' : 'altryne'
              },
              function(data) {
                  if (data && data.time) {
                      $('#template').removeClass('drag');
                      var _date = data.time.split(' ')[0];
                      day = new Date(_date.split('-').join('/'));
                      $('#time').html(data.time.split(' ')[1]);
                      //split datetime to time
                      aelios.updateLightHours(data.sunrise.split(' ')[1],data.sunset.split(' ')[1]);
                      $('#date').html(aelios.o.dayOfWeek[day.getDay()] + ', ' + aelios.o.months[day.getMonth()] + ' ' + day.getDate() + ', ' + day.getFullYear());
                  }
                  if (data.countryName) {
                      $('#country').html(data.countryName);
                  } else {
                      $('#country').html('World');
                  }
              }
            );
            var latlng = new google.maps.LatLng(lat, lng);
              geocoder.geocode({'latLng': latlng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var place = results[results.length - 2].formatted_address.split(',');
                    place.pop();
                    if(!place.length){
                        place = results[1].formatted_address.split(',');
                        place.pop();
                        if(!place.length){
                            $('#location').html('Somewhere...');
                        }
                    }
                    $('#location').html(place.join(','));
                } else {
                   $('#location').html('Somewhere...');
                }
              });
            }
    },
    dragstarted : function(){
        $('#template').addClass('drag');
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
            duration : 1200,
            step : function(now,fx){
                aelios.drawLight(
                    parseInt($(this).css('left')),
                    parseInt($(this).css('top'))
                )
            }
        })
    },
    drawLight : function(beginDeg,endDeg){
        //transform minutes to degrees each minute == 0.25 deg
        //probobly there's a smarter way then converting from time to minutes to degrees to radians
        beginDeg =  parseInt(beginDeg * .25,10) - this.o.degOffset;
        endDeg = parseInt(endDeg * .25,10) - this.o.degOffset;

        canvas = document.getElementById("dayLightCanvas");
        context = canvas.getContext("2d");
        context.beginPath();
        context.lineWidth = 44;
        centerX = centerY = canvas.offsetWidth / 2;
//        centerY = canvas.offsetHeight / 2;
        radius = canvas.offsetWidth / 2 - context.lineWidth/2;
        //one rad = (PI/180) * deg
        startingAngle = (Math.PI / 180) * beginDeg;
        endingAngle = (Math.PI / 180) * endDeg;
        counterclockwise = false;

        context.arc(centerX, centerY, radius, startingAngle, endingAngle, true);
        context.strokeStyle = "black"; // line color
        context.strokeStyle = context.createPattern(aelios.o.img[0], 'repeat')
        context.stroke();

        context.beginPath();
        context.arc(centerX, centerY, radius, startingAngle, endingAngle, counterclockwise);
        context.strokeStyle = "white"; // line color
        context.stroke();
    }
}

$(document).ready(function(){
    aelios.init();
  });

window.onError = function(){
    console.error('WTF DUDE??? WHAT DID U DO?');
    throw new Error('something got fucked up');
    
}
