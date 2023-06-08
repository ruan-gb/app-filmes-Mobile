import React from "react";
import { Feather } from "@expo/vector-icons";
import { BackButton, Name } from "./styles";
import { WebView } from "react-native-webview";

function ModalLink({ link, title, closeModal }) {
  return (
    <React.Fragment>
      <BackButton onPress={closeModal}>
        <Feather name="x" size={35} color="#FFF" />
        <Name numerOfLines={1}>{title}</Name>
      </BackButton>
      <WebView source={{ uri: link }} />
    </React.Fragment>
  );
}
export default ModalLink;
