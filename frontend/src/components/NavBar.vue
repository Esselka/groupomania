<!-- Barre de navigation pour la page principale et les pages d'un seul post -->

<template>
  <header class="mb-1 mb-md-3">

    <nav class="navbar navbar bg-warning navbar-expand-sm rounded d-flex justify-content-between">
      <!-- Logo Groupomania -->
      <h1 class="col-lg-3 col-md-4 col-5 navbar-brand w-25">
        <router-link to="/MainPage">
        <img class="img-fluid" alt="Groupomania" src="../assets/logo-black.png" role="link" />
        </router-link>
      </h1>
      <!-- Fin -->
      <!-- Bouton de création de nouveau post -->
      <router-link class="btn-primary rounded p-2 font-weight-bold offset-lg-4 offset-md-2 col-md-3 col-4 col-lg-2" to="/CreatePost" tag="button">+ Créer post</router-link>
      <!-- Fin -->
    <button class="navbar-toggler navbar-light" type="button" data-toggle="collapse" data-target="#navbar-list" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse col-lg-1 col-md-2" id="navbar-list">
      <ul class="navbar-nav">
          <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <img :src="avatarUrl" width="40" height="40" class="rounded-circle">
          </a>
          <div class="dropdown-menu text-center" aria-labelledby="navbarDropdownMenuLink">
              <router-link class="dropdown-item" :to="{ name: 'Profile', params: {userID: userID } }">Mon profil</router-link>
              <router-link class="dropdown-item" to="/">Se déconnecter</router-link>
          </div>
        </li>   
      </ul>
    </div>
    </nav>
  </header>
</template>

<script>
import jwt_decode from "jwt-decode";

export default {
  name: "NavBar",
  data() {
  return {
    avatarUrl: "",
    userID: "",
  }
  },
  methods: {
    getProfilePicture() {
      this.$axios
      .get("/users/avatar")
      .then((data) => {
        this.avatarUrl = data.data[0].avatar_url;
      })
      .catch((err) => {
        if(err.response.status == 404) {
          // S'il y a une erreur de récupération de l'avatar, utiliser celui par défaut
          this.avatarUrl = "http://localhost:3000/images/defaultPic.png";
        }
      });
    },
    getJwtUserID() {
      const token = sessionStorage.getItem('token');
      const decoded = jwt_decode(token);
      this.userID = decoded.userID;
    }
  },
  mounted() {
    // Chargement de l'URL de l'avatar avant affichage de la page
    this.getProfilePicture();
    // Récupération du userID pour affichage du profil de l'utilisateur
    this.getJwtUserID();
    }
  }
</script>