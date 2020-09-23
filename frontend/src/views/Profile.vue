<!-- Page de gestion du profil utilisateur -->

<template>
  <div class="container-fluid">
    <!-- Informe si l'utilisateur n'est pas connecté -->
    <InfoMessage v-if="!connected" :alertType="alert.type" :alertMessage="alert.message" />
    <!-- Fin -->
    <div v-else>
      <!-- Barre de navigation -->
      <NavBar />
      <!-- Fin -->
      <!-- Formulaire pour mettre à jour le profil de l'utilisateur -->
      <section class="border-bottom">
        <h2
          class="h6 font-weight-bold"
          data-toggle="collapse"
          href="#collapseUpdateProfile"
          role="button"
          aria-expanded="false"
          aria-controls="collapseUpdateProfile"
        >Editer votre profil</h2>
        <form class="collapse" id="collapseUpdateProfile">
          <div class="custom-file mb-3">
            <input
              name="image"
              id="imageLabel"
              type="file"
              class="custom-file-input"
              accept="image/x-png,image/gif,image/jpeg"
              v-on:change="updateAvatar($event)"
            />
            <label class="custom-file-label" for="imageLabel">Choisir un avatar</label>
          </div>
          <div class="input-group mb-3">
            <input
              class="form-control"
              type="text"
              v-model="userDatas.username"
              name="username"
              aria-label="Modifier pseudonyme"
              aria-describedby="usernameInput"
            />
            <div class="input-group-append">
              <span class="input-group-text" id="usernameInput">Nom d'utilisateur</span>
            </div>
          </div>
          <div class="input-group mb-3">
            <input
              class="form-control"
              type="email"
              v-model="userDatas.email"
              name="email"
              aria-label="Modifier email"
              aria-describedby="emailInput"
            />
            <div class="input-group-append">
              <span class="input-group-text" id="emailInput">Email</span>
            </div>
          </div>
          <input
            class="form-control text-center mb-3"
            type="password"
            placeholder="Nouveau mot de passe"
            id="newPassword"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            aria-label="Nouveau mot de passe"
          />
          <div class="input-group">
            <input
              class="form-control text-center"
              type="password"
              placeholder="Mot de passe"
              id="password"
              aria-label="Mot de passe de confirmation"
            />
            <div class="input-group-append">
              <button
                type="submit"
                class="btn btn-success rounded"
                v-on:click.prevent="updateProfile"
              >Mettre à jour</button>
            </div>
          </div>
          <p class="text-danger mx-auto mt-3 font-weight-bold">{{ errorMessage }}</p>
        </form>
      </section>
      <!-- Fin -->

      <!-- Profil de l'utilsateur -->
      <section class="mt-5">
        <img
          :src="userDatas.avatar_url"
          class="card-img avatar rounded-circle mr-1"
          alt="Avatar de l'utilisateur"
        />
        <h2 class="mt-1">{{ fullName }}</h2>
        <p v-if="userDatas.username != null">Pseudo : {{ userDatas.username }}</p>
        <p>Total de vos posts : {{ userDatas.numberOfPosts }}</p>
        <p class="mt-4">{{ userDatas.dateInscription }}</p>
      </section>
      <!-- Fin -->

      <!-- Formulaire pour supprimer son compte -->
      <section class="mt-5 border-top">
        <h2
          class="mb-4 mt-3 text-danger font-weight-bold h6"
          data-toggle="collapse"
          href="#collapseDeleteProfile"
          role="button"
          aria-expanded="false"
          aria-controls="collapseDeleteProfile"
        >Supprimer votre compte</h2>
        <form class="collapse row" id="collapseDeleteProfile">
          <div class="d-flex col-md-4 mx-auto input-group">
            <input
              class="form-control mx-auto text-center col-6 col-md-8"
              type="password"
              placeholder="Mot de passe"
              id="confirmDeleteAccountPassword"
              aria-label="Mot de passe pour confirmer suppression compte"
            />
            <div class="input-group-append mx-auto mb-4 col-12">
              <button type="submit" class="btn btn-danger mt-3 mx-auto font-weight-bold rounded" v-on:click="deleteProfile">Suppression définitive</button>
            </div>
            <p class="text-danger mx-auto mt-3 font-weight-bold">{{ errorMessage }}</p>
          </div>
        </form>
      </section>
      <!-- Fin -->
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import InfoMessage from "../components/InfoMessage.vue";

export default {
  name: "Profile",
  components: {
    NavBar,
    InfoMessage
  },
  data: () => {
    return {
      connected: true, // Définit si l'utilisateur est connecté
      errorMessage: null,
      alert: {
        type: "",
        message: "",
      },
      userDatas: {}, // Stock les données de l'utilisateur
    };
  },
  computed: {
    fullName() {
      // Retourne le nom complet de l'utilisateur
      return `${this.userDatas.firstname} ${this.userDatas.lastname}`;
    },
  },
  methods: {
    // Gestion des erreurs
    createAlert(type, message) {
      const alert = this.$data.alert;
      this.connected = false;
      alert.type = type;
      alert.message = message;
    },
    getUserDatas() {
      // Récupère les infos de l'utilisateur
      this.$axios
        .get('users/myDatas')
        .then((response) => {
          this.userDatas = response.data[0];
        })
        .catch((err) => {
          if (err.response.status === 401) {
            this.createAlert("alert-danger mt-5", "Session expirée, veuillez vous reconnecter.");
            // Retour à la page de login 4s après que le message de session expirée se soit affiché
            setTimeout(() => {
              this.$router.push({ name: "Signin" });
            }, 4000);
          }
          if (err.response.status === 404) {
            this.createAlert("alert-warning mt-5", "Utilisateur non trouvé");
          }
          if (err.response.status === 500) {
            this.createAlert("alert-warning mt-5", "Erreur serveur !");
          }
        });
    },
    deleteProfile() {
      // Supprime le compte de l'utilisateur
      const password = document.getElementById("confirmDeleteAccountPassword").value;

      this.$axios
        .post('users/delete', { data: { password: password } })
        .then(() => {
          sessionStorage.removeItem("token");
          delete this.$axios.defaults.headers.common["Authorization"];
          this.$router.push({ name: "Signin" });
        })
        .catch((err) => {
          if (err.response.status === 401) {
            this.errorMessage = "Mot de passe incorrect !";
          }
        }); 
    }, 
    updateProfile() {
      const email = this.userDatas.email;
      const username = this.userDatas.username;
      const password = document.getElementById("password").value;
      const newPassword = document.getElementById("newPassword").value;
      let data;

      if (newPassword === "") {
        data = { email, username, password };
      } else {
        data = { email, username, password, newPassword };
        }
        this.$axios
        .put("users/modifyUser", data)
        .then((response) => {
          if (response.status === 200) {
            this.errorMessage = "Votre profil a été mis à jour !";
          }
          this.$router.go(); // Rechargement de la page
        })
        .catch((err) => {
          if (err.response.status === 401) {
            this.errorMessage = "Mot de passe incorrect !";
          }
          if (err.response.status === 404) {
            this.errorMessage = "Utilisateur inconnu !";
          }
          if (err.response.status === 500) {
            this.errorMessage = "Erreur serveur !";
          }
        });
    },
    updateAvatar(event) {
      const image = event.target.files[0];
      const formData = new FormData();
      formData.append("image", image);
      this.$axios
        .put("users/modifyAvatar", formData)
        .then(() => {
          this.getUserDatas(); // Rafraîchit l'url de l'avatar après mise à jour
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  mounted() {
    // Récupère les données de l'utilisateur et définit le titre de la page
    this.getUserDatas();
    document.title = "Groupomania | Mon profil";
  },
  watch: {
    // Actualisation de la page de profil en cas de clic sur "Mon profile"
    "$route.params.id": function () {
      this.getUserDatas();
    },
  },
};
</script>

<style scoped lang="scss">
.avatar {
  width: 10em;
  height: 10em;
  object-fit: cover;
}
</style>