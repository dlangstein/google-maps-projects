<!DOCTYPE html>
<html>

<head>
    <title>Simple Map</title>
    <meta name="viewport" content="initial-scale=1.0">
    <meta charset="utf-8">
    <style>
    /* Always set the map height explicitly to define the size of the div
    * element that contains the map. */
    #map {
        height: 100%;
    }

    /* Optional: Makes the sample page fill the window. */
    html,
    body {
        height: 100%;
        margin: 0;
        padding: 0;
    }

    input {
        font-size: xx-large;
        margin-top: 1%;
    }
</style>
</head>

<body>
    <div id="map"></div>
    <script src="map_logic.js" type="text/javascript"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAwwRdRfyVjycTtL6I64xaxUKlRwN-Vg8c&callback=initMap&libraries=geometry" async defer></script>
</body>

</html>