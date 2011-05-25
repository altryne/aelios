/**
 * Created by JetBrains PhpStorm.
 * User: altryne
 * Date: 25/5/11
 * Time: 03:42
 */
dayOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
             $.getJSON("http://ws.geonames.org/timezoneJSON?callback=?",
              {
                  'uID': 1,
                  lat:lat,
                  lng:lng
              },
              function(data) {
                  if (data.time) {
                      var _date = data.time.split(' ')[0];
                      day = new Date(_date.split('-').join('/'));
                      $('#time').html(data.time.split(' ')[1]);
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
                    $('#location').html(place.join(','));
                } else {
                   $('#location').html('Somwhere...');
                }
              });
            }
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
        updateCurrentLocation(map.getCenter());
    }
    //run it
    createMap();

  });