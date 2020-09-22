<!-- Page principale qui contient tous les posts, la création de post et les catégories-->

<template>
  <div>
    <!-- Avertis si l'utilisateur n'est pas connecté -->
    <InfoMessage v-if="!connected" :alertType="alert.type" :alertMessage="alert.message" />
    <!-- Fin -->
    <div v-else>
      <!-- Barre de navigation -->
      <NavBar />
      <!-- Fin -->
    </div>
  </div>
</template>

<script>
import InfoMessage from "../components/InfoMessage";
import NavBar from "../components/NavBar";

export default {
  name: "MainPage",
  components: {
    InfoMessage,
    NavBar,
  },
  data() {
    return {
      connected: true, // Si l'utilisateur est connecté = true
      alert: {
        active: false, // L'alerte n'est pas visible par défaut
        type: "",
        message: "" // Message qui donne plus de précision sur l'alerte
      }
    }
  },
}
</script>