<!-- Informations de connexion à renseigner pour se connecter -->

<template>
  <div>
    <!-- Input pour l'email -->
    <div class="row mb-2">
      <div class="col-lg-4 col-md-8 offset-lg-4 offset-md-2">
        <input
          class="form-control text-center"
          type="email"
          placeholder="Email"
          id="email"
          required
          pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+.[a-zA-Z.]{2,15}"
          maxlength="250"
          aria-label="Entrez votre email"
          v-model="email"
          v-on:input="sendData"
        />
      </div>
    </div>
    <!-- Fin -->
    <!-- Input pour le mot de passe -->
    <div class="row mb-2">
      <div class="col-lg-4 col-md-8 offset-lg-4 offset-md-2">
        <input
          class="form-control text-center"
          type="password"
          placeholder="Mot de passe"
          id="password"
          required
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          maxlength="100"
          aria-label="Entrez votre mot de passe"
          v-model="password"
          v-on:input="sendData"
        />
      </div>
    </div>
    <!-- Fin -->
    <!-- Bouton de connexion -->
    <div class="row mb-2">
      <div class="col-lg-4 col-md-8 offset-lg-4 offset-md-2">
        <button
          class="btn btn-light form-control text-center"
          type="submit"
          v-on:click="sendRequest"
        >{{ validateText }}</button>
        <p class="text-muted" id="passwordInfo">
          <slot name="messagePassword"></slot>
        </p>
        <p class="text-danger">
          <slot name="messageError"></slot>
        </p>
      </div>
    </div>
    <!-- Fin -->
  </div>
</template>

<script>
export default {
  name: "SigninPageForm",
  props: ["formPlaceholder"],
  data: () => {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    sendData() { // Envois des données au parent
      this.$emit("data-sent", this.$data);
    },
    // Envoie de la requête au parent qui gère la transmission des données vers l'API
    sendRequest() {
      const validEmail = document.getElementById("email").checkValidity();
      const validPassword = document.getElementById("password").checkValidity();
      if (validEmail && validPassword) {
        this.$emit("request-sent");
      }
    },
  },
};
</script>