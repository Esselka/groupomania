<!-- Page de gestion des posts -->

<template>
  <article class="card mb-3 mx-auto">
    
    <div class="card-body">
      <p class="text-left text-muted small"><img :src="avatarUrl" :alt="username" id="miniAvatar"> {{ username }}</p>
      <p id="titre">{{ title }}</p>
      <img :src="imageUrl" :alt="title" />
      <p class="card-text text-left text-muted">{{ points }} points · {{ commentsNumber }} commentaires</p>
      <div class="d-flex justify-content-center">
        <div class="col-md-3 text-left">
          <!-- Bouton like -->
          <i 
          type="button" 
          class="fas fa-thumbs-up mx-3 fa-lg"
          aria-hidden="true"
          title="J'aime le post"
          :class="postLiked"
          @click="sendVote(postID, 1)"
          ></i>
          <!-- Fin -->
          <!-- Bouton dislike -->
          <i 
          type="button" 
          class="fas fa-thumbs-down fa-lg"
          aria-hidden="true"
          title="Je n'aime pas le post"
          :class="postDisliked"
          @click="sendVote(postID, -1)"
          ></i>
          <!-- Fin -->
        </div>
        <div class="col-md-9  text-right text-secondary">
          <!-- Bouton suppression du post -->
          <i
          v-if="postOwner > 0"
          type="button"
          class="fas fa-trash fa-lg"
          aria-hidden="true"
          title="Supprimer le post"
          @click="deletePost()"
          ></i>
          <!-- Fin -->
        </div>
      </div>
    </div>
</article>
</template>

<script>
export default {
  props: ["imageUrl", "title", "positiveVotes", "negativeVotes", "commentsNumber", "postOwner", "username", "postID", "yourVote", "avatarUrl", "slug"],
  data() {
    return {
      points: this.positiveVotes - this.negativeVotes,
      postLiked: "", // pour gérer la couleur sur un like
      postDisliked: "", // pour gérer la couleur sur un dislike
    }
  },
  methods: {
    // Envoi des like/dislike au parent pour les posts
    sendVote(postID, voteValue) {
      if(this.yourVote != voteValue) {// Si l'utilisateur a fait le même vote, ne rien faire
        if(voteValue == 1) {
          this.$emit("positive-vote");
          } else
        this.$emit("negative-vote");
      }
    },
    visualVotes() {
      if (this.yourVote == 1) {
        this.postDisliked = ""; // Mettre la couleur du pouce négatif par défaut
        this.postLiked = "text-primary"; // Le pouce devient bleu sur un like
      }
      if (this.yourVote == -1) {
        this.postLiked = ""; // Mettre la couleur du pouce positif par défaut
        this.postDisliked = "text-danger"; // Le pouce devient rouge sur un dislike
      }
    },
    deletePost() { // Suppression d'un post
      if (this.postOwner > 0) {
        this.$emit("delete-post");
      }
    }
  },
  computed: {
    
  },
  mounted() {
    // Permet d'afficher visuellement la couleur du vote de l'utilisateur : bleu = like, rouge = dislike, noir = pas encore voté
    this.visualVotes();
  },
}
</script>

<style lang="scss" scoped>
#miniAvatar {
  max-width: 25px;
}
article {
  max-width: 700px;
}

img {
  max-width: 650px;
}

#titre {
  font-weight: bold;
  font-size: 1.4rem;
}

@media (max-width: 576px) {
  img {
    max-width: 300px;
  }
}
</style>