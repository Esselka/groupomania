<!-- Composant permettant de renseigner l'utilisateur lors de la création d'un post ou d'un
     commentaire ainsi que leur suppression et gestion des problèmes de connexion -->

<template>
  <!-- alertType étant ici le type d'alerte qui va être utilisé dans Bootstrap, exp : alert-danger -->
  <div>
    <div class="alert" :class="alertType" role="alert">
      {{ alertMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: "InfoMessage",
  props: ['alertType', 'alertMessage'], // Envoi au parent qui traite les props
};
</script>