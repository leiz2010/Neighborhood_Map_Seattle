// Get data from Foursqure as JSON format
function requestData(location){
    var request = requestUrlBuilder(location);
    $.getJSON(request, function(data){
        var places = data.response.venues;
        var temp = [];
        if(places.length < 20){
            temp = places;
        }
        else {
            for(var i=0; i<20; i++){
                temp.push(places[i]);
            }
        }
        placeViewModel.filter(temp);

    }).error(function(){
        // Display error message if request fails
        alert('Data could not be loaded');
    });
}

// Constructs requestUrl for Foursquere api call
function requestUrlBuilder(location){

    var clientId = 'NO0SWAUG0AGK3FCJEWS5G4YBCFRZJSL0OD3UXPLZA5UBOAGK';
    var clientSecret = 'MBPDJM4XQHD4SFBGICJ4QVO2K54LJEMSY1T1D5GIHEVMXSF2';
    var version = getVersion();
    var requestUrl = 'https://api.foursquare.com/v2/venues/search?'+
                        'll='+location[0]+','+location[1]+
                        '&client_id='+clientId+
                        '&client_secret='+clientSecret+
                        '&v='+version+
                        '&radius=300';
    return requestUrl;
}

// Helper function to build the version parameter for requestUrl
function getVersion(){
    var d = new Date();
    var year = String(d.getFullYear());
    var month = String(d.getMonth()+1);
    var date = String(d.getDate());
    if (month.length < 2){
        month = '0' + month;
    }
    if (date.length < 2){
        date = '0' + date;
    }
    return year + month + date;
}

// ViewModel
var PlaceViewModel = function(){
    var self = this;
    this.data = ko.observableArray();

    // Get data from the server
    this.getData = function(){
        // request date at Seattle area
        requestData([47.620505, -122.349267]);
    };

    // Filter the results
    this.filter = function(data){
        var keyword = getInput();
        var results = [];
        for (var i=0; i<data.length; i++){
            var name = data[i].name.toLowerCase();
            if (name.indexOf(keyword) != -1){
                results.push(data[i]);
            }
        }

        // Bind results to the data observableArray
        self.data(results);
        setMarkers(results);
    };

    // showInfo window when data observerableArray is clicked
    this.showInfo = function(place){
        var lat = place.location.lat;
        var lng = place.location.lng;

        // Compare marker and place's lat, lng if match show info
        for(var i=0; i<markers.length; i++){
            var latDiff = Math.abs(lat - markers[i].position.A);
            var lngDiff = Math.abs(lng - markers[i].position.F);
            if (latDiff < 0.00001 && lngDiff < 0.00001){
                google.maps.event.trigger(markers[i], "click");
            }
        }
    };

    // Helper function for getting the user input
    function getInput(){
        var keyword = $('#searchText').val();
        $('#searchText').val('');
        keyword = keyword.toLowerCase();
        return keyword;
    }
};

var placeViewModel = new PlaceViewModel();
ko.applyBindings(placeViewModel);
