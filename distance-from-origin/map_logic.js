var map;
var homeAddress;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 29.760, lng: 95.369 },
        zoom: 15,
        // disableDefaultUI: true,
        // gestureHandling: 'none',
        // zoomControl: false
    });

    var bounds = new google.maps.LatLngBounds();
    var geocoder = new google.maps.Geocoder();
    var markers = [];
    var employees = [];
    var closestEmplyoyeesContent = '<div style="font-size:16px">';
    var centerMarker;

    var oReq = new XMLHttpRequest();
    oReq.onload = function() {
        var dbAdresses = JSON.parse(this.responseText);
        // console.log(dbAdresses);

        startLocation = new Promise(function(resolve, reject) {
                geocoder.geocode({
                    'address': JSON.stringify(dbAdresses[0].address)
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        // console.log(results);
                        var marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                        });
                        centerMarker = marker;
                        bounds.extend(marker.position);
                        markers.push(marker);
                        resolve([results[0]]);
                    } else {
                        reject(console.log("Geocode was not successful for the following reason: " + status));
                    }
                });
            })
            .then(function(centerPosition) {
                // console.log(centerPosition);
                var locationPromises = [];
                dbAdresses.forEach(function(e, i) {
                    if (i !== 0) {
                        locationPromises.push(new Promise(function(resolve, reject) {
                            geocoder.geocode({
                                'address': JSON.stringify(e.address)
                            }, function(results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {
                                    // console.log(results);
                                    var marker = new google.maps.Marker({
                                        map: map,
                                        position: results[0].geometry.location
                                    });

                                    nameWindow = new google.maps.InfoWindow({
                                        content: dbAdresses[i].name,
                                        position: marker.position
                                    });
                                    nameWindow.open(map);

                                    bounds.extend(marker.position);
                                    markers.push(marker);
                                    var currentDistance = (google.maps.geometry.spherical.computeDistanceBetween(centerMarker.position, results[0].geometry.location) / 1609.344);

                                    var person = {
                                        'name': e.name,
                                        'location': results[0].formatted_address,
                                        'distance': currentDistance
                                    };
                                    employees.push(person);
                                    resolve([results[0]]);
                                } else {
                                    reject(console.log("Geocode was not successful for the following reason: " + status));
                                }
                            });
                        }));
                    }
                });

                Promise.all(locationPromises)
                    .then(function(locationsFound) {
                        var infoWindow;
                        // console.log(locationsFound);
                        // console.log(centerMarker.position.toString());
                        employees.sort((a, b) => a.distance - b.distance);
                        // console.log(employees);

                        closestEmplyoyeesContent += 'The closest people to ' + dbAdresses[0].name + ' are: <ol><li>' + employees[0].name + ': ' + employees[0].location + ' ' + employees[0].distance.toFixed(2) + ' miles</li><li>' + employees[1].name + ': ' + employees[1].location + ' ' + employees[1].distance.toFixed(2) + ' miles</li><li>' + employees[2].name + ': ' + employees[2].location + ' ' + employees[2].distance.toFixed(2) + ' miles</li></ol></div>';
                        // console.log(employees);

                        infoWindow = new google.maps.InfoWindow({
                            content: closestEmplyoyeesContent,
                            position: centerMarker.position,
                            maxWidth: 700
                        });
                        infoWindow.open(map);
                        map.fitBounds(bounds);
                    })
                    .catch(function(e) { console.log(e); });
            });
    };
    oReq.open("get", "db.php", true);
    oReq.send();
}