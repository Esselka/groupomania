<!-- Composant servant à la création d'un commentaire -->

<template>
  <form name="formComment">
    <!-- Texte du commentaire -->
    <textarea
      name="comment"
      class="form-control"
      cols="130"
      rows="2"
      maxlength="200"
      required
      placeholder="Créer un commentaire"
      aria-label="Ecrire un commentaire"
      v-model="commentText"
      @input="sendComment"
    ></textarea>
    <!-- Fin -->
    <!-- Bouton pour le publier -->
    <slot></slot>
    <!-- fin -->
  </form>
</template>

<script>
export default {
  name: "CreateComment",
  data: () => {
    return {
      commentText: "",
    };
  },
  methods: {
    sendComment() {
      this.$emit("comment-sent", this.commentText);
    }
  }
};
</script>