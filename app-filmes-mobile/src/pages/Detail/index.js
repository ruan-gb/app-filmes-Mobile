import React, { useState, useEffect } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import Stars from "react-native-stars";
import Genres from "../../components/Genres";
import ModalLink from "../../components/ModalLink";
import { useNavigation, useRoute } from "@react-navigation/native";
import API_FILMES, { key } from "../../services/api";
import { ScrollView, Modal } from "react-native";
import { saveMovie, hasMovie, deleteMovie } from '../../utils/storage'
import {
  Container,
  Header,
  HeaderButton,
  Banner,
  ButtonLink,
  Title,
  ContentArea,
  Rate,
  ListGenres,
  Description,
} from "./styles";

function Detail() {
  const navigation = useNavigation();
  const route = useRoute();
  const [movie, setMovie] = useState({});
  const [openLink, setOpenLink] = useState(false);
  const [favoritedMovie, setFavoritedMovie] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function getMovie() {
        const response = await API_FILMES.get(`/movie/${route.params?.id}`, {
            params: {
                api_key: key,
                language: 'pt-BR'
            }
        })
            .catch((err) => {
                console.error(err)
            })

        if (isActive) {
            setMovie(response.data);
            const isFavorite = await hasMovie(response.data);
            setFavoritedMovie(isFavorite);

        }
    }
    if (isActive) {
        getMovie();
    }

    return () => {
        isActive = false;
    }

}, []);

  async function favoriteMovie(movie) {

    if(favoritedMovie){
        await deleteMovie(movie.id);
        setFavoritedMovie(false);
        alert('Filme removido da sua lista');
    }else{
        await saveMovie('@primereact', movie);
        setFavoritedMovie(true);
        alert('Filme adicionado da sua lista');
    }
}

  return (
    <Container>
      <Header>
        <HeaderButton activeOpacity={0.7} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={28} color="#FFF" />
        </HeaderButton>
        <HeaderButton onPress={() => favoriteMovie(movie)}>
          {favoritedMovie ? (
            <Ionicons name="bookmark" size={28} color="#FFF" />
          ) : (
            <Ionicons name="bookmark-outline" size={28} color="#FFF" />
          )}
        </HeaderButton>
      </Header>
      <Banner
        resizeMode="stretch"
        source={{
          uri: `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
        }}
      />

      <ButtonLink onPress={() => setOpenLink(true)}>
        <Feather name="link" size={24} color={"#FFF"} />
      </ButtonLink>
      <Title numberOfLines={1}>{movie.title}</Title>

      <ContentArea>
        <Stars
          default={movie.vote_average}
          count={10}
          half={true}
          starSize={20}
          fullStar={<Ionicons name="md-star" size={24} color="#E7A74e" />}
          emptyStar={
            <Ionicons name="md-star-outline" size={24} color="#E7A74e" />
          }
          halfStar={<Ionicons name="md-star-half" size={24} color="#E7A74e" />}
          disable={true}
        />
        <Rate>{movie.vote_average}/10</Rate>
      </ContentArea>

      <ListGenres
        data={movie?.genres}
        horizontal={true}
        showsHorizontalScrollIndicator={true}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <Genres data={item} />}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Title>Descrição</Title>
        <Description>{movie?.overview}</Description>
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={openLink}>
        <ModalLink
          link={movie?.homepage}
          title={movie?.title}
          closeModal={() => setOpenLink(false)}
        />
      </Modal>
    </Container>
  );
}

export default Detail;
