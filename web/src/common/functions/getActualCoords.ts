
interface Coordinates {
    lat: number;
    lng: number;
}

const getActualCoords = () => {
    let actualCoords: Coordinates = {lat: 0, lng: 0}
    navigator.geolocation.getCurrentPosition(position => {
        const { coords } = position;
        actualCoords = {
            lat: coords.latitude,
            lng: coords.longitude
        }
    })
    return actualCoords;
}

export default getActualCoords;