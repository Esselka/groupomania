<!-- Composant de gestion des commentaires : affichage, modification, suppression -->

<template>
  <article class="d-flex col-lg-8 flex-column mt-1 mx-auto py-2 px-1">
    <div class="d-flex">
      <div>
        <img :src="commentDatas.avatar_url" width="40" height="40" class="rounded-circle">
      </div>
      <div class="mx-1">
        <div class="text-left mx-2">
          <div class="small mb-2">
            {{ commentDatas.firstname }} <span class="font-weight-bold">'{{ commentDatas.username }}'</span> {{ commentDatas.lastname }} · <span class="text-muted">{{ commentDatas.commentCreationDate }}</span>
          </div>
        {{ commentDatas.text }}
        </div>
      </div>
    </div>
    
    <div class="col-12 text-right">
      <!-- Bouton édition du commentaire -->
      <i
      v-if="commentDatas.commentOwner === 1"
      type="button"
      class="fas fa-edit fa mx-3"
      aria-hidden="true"
      title="Editer le commentaire"
      @click="sendModifyComment()"
      ></i>
      <!-- Fin -->

      <!-- Bouton suppression du commentaire -->
      <i
      v-if="commentDatas.commentOwner === 1"
      type="button"
      class="fas fa-trash fa"
      aria-hidden="true"
      title="Supprimer le commentaire"
      @click="sendDeleteComment()"
      ></i>
      <!-- Fin -->
    </div>
    <!-- Espace de modification de commentaire -->
        <div class="row">
          <div class="col-12">
            <slot name="modifyComment"></slot>
          </div>
        </div>
      <!-- Fin -->
  </article>
</template>

<script>
export default {
  name: "Comment",
  props: ["commentDatas"],
  methods: {
    sendDeleteComment() { // Envoi événement de suppression du commentaire
      this.$emit('delete-comment');
    },
    sendModifyComment() {// Envoi événement d'édition du commentaire
      this.$emit('modify-comment');
    },
  },
}
</script>

<style lang="scss" scoped>
  article:nth-of-type(even) {
  background: #EEE;
  border: 1px solid #CCC;
  }
  article:nth-of-type(odd) {
  border: 1px solid #CCC;
  }
</style>