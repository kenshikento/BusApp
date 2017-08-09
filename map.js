var map = L.map('map');
	
L.tileLayer('http://{s}.tile.cloudmade.com/70FC9FDC40F94BBABA7B570C62ECF53A/997/256/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
}).addTo(map);

function onLocationFound(e) {
	var radius = e.accuracy / 2;

	L.marker(e.latlng).addTo(map)
	.bindPopup("You are within " + radius + " meters from this point").openPopup();
	
	L.circle(e.latlng, radius).addTo(map);
}
	
function onLocationError(e) {
	alert(e.message);
	//map = L.map('map').setView([51.505, -0.09], 13);
}
	
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
	
map.locate({setView: true, maxZoom: 16});