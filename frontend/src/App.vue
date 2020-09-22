<template>
  <div id="app">
    <div class="container-fluid container-md">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

nav {
  padding: 30px;

  a {
    font-weight:600;
    color: #000;

    &.router-link-exact-active {
      color: #FD2D01;
    }
  }
}
</style>
