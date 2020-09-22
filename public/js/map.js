function initializeMap(id, userCoordinates){
    let mymap = L.map(id).setView(userCoordinates, 13);
    let OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);

    return mymap;
}

function addMarkers(renderer, map, coordinates){ //TODO: CHANGE NAME TO addCircleMarkers?

    coordinates.forEach(coordinate => {
        
        L.circleMarker(coordinate, {
            renderer: renderer
        }).addTo(map);

    });

}