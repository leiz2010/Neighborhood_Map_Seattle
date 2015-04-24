// Googe Map code
var map;
var markers = [];
var infowindow;

// Create a google map object
function initialize() {
    var seattle = new google.maps.LatLng(47.620505, -122.349267);
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: seattle,
        zoom: 18
    });
    requestData([47.620505, -122.349267]);
    infowindow = new google.maps.InfoWindow();
}

// Set markeers on google map
function setMarkers(places) {
    for (var i=0; i< markers.length; i++){
        markers[i].setMap(null);
    }

    for (var j= 0; j < places.length; j++) {
        createMarker(places[j]);
    }
}

// Create a marker object with a info window
function createMarker(place) {
    var lat = place.location.lat;
    var lng = place.location.lng;
    var location = new google.maps.LatLng(lat, lng);

    var marker = new google.maps.Marker({
        map: map,
        position: location,
        animation: google.maps.Animation.DROP
    });
    markers.push(marker);
    // Set the info window to display when clicked
    google.maps.event.addListener(marker, 'click', function() {
        map.setCenter(marker.position);
        infowindow.setContent(infoContentBuilder(place));
        infowindow.open(map, this);
    });
}

// Build content string for the info window
function infoContentBuilder(place){
    var name = place.name;
    var street = place.location.formattedAddress[0];
    var city = place.location.formattedAddress[1];
    var country = place.location.formattedAddress[2];
    // Check undefined for country
    if (country === undefined){
        country = '';
    }
    var contentURL = '';
    // Check undefined for url
    if (place.url === undefined){
        contentURL = '<p hidden>URL not available</p>';
    } else {
        contentURL = '<a href='+place.url+'>'+place.url+'</a>';
    }


    var style = 'style="line-height: 5%;"';

    var contentString = '<h5>'+name+'</h5>'+
                        '<p'+style+'>'+street+'</p>'+
                        '<p'+style+'>'+city+'</p>'+
                        '<p'+style+'>'+country+'</p>'+
                        contentURL;
    return contentString;
}

google.maps.event.addDomListener(window, 'load', initialize);
