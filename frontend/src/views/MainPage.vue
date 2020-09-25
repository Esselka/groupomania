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
      <!-- Post -->
      <Post
        v-for="post in allPosts"
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
        :slug="post.slug"
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
  name: "MainPage",
  components: {
    InfoMessage,
    NavBar,
    Post,
  },
  data() {
    return {
      connected: true, // Si l'utilisateur est connecté = true
      alert: {
        active: false, // L'alerte n'est pas visible par défaut
        type: "",
        message: "" // Message qui donne plus de précision sur l'alerte
      },
      allPosts: [], // Stockage de tous les posts
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
    getAllPosts() {
      this.$axios
        .get("posts/")
        .then((response) => {
          this.allPosts = response.data.result;
          console.log('Tous les posts : ', this.allPosts)
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
        this.$router.go(); // TODO voir pourquoi les données ne s'update pas
        //this.getAllPosts(); // Rafraîchir les données à l'écran
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
    deletePost(slug) {
      this.$axios
      .delete(`posts/${slug}`)
      .then(() => {
        this.getAllPosts(); // Récupération de tous les posts après la suppression
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
    }
  },
  mounted() {
    this.getAllPosts(); // Récupération de tous les posts avant affichage de la page
  },
}
</script>