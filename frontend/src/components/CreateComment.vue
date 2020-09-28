<!-- Composant servant à la création d'un commentaire -->

<template>
  <form name="formComment">
    <!-- Texte du commentaire -->
    <textarea
      name="comment"
      class="form-control mt-3"
      cols="100"
      rows="2"
      maxlength="200"
      required
      placeholder="Votre commentaire ici (200 caractères max)"
      aria-label="Ecrire un commentaire"
      v-model="commentText"
      @input="sendComment"
    ></textarea>
    <!-- Fin -->
    <!-- Bouton de publication du commentaire -->
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