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
    <script type="text/javascript" src="../live.js"></script>
    <script type="text/javascript" src="js/jquery-1.6.js"></script>
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
    <script type="text/javascript" src="js/script.js"></script>
</head>
<body>
<div id="mainmap" style="width:100%; height:100%">

</div>
<div id="template">
<div id="title">
    <div class="titleCont">
        <div id='location'></div>
        <div id='country'></div>
    </div>
</div>
<div id="dateTime">
    <div class="titleCont">
        <div id='time'></div>
        <div id='date'>

        </div>
    </div>
</div>
<div id="mylocation"></div>
<div id="search"></div>
<div id="marker">
    <canvas id="dayLightCanvas" width="320" height="320"></canvas>
    <div id="glass"></div>
</div>
    </div>
</body>
</html>