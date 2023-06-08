import React, { useState, useEffect } from "react";
import API_FILMES, { key } from "../../services/api";
import Header from "../../components/Header";
import { Feather } from "@expo/vector-icons";
import SliderItem from "../../components/SliderItem";
import { ScrollView, ActivityIndicator } from "react-native";
import { getListMovies, randomBanner } from "../../utils/movie";
import { useNavigation } from "@react-navigation/native";
import {
  Container,
  SearchContainer,
  Input,
  SearchButton,
  Title,
  BannerButton,
  Banner,
  SliderMovie,
} from "./styles";

function Home() {
  const [nowMovies, setNowMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [input, setInput] = useState("");
  const [bannerMovies, setBannerMovies] = useState({});
  const [loading, setLoanding] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const ac = new AbortController();
    let isActive = true;

    async function getMovies() {
      const [nowData, popularData, topData] = await Promise.all([
        API_FILMES.get("/movie/now_playing", {
          params: {
            api_key: key,
            language: "pt-BR",
            page: 1,
          },
        }),
        API_FILMES.get("/movie/popular", {
          params: {
            api_key: key,
            language: "pt-BR",
            page: 1,
          },
        }),
        API_FILMES.get("/movie/top_rated", {
          params: {
            api_key: key,
            language: "pt-BR",
            page: 1,
          },
        }),
      ]);

      if (isActive) {
        const nowList = getListMovies(10, nowData.data.results);
        const popularList = getListMovies(10, popularData.data.results);
        const topList = getListMovies(10, topData.data.results);

        setBannerMovies(nowData.data.results[randomBanner(nowData.data.results)])
        setNowMovies(nowList);
        setPopularMovies(popularList);
        setTopMovies(topList);
        setLoanding(false);
      }
    }
    getMovies();
    return () => {
      isActive = false;
      ac.abort();
    };
  }, []);

  function navigateDetailsPage(item) {
    navigation.navigate('Detail', {id: item.id})
  }

  function handleSearchMovie() {
    if(input === "") return;

    navigation.navigate('Search', {name: input})
    setInput('');
  }
  

  if (loading) {
    return (
      <Container>
        <ActivityIndicator size="large" color={"#fff"} />
      </Container>
    );
  }

  return (
    <Container>
      <Header title="Cine Mania" />
      <SearchContainer>
        <Input 
        placeholder="Digite seu filme" 
        placeholderTextColor="#ddd"
        value={input}
        onChangeText={(text) => setInput(text)}
        />
        <SearchButton onPress={ handleSearchMovie }>
          <Feather name="search" size={30} color={"#FFF"} />
        </SearchButton>
      </SearchContainer>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Title>Em cartaz</Title>
        <BannerButton activeOpacity={0.9} onPress={() => navigateDetailsPage(bannerMovies)}>
          <Banner
            resizeMethod="resize"
            source={{
              uri: `https://image.tmdb.org/t/p/original/${bannerMovies.poster_path}`,
            }}
          />
        </BannerButton>

        <SliderMovie
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={nowMovies}
          renderItem={({ item }) => <SliderItem data={item}  navigatePage={() => navigateDetailsPage(item)}/>}
          keyExtractor={(item) => String(item.id)}
        />

        <Title>Populares</Title>
        <SliderMovie
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={popularMovies}
          renderItem={({ item }) => <SliderItem data={item} navigatePage={() => navigateDetailsPage(item)}/>}
          keyExtractor={(item) => String(item.id)}
        />

        <Title>Mais votados</Title>
        <SliderMovie
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={topMovies}
          renderItem={({ item }) => <SliderItem data={item}  navigatePage={() => navigateDetailsPage(item)}/>}
          keyExtractor={(item) => String(item.id)}
        />
      </ScrollView>
    </Container>
  );
}

export default Home;
