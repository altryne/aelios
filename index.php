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
    <script type="text/javascript" src="js/jquery.transform.js"></script>
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
    <script type="text/javascript" src="js/rotator.js"></script>
    <script type="text/javascript" src="js/script.js"></script>
</head>
<body>
<div id="mainmap" style="width:100%; height:100%">

</div>
<div id="template">

    <div id="dateTime">

            <div id='time'></div>
            <div id='date'>

            </div>
        
    </div>
    <div id="offline">
        Cannot establish internet connection!
    </div>
    <div id="marker">
        <div id="pointerCont">
            <div id="pointer"></div>
        </div>
<!--        <div id="dot"></div>-->
        <div id="rotate"></div>
        <canvas id="nightCanvas" width="364" height="364"></canvas>
        <canvas id="dayLightCanvas" width="364" height="364"></canvas>
        <div id="glass"></div>
        <div id="shadow"></div>
        <div id="boundingBox"></div>
    </div>
    <div id="overlay"></div>
    <div id="title">
        <div class="titleCont">
            <div id='location'>Somewhere...</div>
            <div id='country'>World</div>
            <input type="text" id="searchInput" placeholder="Search"/>
        </div>
    </div>
    <div id="mylocation"></div>
    <div id="search"></div>
</div>
</body>
</html>