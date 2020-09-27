<!-- Page d'enregistrement de nouveau compte -->

<template>
  <div class="container-fluid">
    <SigninPage />
    <!-- Formulaire pour se connecter -->
    <form onsubmit="return false">
      <SignupPageForm v-on:data-sent="updateDataSignup" />
      <SigninPageForm
        buttonConnectRegister="S'inscrire"
        v-on:data-sent="updateDataSignin"
        v-on:request-sent="signup"
      >
        <template v-slot:passwordModel>Votre mot de passe doit avoir au moins : 1 majuscule, 1 minuscule et 1 chiffre<br>(Longueur : 8 caractères minimum et pas d'espace).</template>
        <template v-slot:errorMessage>{{ message }}</template>
      </SigninPageForm>
    </form>
    <!-- Fin -->
  </div>
</template>

<script>
import SigninPage from "@/components/SigninPage.vue";
import SigninPageForm from "@/components/SigninPageForm.vue";
import SignupPageForm from "@/components/SignupPageForm.vue";

export default {
  name: "Signup",
  components: {
    SigninPage,
    SigninPageForm,
    SignupPageForm,
  },
  data: () => {
    return {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      message: null // Gestion des erreurs
    };
  },
  methods: {
    updateDataSignup(data) {
      // Stock le prénom et nom
      this.firstname = data.firstname;
      this.lastname = data.lastname;
      this.username = data.username;
    },
    updateDataSignin(data) {
      // Stock l'email et le mot de passe
      this.email = data.email;
      this.password = data.password;
    },
    signup() {
      // Inscrit et connecte l'utilisateur
      this.$axios
        .post("auth/signup", this.$data)
        .then(() => {
          this.$axios.post("auth/signin", this.$data)
          .then((data) => {
            sessionStorage.setItem("token", data.data.token);
            this.$axios.defaults.headers.common["Authorization"] = "Bearer " + data.data.token;
            this.$router.push("MainPage");
          });
        })
        .catch((err) => {
          if (err.response.status === 500) {
            this.message = "Une erreur est survenue sur le serveur, veuillez réessayer plus tard.";
            setTimeout(() => {
              this.$router.go();
            }, 4000);
          }
          sessionStorage.removeItem("token");
        });
    },
  },
  mounted() {
    // Définit le titre de la page
    document.title = "Groupomania | S'enregistrer | ";
  },
};
</script>