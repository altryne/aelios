<!doctype html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Prevent scaling -->
    <meta name="viewport" content = "user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

    <!-- Eliminate url and button bars if added to home screen -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="description" content="Aelios html5 clone">
   	<meta name="author" content="Alex Wolkov">

    <meta property="og:title" content="title" />
    <meta property="og:description" content="description" />
    <meta property="og:image" content="thumbnail_image" />
    <meta property="og:image:url" content="http://alexw.me/aelios/img/preview.jpg" />

    <meta itemprop="name" content="html5 aelios clone">
    <meta itemprop="description" content="See this gorgeous html5 aelios clone, pushing web boundaries">
    <meta itemprop="image" content="http://alexw.me/aelios/img/preview.jpg">
    <link rel="image_src" href="http://alexw.me/aelios/img/preview.jpg" />

    <!-- Choose how to handle the phone status bar -->
    <meta names="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <title>Aelios html5 clone</title>
    <link rel="stylesheet" type="text/css" href="css/style.css"/>
    <link rel="stylesheet" type="text/css" href="css/avgrund.css"/>
<!--    <script type="text/javascript" src="../live.js"></script>-->
    <script type="text/javascript" src="js/jquery-1.6.js"></script>
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
<!--    <script type="text/javascript" src="js/jquery.loader3.js"></script>-->
    <script type="text/javascript" src="js/plugins-ck.js"></script>
    <script>
        $(document).ready(function(){
            $.preLoadGUI(
                {load: [
                    ['img/black_linen.png', 'img'],
                    ['img/icon.jpg', 'img'],
                    ['js/jquery.transform.js', 'js'],
                    ['js/audioManager.js', 'js'],
                    ['js/rotator.js', 'js'],
                    ['js/script.js', 'js'],
                    []
                ],
                step : function(perc){
                    perc = parseInt(perc/2);
                    $('#installprogress').animate({width:perc + '%'},200);
                },
                complete : function(){
                    $('html').addClass('loaded');
                    $('#installprogress').animate({width:'100%'},1000);
                    aelios.init();
                }
                }
            );
        });

    </script>
<!--    <script type="text/javascript" src="js/jquery.transform.js"></script>-->
<!--    <script type="text/javascript" src="js/audioManager.js"></script>-->

<!--    <script type="text/javascript" src="js/rotator.js"></script>-->
    <script type="text/javascript" src="js/script-ck.js"></script>
<!--    <script type="text/javascript" src="js/avgrund.js"></script>-->
    <script>
        $('document').ready(function(){
//            $('html').addClass('loaded loaded2');
//            aelios.init();
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
<aside id="default-popup" class="avgrund-popup">
    <a href="https://github.com/altryne/aelios"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png" alt="Fork me on GitHub"></a>
    <h2>Aelios weather html5 clone</h2>

    <p>
        This is a html5 clone of the awesome ipad app "aelios weather".
        <br>Check it out <a href="http://aeliosapp.com">here</a>
        </p>
    <p>
        I'm releasing this almost a year ago, after it sat lonely on my HD and collected dust.
        <br>
        I instantly fell in love with aelios idea and execution, and I wanted to see if it can be re-created with html5 technologies.
        Many of the functionality is still missing, there's no "week view" and the weather while almost working is a dud.
        <br>
        Fork me on github and help me out, we can make this project a beauty
    </p>

    <p>
        Features :
    <ul>
        <li>Smart location selector - locks to the most highly populated location</li>
        <li>24 hour virtual watch - showing midnight and noon times, featuring day and nighttime indicators</li>
        <li>Rotation dial - turn the ring to see the shutter effect</li>
        <li>Weather report (dummy) - shows the weather for each timeframe once clicked on location</li>
    </ul>
    Credits :
    <ul>
        <li>Graphics, Coding - me (alex wolkov) , <a href="http://twitter.com/altryne">@altryne</a></li>
        <li>Jilion - creator of aelios, icon, and idea - awesome job guys, you are my heroes</li>
        <li><a href="http://cubiq.org/rotating-wheel-for-your-iphone-webapps">Rotating control</a>- <a href="http://twitter.com/cubiq">@cubiq</a></li>
        <li>Avgrund - @hakimel</li>
    </ul>
    </p>
    <div id="fb-root"></div>
    <ul class="social_buttons" style="position: absolute;">
    	  <li>
              <div class="fb-like" data-href="http://alexw.me/aelios" data-send="false" data-layout="button_count" data-width="200" data-show-faces="false"></div>
          </li>
    	  <li>
    	    <a href="http://twitter.com/share" data-related="altryne" data-url="http://alexw.me/aelios" data-via="altryne"
    	      data-text="Gorgeous Aelios ipad app html5 clone"
    	      class="twitter-share-button">Tweet</a>
    	  </li>
        <li>
            <a href="https://twitter.com/altryne" class="twitter-follow-button" data-show-count="false" data-dnt="true">Follow @altryne</a>
        </li>
    	</ul>
</aside>

<div class="avgrund-contents">
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
    <div id="title" title="click here to see a weather report for this location">
        <div id="titleCont">
            <div id='location'>Somewhere...</div>
            <div id='country'>World</div>
            <input type="text" id="searchInput" placeholder="Search"/>
        </div>
    </div>
    <div id="mylocation" title="click here to go to your gps location"></div>
    <div id="search" title="click here to search the world"></div>
    <div id="info" title="Click here to see info">i</div>
</div>
</div>
<audio src="sounds/click.wav" id="clickSound" preload="auto"></audio>
<audio src="sounds/btn.wav" id="btnSound" preload="auto"></audio>


<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-7437527-6']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
</body>
</html>