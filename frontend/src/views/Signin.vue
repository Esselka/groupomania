<template>
  <div class="container-fluid">
    <SigninPage />
    <!-- Formulaire pour se connecter -->
    <form onsubmit="return false">
      <SigninPageForm formPlaceholder="Se connecter" v-on:data-sent="updateData" v-on:request-sent="login">
        <template v-slot:messageError>{{ message }}</template>
      </SigninPageForm>
    </form>
  </div>
</template>

<script>
import SigninPage from "@/components/SigninPage.vue";
import SigninPageForm from "@/components/SigninPageForm.vue";

export default {
  name: "Signin",
  components: {
    LoginPage,
    LoginPageForm,
  },
  data: () => {
    return {
      email: "",
      password: "",
      message: null, // Message d'erreur
    };
  },
  methods: {
    updateData(data) {
      // Stock les infos de connexion
      this.email = data.email;
      this.password = data.password;
    },
    login() {
      // Connecte l'utilisateur
      this.$axios
        .post("users/signin", this.$data)
        .then((data) => {
          sessionStorage.setItem("token", data.data.token);
          this.$axios.defaults.headers.common["Authorization"] =
            "Bearer " + data.data.token;
          this.$router.push("Feed");
        })
        .catch((e) => {
          if (e.response.status === 401) {
            this.message = "L'adresse email et le mot de passe que vous avez entrés ne correspondent pas à ceux présents dans nos fichiers. Veuillez vérifier et réessayer.";
          }
          if (e.response.status === 500) {
            this.message = "Une erreur est survenue sur le serveur, veuillez réessayer plus tard.";
          }
          sessionStorage.removeItem("token");
        });
    },
  },
  mounted() {
    // A la déconnexion : supprime le token et définit le titre de la page
    sessionStorage.removeItem("token");
    delete this.$axios.defaults.headers.common["Authorization"];
    document.title = "Groupomania | Se connecter";
  },
};
</script>
