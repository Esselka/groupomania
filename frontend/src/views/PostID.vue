<!-- Page qui affiche seulement un post en particulier avec ses commenaires -->

<template>
  <div>
    <!-- Avertis si l'utilisateur n'est pas connecté -->
    <InfoMessage v-if="!connected" :alertType="alert.type" :alertMessage="alert.message" />
    <!-- Fin -->
    <div v-else>
      <!-- Barre de navigation -->
      <NavBar />
      <!-- Fin -->
      <!-- Post -->
      <Post
        v-if="post"
        :key="post.id"
        :imageUrl="post.image_url"
        :title="post.title"
        :positiveVotes="post.positiveVotes"
        :negativeVotes="post.negativeVotes"
        :commentsNumber="post.commentsNumber"
        :postOwner="post.postOwner"
        :username="post.username"
        :postID="post.post_id"
        :yourVote="post.yourVote"
        :avatarUrl="post.avatar_url"
        :dateCreation="post.dateCreation"
        @positive-vote="reactToPost(post.post_id, '1')"
        @negative-vote="reactToPost(post.post_id, '-1')"
        @delete-post="deletePost(post.slug)"
      />
      <!-- Fin -->
    </div>
  </div>
</template>

<script>
import InfoMessage from "../components/InfoMessage";
import NavBar from "../components/NavBar";
import Post from "../components/Post";

export default {
  data() {
    return {
      connected: true, // Définit si l'utilisateur est connecté
      alert: {
        active: false, // L'alerte n'est pas visible par défaut
        type: "",
        message: "" // Message qui donne plus de précision sur l'alerte
      },
      post: [], // Stock le post ainsi que les commentaires liés à ce post
    }
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
    getOnePost() {
      this.$axios
      .get(`posts/${this.post.slug}`)
      .then((response) => {
        this.post = response.data;
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
            this.createAlert("alert-danger mt-5", "Aucun post ne correspond à l'identifiant fournit.");
          }
          if (err.response.status === 500) {
            this.createAlert("alert-warning mt-5", "Erreur serveur ! Veuillez réessayer plus tard.");
          }
      });
    },
    deletePost(slug) {
      this.$axios
      .delete(`posts/${slug}`)
      .then((response) => {
        if (response.status === 200) {
          this.createAlert("alert-success mt-5", "Post supprimé avec succès !");
          // Retour à la page principale 3s après que le message de supression du post se soit affiché
          setTimeout(() => {
            this.$router.push({ name: "MainPage" });
          }, 3000);
        }
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
          }
      });
    },
    reactToPost(postID, voteValue) {
      this.$axios
      .post(`posts/${postID}/react`, { type: voteValue })
      .then(() => {
        this.$router.go(); // Rafraîchit la page
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
          }
      });
    },
  },
}
</script>