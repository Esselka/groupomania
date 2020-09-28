<!-- Page de connexion -->

<template>
  <div class="container-fluid">
    <SigninPage />
    <!-- Formulaire pour se connecter -->
    <form onsubmit="return false">
      <SigninPageForm buttonConnectRegister="Se connecter" @data-sent="updateDataSignin" @request-sent="signin">
        <template v-slot:errorMessage>{{ message }}</template>
      </SigninPageForm>
    </form>
  </div>
</template>

<script>
import SigninPage from "../components/SigninPage.vue";
import SigninPageForm from "../components/SigninPageForm.vue";

export default {
  name: "Signin",
  components: {
    SigninPage,
    SigninPageForm,
  },
  data: () => {
    return {
      email: "",
      password: "",
      message: null, // Gestion des erreurs
    };
  },
  methods: {
    // Stock les infos de connexion
    updateDataSignin(data) {
      this.email = data.email;
      this.password = data.password;
    },
    // Connexion de l'utilisateur
    signin() {
      this.$axios
        .post("auth/signin", this.$data)
        .then((dataResponse) => {
          sessionStorage.setItem("token", dataResponse.data.token);
          this.$axios.defaults.headers.common["Authorization"] = "Bearer " + dataResponse.data.token;
          this.$router.push("MainPage");
        })
        .catch((err) => {
          if (err.response.status === 401) {
            this.message = "L'adresse email et le mot de passe que vous avez entré ne correspondent pas à ceux présents dans nos fichiers. Veuillez vérifier et réessayer.";
          }
          if (err.response.status === 500) {
            this.message = "Une erreur est survenue sur le serveur, veuillez réessayer plus tard.";
            setTimeout(() => {
              this.$router.go();
            }, 4000);
          }
          // Suppression du token en cas d'erreur
          sessionStorage.removeItem("token");
        });
    },
  },
  mounted() {
    // Au chargement de la page de connexion : supprime l'ancien token (s'il existe) et définit le titre de la page
    sessionStorage.removeItem("token");
    delete this.$axios.defaults.headers.common["Authorization"];
    document.title = "Groupomania | Se connecter";
  },
};
</script>
