export const getCurrentLocation = () => {
    let location =[]
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // setUserLocationError(null);
                // setPosition([position.coords.latitude, position.coords.longitude]);
                location[0]=position.coords.latitude;
                location[1]=position.coords.longitude
                return location
            },
            (error) => {
                // setUserLocationError(error.message);
                console.error("Error getting user location:", error);
                location =[]
                return location
            }
        );
    } else {
        // setUserLocationError("Geolocation is not supported by this browser.");
        console.error("Geolocation is not supported by this browser.");
        location =[];
        return location

    }
    return location
};

