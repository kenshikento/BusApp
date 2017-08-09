var link = 'http://countdown.api.tfl.gov.uk/interfaces/ura/instant_V1?';
var rList = 'StopPointName,StopID,Towards,StopPointIndicator,StopPointState,Latitude,Longitude,VisitNumber,LineID,LineName,DirectionID,DestinationName,VehicleID,TripID,RegistrationNumber,EstimatedTime,ExpireTime';
var now = new Date();
var buses = [];

function getBus(){
	var line = document.getElementById("line");
	var request = new XMLHttpRequest();
	var txt = new String("");
	request.open('GET', link + 'LineName=' + line.value + '&ReturnList=' + rList, false);

	request.send(null);
	txt = request.responseText;
	var arr = [];
	var quote = false;  // true means we're inside a quoted field

	// iterate over each character, keep track of current row and column (of the returned array)
	for (var row = col = c = 0; c < txt.length; c++) {
		var cc = txt[c], nc = txt[c+1];        // current character, next character
		arr[row] = arr[row] || [];             // create a new row if necessary
		arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary


		if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

		// If it's just one quotation mark, begin/end quoted field
		if (cc == '"') { quote = !quote; continue; }

		// If it's a comma and we're not in a quoted field, move on to the next column
		if (cc == ',' && !quote) { ++col; continue; }

		// If it's a newline and we're not in a quoted field, move on to the next
		// row and move to column 0 of that new row
		if (cc == '\n' && !quote) { ++row; col = 0; continue; }

		// Otherwise, append the current character to the current column
		arr[row][col] += cc;
	}  // end of the loop

	var infowindow = new google.maps.InfoWindow();
	var marker, i, myLatlng;
	for (i = 1; i < arr.length ; i++) {	  // arr.length is all the info
		var spName = arr[i][1],
		 sid = arr[i][2],
		 towards = arr[i][3],
		 spIndicator = arr[i][4],
		 spState = arr[i][5],
		 lat = arr[i][6],
		 lon = arr[i][7],
		 visitNumber = arr[i][8],
		 destination = arr[i][12],
		 estTime = arr[i][16];

				estTime = (estTime - now.getTime())/(1000*60);
				estTime = Math.floor(estTime);
				myLatlng = new google.maps.LatLng(lat,lon);	//

					marker = new google.maps.Marker({
					position: myLatlng,
					map: map,
					});


		// gathers the information for the info window which it later is outputted
		var contentString = spName + " (" + spIndicator + ") <br> Buses towards:" + towards + "<br>Next " + line.value + " towards " + destination + " in: " + estTime + " Minute(s)";
		var infowindow = new google.maps.InfoWindow(); // creates new instance of infow window
		google.maps.event.addListener(marker,'click', (function(marker,contentString,infowindow){ // when the user changes the the route it output info window ie content string
				return function() {
					infowindow.setContent(contentString);
					infowindow.open(map,marker);
							};
									})(marker,contentString,infowindow));

				buses.push(marker); // array pushes the bus which is collected from marker then pushed into bus


	}
		
}

// Sets the map on all markers in the array.
function setAllMap(map) {
  for (var j = 0; j < buses.length; j++) {
    buses[j].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setAllMap(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  buses = [];
}
