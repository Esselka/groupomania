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
        :key="post.post_id"
        :post="post"
        @positive-vote="reactToPost(post.post_id, '1')"
        @negative-vote="reactToPost(post.post_id, '-1')"
        @delete-post="deletePost(post.slug)"
        @toggle-comment-section="toggleShowCommentSection(post.post_id)"
      >
      <!-- Espace commentaire -->
        <template v-slot:createComment>
          <CreateComment
            @comment-sent="setCommentText"
            v-if="showCommentSection && currentPostID === post.post_id"
          >
            <button
              class="col-3 btn btn-warning form-control text-center mt-2"
              type="submit"
              @click.prevent="postComment(post.post_id)"
            >Publier
            </button>
          </CreateComment>
          <InfoMessage
            v-if="alert.active && alert.activeComment && currentPostID === post.post_id"
            :alertType="alert.type"
            :alertMessage="alert.message"
          />
        </template>
        <!-- Fin -->
      </Post>
      <!-- Fin -->
    </div>
  </div>
</template>

<script>
import InfoMessage from "../components/InfoMessage";
import NavBar from "../components/NavBar";
import Post from "../components/Post";
import CreateComment from "../components/CreateComment";

export default {
  name: "MainPage",
  components: {
    InfoMessage,
    NavBar,
    Post,
    CreateComment,
  },
  data() {
    return {
      connected: true, // Si l'utilisateur est connecté = true
      alert: {
        active: false, // L'alerte n'est pas visible par défaut
        activeComment: false, // Active ou non l'affichage de succès de publication d'un commentaire
        type: "",
        message: "" // Message qui donne plus de précision sur l'alerte
      },
      allPosts: [], // Stockage de tous les posts
      showCommentSection: false, // Ne pas montrer la section commentaire par défaut
      commentText: "", // Sauvegarde du texte du commentaire avant envoi
      currentPostID: "" // Stock le postID actuel pour la gestion des commentaires pour chaque post
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
    commentAlert(type, message) {
      // Crée une alerte pendant 4 secondes
      const dataAlert = this.$data.alert;
      dataAlert.active = true;
      dataAlert.type = type;
      dataAlert.message = message;
      setTimeout(() => {
        dataAlert.active = false;
        dataAlert.activeComment = false;
        dataAlert.type = "";
        dataAlert.message = "";
      }, 4000);
        this.getAllPosts(); // Rafraîchit le nombre de commentaires
    },
    getAllPosts() {
      this.$axios
        .get("posts/")
        .then((response) => {
          this.allPosts = response.data.result;
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
    },
    reactToPost(postID, voteValue) {
      this.$axios
      .post(`posts/${postID}/react`, { type: voteValue })
      .then(() => {
        this.getAllPosts(); // Rafraîchit les données à l'écran 
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
            setTimeout(() => {
              this.$router.go();
            }, 4000);
          }
      });
    },
    setCommentText(text) {
      this.commentText = text; // Stockage du texte du commentaire avant envoi
    },
    postComment(postID) {
      const formValid = document
        .getElementsByName("formComment")[0]
        .checkValidity();
      if (formValid) {
        this.$axios
        .post(`posts/${postID}/comments`, { text: this.commentText })
        .then(() => {
          this.showCommentSection = false;
          this.alert.activeComment = true;
          this.commentAlert("alert-success mt-1", "Commentaire publié !");
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
    toggleShowCommentSection(postID) { // Montrer/Cacher l'espace de création d'un commentaire
      if (this.showCommentSection) {
        this.currentPostID = postID;
        this.showCommentSection = false;
      } else {
        this.currentPostID = postID;
        this.showCommentSection = true;
      }
    },
  },
  mounted() {
    this.getAllPosts(); // Récupération de tous les posts avant affichage de la page
  },
}
</script>