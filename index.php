<!doctype html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Prevent scaling -->
    <meta name="viewport" content = "user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

    <!-- Eliminate url and button bars if added to home screen -->
    <meta name="apple-mobile-web-app-capable" content="yes" />

    <!-- Choose how to handle the phone status bar -->
    <meta names="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <title>Aelios html5 clone</title>
    <link rel="stylesheet" type="text/css" href="css/style.css"/>
<!--    <script type="text/javascript" src="../live.js"></script>-->
    <script type="text/javascript" src="js/jquery-1.6.js"></script>
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
    <script type="text/javascript" src="js/jquery.loader3.js"></script>
<!--    <script>-->
<!--        $(document).ready(function(){-->
<!--            $.preLoadGUI(-->
<!--                {load: [-->
<!--                    ['img/black_linen.png', 'img'],-->
<!--                    ['img/icon.jpg', 'img'],-->
<!--                    ['js/jquery.transform.js', 'js'],-->
<!--                    ['js/audioManager.js', 'js'],-->
<!--                    ['js/rotator.js', 'js'],-->
<!--                    ['js/script.js', 'js'],-->
<!--                    []-->
<!--                ],-->
<!--                step : function(perc){-->
<!--                    perc = parseInt(perc/2);-->
<!--                    $('#installprogress').animate({width:perc + '%'},200);-->
<!--                },-->
<!--                complete : function(){-->
<!--                    $('html').addClass('loaded');-->
<!--                    $('#installprogress').animate({width:'100%'},1000);-->
<!--                    aelios.init();-->
<!--                }-->
<!--                }-->
<!--            );-->
<!--        });-->
<!--    </script>-->
    <script type="text/javascript" src="js/jquery.transform.js"></script>
    <script type="text/javascript" src="js/audioManager.js"></script>

    <script type="text/javascript" src="js/rotator.js"></script>
    <script type="text/javascript" src="js/script.js"></script>
    <script>
        $('document').ready(function(){
            $('html').addClass('loaded loaded2');
            aelios.init();
        })
    </script>
</head>
<body>
<div id="loader">
    <div id="appicon">
        <div id="installing">
            <div id="installprogress"></div>
        </div>
    </div>
</div>
<div id="mainmap" style="width:100%; height:100%">

</div>
<div id="template" style="display: none">

    <div id="dateTime">

            <div id='time'></div>
            <div id='date'>

            </div>
        
    </div>
    <div id="offline">
        Cannot establish internet connection!
    </div>
    <div id="marker">
        <div id="rotate" class="layer">
        </div>
        <div id="pointerCont">
            <div id="pointer"></div>
        </div>

        <div id="shutterCont" style="display: none">
            <div class="shutter shutter24">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter23">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter22">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter21">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter20">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter19">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter18">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter17">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter16">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter15">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter14">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter13">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter12">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter11">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter10">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter9">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter8">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter7">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter6">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter5">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter4">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter3">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter2">
                <div class="shutterInner"></div>
            </div>
            <div class="shutter shutter1">
                <div class="shutterInner"></div>
            </div>
        </div>
        <div id="hand"></div>
        <div id="dayshand"></div>
        <div id="hours" class="layer">
            <div id="today"></div>
            <div id="tommorow"></div>
            <canvas class="dayLightCanvas" width="364" height="364"></canvas>
            <canvas class="timeCanvas" width="279" height="279"></canvas>
        </div>
        <div id="days" class="layer">
            <div id="thisweek"></div>
            <div id="nextweek"></div>
            <canvas class="dayLightCanvas" width="364" height="364"></canvas>
            <canvas class="timeCanvas" width="279" height="279"></canvas>
        </div>
        <div id="glass"></div>
        <div id="shadow"></div>
        <div id="boundingBox"></div>
    </div>
    <div id="weatherCont">
        <div class="wicon night thunders">
            <div class="wiconInner"></div>
        </div>
        <div class="wicon night rain">
            <div class="wiconInner"></div>
        </div>
        <div class="wicon night showers">
            <div class="wiconInner"></div>
        </div>
        <div class="wicon night mist">
            <div class="wiconInner"></div>
        </div>
        <div class="wicon day snowrain">
            <div class="wiconInner"></div>
        </div>
        <div class="wicon day rain">
            <div class="wiconInner"></div>
        </div>
        <div class="wicon day snow">
            <div class="wiconInner "></div>
        </div>
        <div class="wicon day">
            <div class="wiconInner day"></div>
        </div>
    </div>
    <div id="overlay">
        <canvas id="overlayCanvas" width="100%" height="100%"></canvas>
    </div>
    <div id="title">
        <div id="titleCont">
            <div id='location'>Somewhere...</div>
            <div id='country'>World</div>
            <input type="text" id="searchInput" placeholder="Search"/>
        </div>
    </div>
    <div id="mylocation"></div>
    <div id="search"></div>
</div>
<audio src="sounds/click.wav" id="clickSound" preload="auto"></audio>
<audio src="sounds/btn.wav" id="btnSound" preload="auto"></audio>
</body>
</html>