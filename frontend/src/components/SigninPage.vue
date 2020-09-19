<!-- Nav et Header des pages login et signup -->

<template>
  <header>
    <!-- Logo Groupomania -->
    <h1>
      <img class="img-fluid" alt="Logo Groupomania" src="../assets/logo.png" width="400px" />
    </h1>
    <!-- Fin -->
    <!-- Menu de navigation -->
    <nav>
      <router-link to="/">Se connecter</router-link> |
      <router-link to="/Signup">S'inscrire</router-link>
    </nav>
    <!-- Fin -->
  </header>
</template>

<script>
export default {
  name: "SigninPage",
};
</script>

<style scoped lang="scss">
header {
  margin-top: 5rem;
}
</style>