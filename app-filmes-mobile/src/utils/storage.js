import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getMoviesSave(key) {
    const myMovies = await AsyncStorage.getItem(key);
    let moviesSave = JSON.parse(myMovies) || [];
    return moviesSave;
}

export async function saveMovie(key, newMovie) {
    try {
      let moviesStored = await getMoviesSave(key);
  
      const hasMovie = moviesStored.some((item) => item.id === newMovie.id);
  
      if (hasMovie) {
        console.log("ESSE FILME JÁ EXISTE NA SUA LISTA");
        return;
      }
  
      moviesStored.push(newMovie);
      await AsyncStorage.setItem(key, JSON.stringify(moviesStored));
      console.log("FILME SALVO");
    } catch (error) {
      console.log("Erro ao salvar filme:", error);
    }
  }

export async function deleteMovie(id) {
    let moviesStored = await getMoviesSave('@primereact');

    let myMovies = moviesStored.filter(item => {
        return (item.id !== id)
    })

    await AsyncStorage.setItem('@primereact', JSON.stringify(myMovies));
    console.log('FILME DELETADO');
    return myMovies;
}

export async function hasMovie(movie) {
    let moviesStored = await getMoviesSave('@primereact');

    const hasMovie = moviesStored.find(item => item.id === movie.id)

    if (hasMovie) {
        return true;
    }

    return false;
}
