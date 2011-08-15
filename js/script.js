/**
 * Created by JetBrains PhpStorm.
 * User: altryne
 * Date: 25/5/11
 * Time: 03:42
 */
var mapLoaded = 0
    ,dayOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    ,months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    ,prevDeg = {start:360,end:1080}
    ,curDeg = {start:360,end:1080}
    ,degOffset = 90 //deg to start from bottom center
    ;

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();


$(document).ready(function(){
    var map;
    var geocoder;
    function updateCurrentLocation(curLoc){
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
                  lng:lng
              },
              function(data) {
                  if (data && data.time) {
                      $('#template').removeClass('drag');
                      var _date = data.time.split(' ')[0];
                      day = new Date(_date.split('-').join('/'));
                      $('#time').html(data.time.split(' ')[1]);
                      //split datetime to time
                      updateLightHours(data.sunrise.split(' ')[1],data.sunset.split(' ')[1]);
                      $('#date').html(dayOfWeek[day.getDay()] + ', ' + months[day.getMonth()] + ' ' + day.getDate() + ', ' + day.getFullYear());
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
    }
    dragstarted = function(){
        $('#template').addClass('drag');
    }
    updateLightHours = function(beginTime,endTime) {
        //save current daylight state to cache
        prevDeg = curDeg;
        var beginTime = beginTime.split(':');
        var beginTimeInMinutes = parseInt(beginTime[0], 10) * 60 + parseInt(beginTime[1], 10);
        var endTime = endTime.split(':');
        var endTimeInMinutes = parseInt(endTime[0], 10) * 60 + parseInt(endTime[1], 10);
        //each minute == 0.25 deg
        curDeg = {
            start : beginTimeInMinutes,
            end : endTimeInMinutes
        }
        animloop();

    };
    animloop = function(){
        directionObj = {
            start : (curDeg.start > prevDeg.start) ? -1 : 1,
            end : (curDeg.end > prevDeg.end) ? -1 : 1
        }
        drawLight(directionObj);
        console.log(prevDeg.start,curDeg.start,directionObj.start);
//        if (prevDeg.start != curDeg.start && prevDeg.end != curDeg.end && prevDeg.start < 1439) {
//            drawLight(directionObj);
//            requestAnimFrame(animloop, document.getElementById("dayLightCanvas"));
//        }
    };
    drawLight = function(directionObj){
        console.log(prevDeg.start,curDeg.start);
        beginDeg = prevDeg.start - directionObj.start;
        endDeg = prevDeg.end - directionObj.end;

        prevDeg = {start:beginDeg,end:endDeg};

        //transform minutes to degrees each minute == 0.25 deg
        //probobly there's a smarter way then converting from time to minutes to degrees to radians
        beginDeg =  parseInt(beginDeg * .25,10) - degOffset;
        endDeg = parseInt(endDeg * .25,10) - degOffset;

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
        context.stroke();
        
        context.beginPath();
        context.arc(centerX, centerY, radius, startingAngle, endingAngle, counterclockwise);
        context.strokeStyle = "white"; // line color
        context.stroke();
    }
    function createMap() {
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
        google.maps.event.addListener(map, 'dragend', function() {
            updateCurrentLocation(map.getCenter());
        });
        google.maps.event.addListener(map, 'dragstart', dragstarted);
        google.maps.event.addListener(map, 'tilesloaded', function() {
            if(mapLoaded) return false;
            mapLoaded = true;
//            var html = $('#template').css('display','block');
//            $(html).appendTo('#mainmap>div>div:first-child>div>div');
        });
        $('#mylocation').bind('click',function(){
            navigator.geolocation.getCurrentPosition(function(data){
                var myLatlng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
                map.setOptions({
                    zoom : 10
                });
                map.panTo(myLatlng);
                updateCurrentLocation(map.getCenter())
            });
        });
        updateCurrentLocation(map.getCenter());
    }
    //run it
    createMap();

  });

window.onError = function(){
    throw new Error('something got fucked up');
    
}