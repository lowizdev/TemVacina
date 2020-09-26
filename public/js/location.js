function getLocation(showCB){
    if(navigator.geolocation){
    
        navigator.geolocation.getCurrentPosition(showCB);
    
    }else{
        alert("Error!"); //TODO: ENHANCE THIS
    }
}

function showPosition(position){
    let lat = position.coords.latitude;
    let long = position.coords.longitude;

    console.log(lat + " " + long);
}

getLocation(showPosition);