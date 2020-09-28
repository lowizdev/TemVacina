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

//getLocation(showPosition);

function storePosition(position){

    //TODO: CHECK IF COORDS ENABLED

    //TODO: MAYBE USE LOCALSTORAGE?
    let lat = position.coords.latitude;
    let long = position.coords.longitude;

    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = long;

}

getLocation(storePosition);