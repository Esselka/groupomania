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
        :post="post[0]"
        :thisPostComments="post[0].commentsResult"
        :isAdmin="isAdmin"
        @positive-vote="reactToPost(post[0].post_id, '1')"
        @negative-vote="reactToPost(post[0].post_id, '-1')"
        @delete-post="deletePost(post[0].slug)"
        @toggle-comment-section="toggleShowCommentSection(post[0].post_id)"
      >
      <!-- Espace de création de commentaire -->
        <template v-slot:createComment>
          <CreateComment
            @comment-sent="setCommentText"
            v-if="showCommentSection"
          >
            <button
              class="col-3 btn text-white form-control text-center mt-2"
              type="submit"
              style="background: #FD2D01;"
              @click.prevent="createComment(post[0].post_id)"
            >Poster
            </button>
          </CreateComment>
          <InfoMessage
            v-if="alert.active && alert.activeComment && currentPostID === post[0].post_id"
            :alertType="alert.type"
            :alertMessage="alert.message"
          />
        </template>
        <!-- Fin -->
      </Post>
      <!-- Fin -->

      <!-- Message qui informe l'utilisateur sur la suppression/modification de son commentaire -->
      <span class="alert alert-success" v-if="commentMessageInfo">{{ commentMessageInfo }}</span>
      <!-- Fin -->

      <!-- Affichage des commentaires liés à ce post -->
      <Comment
      v-for="comment in post.commentsResult"
      :key="comment.comment_id"
      :commentDatas="comment"
      :isAdmin="isAdmin"
      @delete-comment="deleteComment(comment.post_id, comment.comment_id)"
      @modify-comment="toggleShowModifyCommentSection(comment.comment_id)"
      >

      <!-- Espace de modification de commentaire -->
        <template v-slot:modifyComment>
        <div v-if="showModifyCommentSection && currentCommentID === comment.comment_id">
          <input
            class="form-control text-center"
            type="text"
            v-model="comment.text"
            id="inputModifyComment"
            rows="2"
            maxlength="200"
            aria-label="Modifier commentaire"
            aria-describedby="commentInput"
          />
          <button
            class="col-3 btn form-control text-white text-center mt-2"
            style="background: #FD2D01;"
            type="submit"
            @click.prevent="modifyComment(comment.post_id, comment.comment_id)"
          >Modifier
          </button>
        </div>
          <InfoMessage
            v-if="alert.active && alert.activeComment && currentCommentID === comment.comment_id"
            :alertType="alert.type"
            :alertMessage="alert.message"
          />
        </template>
        <!-- Fin -->
      </Comment>
      <!-- Fin -->
    </div>
  </div>
</template>

<script>
import InfoMessage from "../components/InfoMessage";
import NavBar from "../components/NavBar";
import Post from "../components/Post";
import CreateComment from "../components/CreateComment";
import Comment from "../components/Comment";

export default {
  name: "PostID",
  components: {
    InfoMessage,
    NavBar,
    Post,
    CreateComment,
    Comment
  },
  data() {
    return {
      connected: true, // Définit si l'utilisateur est connecté
      alert: {
        active: false, // L'alerte n'est pas visible par défaut
        type: "",
        message: "" // Message qui donne plus de précision sur l'alerte
      },
      post: [false], // Stock le post ainsi que les commentaires liés à ce post
      showCommentSection: true, // Montrer la section commentaire par défaut
      showModifyCommentSection: false, // Cacher la section de modification de commentaire par défaut
      commentText: "", // Sauvegarde du texte du commentaire avant envoi
      currentPostID: "", // Stock le postID actuel pour la gestion des commentaires pour chaque post
      currentCommentID: "", // Stock le commentID actuel pour la modification d'un commentaire en particulier
      commentMessageInfo: "", // Message à afficher en cas de modification/suppression d'un commentaire réussie
      isAdmin: false, // Un utilisateur est-il admin ? false par défaut
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
      // Crée une alerte pendant 3 secondes
      const dataAlert = this.$data.alert;
      dataAlert.active = true;
      dataAlert.type = type;
      dataAlert.message = message;
      setTimeout(() => {
        dataAlert.active = false;
        dataAlert.activeComment = false;
        dataAlert.type = "";
        dataAlert.message = "";
      }, 3000);
        this.getOnePost(this.$route.params.slug); // Rafraîchit le nombre de commentaires
    },
    getOnePost(slug) {
      this.$axios
      .get(`posts/${slug}`)
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
            setTimeout(() => {
              this.$router.go();
            }, 4000);
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
        this.getOnePost(this.$route.params.slug); // Rafraîchit les données à l'écran
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
    createComment(postID) {
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
    modifyComment(postID, commentID) {
      // Récupération du texte du commentaire modifié
      const modifiedCommentText = document.getElementById("inputModifyComment").value;

      this.$axios
      .put(`posts/${postID}/comments/${commentID}`, { text: modifiedCommentText })
      .then((response) => {
        if (response.status === 200) {
          this.showModifyCommentSection = false; // Cache la section de modification du commentaire
          this.commentMessageInfo = "Commentaire modifié avec succés";
          this.getOnePost(this.$route.params.slug); // Rafraîchit les données de la page
          // Cache le message de modification effectuée après 3.5s d'affichage
          setTimeout(() => {
            this.commentMessageInfo = "";
          }, 3500);
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          this.createAlert("alert-warning mt-5", "Modification échouée !");
          // Rafrâichit la page 3s après l'affichage du message d'erreur
          setTimeout(() => {
            this.$router.go();
          }, 3000);
        }
        if (err.response.status === 401) {
          this.createAlert("alert-danger mt-5", "Session expirée, veuillez vous reconnecter.");
          // Retour à la page de login 4s après que le message de session expirée se soit affiché
          setTimeout(() => {
            this.$router.push({ name: "Signin" });
          }, 4000);
        }
        if (err.response.status === 403) {
          this.createAlert("alert-danger mt-5", "Vous devez être le créateur du commentaire pour le modifier !");
          // Rafrâichit la page 4s après l'affichage du message d'erreur
          setTimeout(() => {
            this.$router.go();
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
    deleteComment(postID, commentID) {
      this.$axios
      .delete(`posts/${postID}/comments/${commentID}`)
      .then((response) => {
        if (response.status === 200) {
          this.commentMessageInfo = "Commentaire supprimé avec succés";
          this.getOnePost(this.$route.params.slug); // Rafraîchit les données de la page
          // Cache le message de suppression effectuée après 3.5s d'affichage
          setTimeout(() => {
            this.commentMessageInfo = "";
          }, 3500);
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
        if (err.response.status === 403) {
          this.createAlert("alert-danger mt-5", "Vous devez être le créateur du commentaire pour le supprimer !");
          // Rafrâichit la page 4s après l'affichage du message d'erreur
          setTimeout(() => {
            this.$router.go();
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
    toggleShowCommentSection(postID) { // Montrer/Cacher l'espace de création d'un commentaire
      if (this.showCommentSection) {
        this.currentPostID = postID;
        this.showCommentSection = false;
      } else {
        this.currentPostID = postID;
        this.showCommentSection = true;
      }
    },
    toggleShowModifyCommentSection(commentID) {
      if (this.showModifyCommentSection) {
        this.currentCommentID = commentID;
        this.showModifyCommentSection = false;
      } else {
        this.currentCommentID = commentID;
        this.showModifyCommentSection = true;
      }
    },
    getUserRole() {
      this.$axios
      .get('/users/currentUserRole')
      .then((response) => {
        this.isAdmin = response.data.role === 'admin';
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
          this.createAlert("alert-danger mt-5", "L'utilisateur n'existe pas.");
          // Rafrâichit la page 4s après l'affichage du message d'erreur
          setTimeout(() => {
            this.$router.go();
          }, 4000);
        }
        if (err.response.status === 500) {
          this.createAlert("alert-warning mt-5", "Erreur serveur ! Veuillez réessayer plus tard.");
          setTimeout(() => {
            this.$router.go();
          }, 4000);
        }
      })
    },
  },
  mounted() { // Récupération des données d'un post en particulier, définition du titre de la page
    this.getOnePost(this.$route.params.slug);
    this.getUserRole(); // Récupère le role de l'utilisateur pour lui donner ou non des des droits d'admin
    document.title = `Groupomania | Espace post et commentaires`;
  },
}
</script>