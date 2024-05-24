import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Error from './components/Error.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { fetchUserPlaces, updateUserPlaces } from './http.js';

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [isFetching, setIsFetching] = useState(false); // quando fetchamos dados, geralmente há esses 3 states: loading, o dado em si e o error
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const places = await fetchUserPlaces();
        setUserPlaces(places);
      } catch(error) {
        setError({ message: error.message || 'Failed to fetch user places.' });
      }
      setIsFetching(false);
    }
    fetchPlaces();
  }, []);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => { //Optmistic updating: Adiciona a UI antes de adicionar no Backend
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      await updateUserPlaces([selectedPlace, ...userPlaces]);
    } catch (error) {
      setUserPlaces(userPlaces); //Se der erro, eu não quero enganar o usário, então quero que tudo volte a ser como era antes dele adicionar places
      setErrorUpdatingPlaces({ message: error.message || 'Failed to update places.' });
    }// se eu usar userPlaces vai ser o antigo porque ele só é atualizado quando for usado novamente

  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    try {
      await updateUserPlaces(userPlaces.filter(place => place.id !== selectedPlace.current.id));
    } catch (error) {
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({ message: error.message || 'Failed to delete place.' });
    }

    setModalIsOpen(false);
  }, [userPlaces]);

  function handleError() {
    setErrorUpdatingPlaces(null);
  }

  return (
    <>

      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && <Error title='An error occurred!' message={errorUpdatingPlaces.message} onConfirm={handleError} />}
      </Modal> {/* Precisei por uma condição para o erro pq embora o modal só apareça se existir erro, ele sempre está lá. Então o site procuraria o erro mas não existiria e daria erro */}

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <Error title='An error occurred!' message={error.message} />}
        {!error && <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          isLoading={isFetching}
          loadingText='Fetching your places...'
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
