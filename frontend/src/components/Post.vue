<!-- Page de gestion des posts -->

<template>
  <article class="card mb-3 mx-auto">
    <!-- Utilisation d'une carte de Bootstrap -->
    <div class="card-body">
      <p class="text-left text-muted small">
        <img :src="post.avatar_url" :alt="post.username" id="miniAvatar"> 
        {{ post.username }} · Post créé {{ post.dateCreation }}
      </p>
      <!-- L'image du post est cliquable si on se situe sur la page principale -->
      <div v-if="this.$route.name === 'MainPage'" :class="cursor" type="button" @click="goToPost(post.slug)">
        <p id="titre">{{ post.title }}</p>
        <img :src="post.image_url" :alt="post.title" />
      </div>
      <!-- Fin -->
      <!-- L'image du post n'est pas cliquable si on se situe sur la page PostID -->
      <div v-if="this.$route.name === 'PostID'">
        <p id="titre">{{ post.title }}</p>
        <img :src="post.image_url" :alt="post.title" />
      </div>
      <!-- Fin -->
      <p class="card-text text-left text-muted mt-2">{{ this.getPoints }} points · <span type="button" @click="goToPost(post.slug)"></span>{{ post.commentsNumber }} commentaires</span></p>
      <!-- <p class="text-danger font-weight-bold">{{ post }}</p> -->
      <div class="d-flex justify-content-center">
        <div class="col-md-3 text-left">
          <!-- Bouton like -->
          <i 
          type="button" 
          class="fas fa-thumbs-up fa-lg"
          aria-hidden="true"
          title="J'aime le post"
          :class="postLiked"
          @click="sendVote(1)"
          ></i>
          <!-- Fin -->
          <!-- Bouton dislike -->
          <i 
          type="button" 
          class="fas fa-thumbs-down mx-3 fa-lg"
          aria-hidden="true"
          title="Je n'aime pas le post"
          :class="postDisliked"
          @click="sendVote(-1)"
          ></i>
          <i 
          type="button"
          class="far fa-comment-alt fa-lg mx-3"
          aria-hidden="true"
          title="Laisser un commentaire"
          @click="toggleCommentSection"
          ></i>
          <!-- Fin -->
        </div>
        <div class="col-md-9 text-right text-secondary">
          <!-- Bouton suppression du post -->
          <i
          v-if="post.postOwner > 0"
          type="button"
          class="fas fa-trash fa-lg"
          aria-hidden="true"
          title="Supprimer le post"
          @click="deletePost()"
          ></i>
          <!-- Fin -->
        </div>
      </div>
      <!-- Espace de création de commentaire -->
        <div class="row">
          <div class="col-12">
            <slot name="createComment"></slot>
          </div>
        </div>
      <!-- Fin -->
    </div>
    <!-- Fin -->
</article>
</template>

<script>
export default {
  props: ["post", "thisPostComments"],
  data() {
    return {
      cursor: "pointer", // Change le curseur selon que l'on est dans la page principale ou bien dans un post spécifique
      postLiked: "", // Pour gérer la couleur sur un like
      postDisliked: "", // Pour gérer la couleur sur un dislike
    }
  },
  methods: {
    // Envoi des like/dislike au parent pour les posts
    sendVote(voteValue) {
      if(this.post.yourVote != voteValue) {// Si l'utilisateur a fait le même vote, ne rien faire
        if(voteValue == 1) {
          this.$emit("positive-vote");
          } else
        this.$emit("negative-vote");
      }
    },
    visualVotes() {
      if (this.post.yourVote == 1) {
        this.postDisliked = ""; // Mettre la couleur du pouce négatif par défaut
        this.postLiked = "text-primary"; // Le pouce devient bleu sur un like
      }
      if (this.post.yourVote == -1) {
        this.postLiked = ""; // Mettre la couleur du pouce positif par défaut
        this.postDisliked = "text-danger"; // Le pouce devient rouge sur un dislike
      }
    },
    deletePost() { // Suppression d'un post
      if (this.post.postOwner > 0) {
        this.$emit("delete-post");
      }
    },
    goToPost(slug) {
      // Route vers un post spécifique et ses commentaires
      if (slug) {
        this.$router.push({ name: "PostID", params: { slug: slug } });
      }
    },
    toggleCommentSection() {
      this.$emit("toggle-comment-section")
    },
  },
  computed: {
    getPoints() { // Compte le nombre de points : Likes - Dislikes
      return this.post.positiveVotes - this.post.negativeVotes;
    },
  },
  mounted() {
    // Permet d'afficher visuellement la couleur du vote de l'utilisateur : bleu = like, rouge = dislike, noir = pas encore voté
    this.visualVotes();
    // Mise à jour du curseur quand on passe sur l'image du post selon la page dans laquelle on se trouve
    if (this.$route.name === "MainPage") {
      this.cursor = "pointer";
    } else {
      this.cursor = "default";
    }
  },
  updated() { // Les données qui doivent être mise à jour lors de nouvelles données reçu
    this.visualVotes();
    this.points = this.post.positiveVotes - this.post.negativeVotes;
  },
}
</script>

<style lang="scss" scoped>
#miniAvatar {
  max-width: 25px;
}
article {
  max-width: 740px;
}

img {
  max-width: 690px;
}

#titre {
  font-weight: bold;
  font-size: 1.4rem;
}

@media (max-width: 768px) {
  img {
    max-width: 650px;
  }
}

@media (max-width: 576px) {
  img {
    max-width: 320px;
  }
}
</style>