<!-- Page de création d'un nouveau post -->

<template>
  <div>
      <!-- Barre de navigation -->
      <NavBar />
      <!-- Fin -->
    <form class="mt-5 mb-5" name="createPost">
      <!-- Titre du post -->
      <textarea
        name="title"
        class="form-control mb-3 text-center"
        cols="130"
        rows="1"
        maxlength="50"
        required
        placeholder="Titre de votre post (50 caractères max)"
        aria-label="Titre du post"
        v-model="title"
      ></textarea>
      <!-- Fin -->
      <!-- Sélection de l'image -->
      <div class="custom-file mb-5">
        <input
          name="image"
          type="file"
          class="custom-file-input"
          accept="image/x-png,image/gif,image/jpeg"
          required
          @change="setImage($event)"
        />
        <label class="custom-file-label text-sm-left text-md-center" for="image">Choisir une image (jpg, gif, png)</label>
      </div>
      <!-- Fin -->
      <!-- Bouton pour créer le nouveau post -->
      <button
        class="btn btn-primary font-weight-bold form-control text-center col-3 col-lg-1"
        type="submit"
        @click.prevent="createPost()"
      >Publier</button>
      <!-- Fin -->
    </form>
    <span class="alert alert-success font-weight-bold mb-5" v-if="postCreatedMessage"> {{ postCreatedMessage }}</span>
    <h4 class="font-weight-bold mt-5"><u>{{ title }}</u></h4>
    <div id="preview">
      <img v-if="previewImage" :src="previewImage" alt="Visualisation de l'image actuelle" />
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar";

export default {
  name: "CreatePost",
  components: {
    NavBar
  },
  data: () => {
    return {
      postCreatedMessage: "", // Message lors de la création d'un post
      previewImage: "", // Prévisualisation de l'image avant envoi
      alert: {
        type: "",
        message: "",
      },
      title: "", 
      image: ""
    };
  },
  methods: {
    // Gestion des erreurs
    createAlert(type, message) {
      // Gestion des alertes
      const alert = this.$data.alert;
      this.connected = false;
      alert.type = type;
      alert.message = message;
    },
    createPost() { 
      const validForm = document.getElementsByName("createPost")[0].checkValidity();
      if (validForm) {
        const formData = new FormData();
        formData.append("image", this.image);
        formData.append("title", this.title);
        this.$axios
        .post("posts/", formData)
        .then((response) => {
          if (response.status === 201) {
            this.postCreatedMessage = "Votre post a été créé avec succès !"
          }
          // Retour à la page principale 3s après que le message de succès de création du post se soit affiché
          setTimeout(() => {
            this.$router.push({ name: "MainPage" });
          }, 3000);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            this.createAlert("alert-danger mt-5", "Session expirée, veuillez vous reconnecter.");
            // Retour à la page de login 4s après que le message de session expirée se soit affiché
            setTimeout(() => {
              this.$router.push({ name: "Signin" });
            }, 4000);
          }
          if (err.response.status === 500) {
            this.createAlert("alert-warning mt-5", "Erreur serveur ! Veuillez réessayer plus tard.");
            setTimeout(() => {
              this.$router.go();
            }, 4000);
          }
        });
      }
    },
    setImage(event) { // Utiliser pour la prévisualisation de l'image avant de publier le post
      this.image = event.target.files[0];
      this.previewImage = URL.createObjectURL(event.target.files[0]);
    }
  }
};
</script>

<style lang="scss" scoped>
  #preview {
    display: flex;
    justify-content: center;
    align-items: center;
    & img {
    border-radius: 8px;
    max-width: 100%;
    max-height: 500px;
    }
  }
</style>