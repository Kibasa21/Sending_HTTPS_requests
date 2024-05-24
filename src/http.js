export async function fetchAvailablePlaces() {
    const response = await fetch('http://localhost:3000/places');
    const resData = await response.json();

    if (!response.ok) {
        throw new Error('Failed to fetch places.'); //joga um erro caso não consigamos dar fetch
    }

    return resData.places;
}

export async function fetchUserPlaces() {
    const response = await fetch('http://localhost:3000/user-places');
    const resData = await response.json();

    if (!response.ok) {
        throw new Error('Failed to fetch user places.'); //joga um erro caso não consigamos dar fetch
    }

    return resData.places;
}

export async function updateUserPlaces(places){
    const response = await fetch('http://localhost:3000/user-places', {
        method: 'PUT', //É necesário fazer isso porque o padrão do fetch é GET, como queremos por dados nesse caso, mudamos para PUT
        body: JSON.stringify({places: places}), //isso dirá que dado deve ser posto naquele banco de dados, mas ele deve ser um JSON.
        headers: {
            'content-type': 'application/json' //Apenas para avisar ao backend que o formato do dado posto vai ser JSON
        }
    });

    const resData = await response.json();

    if(!response.ok){
        throw new Error('Failed to update user data.');
    }

    return resData.message; //um objeto com messagem guardada nele
}