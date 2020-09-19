<!-- Informations de connexion à renseigner pour se connecter -->

<template>
  <div>
    <!-- Input pour l'email -->
    <div class="row mb-2">
      <div class="col-lg-4 col-md-8 mx-auto">
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
      <div class="col-lg-4 col-md-8 mx-auto">
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
    <div class="row">
      <div class="col-lg-2 col-md-4 mx-auto mt-4 mb-4">
        <button
          class="btn btn-dark form-control text-center"
          type="submit"
          v-on:click="sendRequest"
        >
        {{ buttonConnectRegister }}
        </button>
      </div>
      <!-- Fin -->
      <!-- Infos modèle mot de passe et message d'erreur -->
      <div class="col-lg-12 col-md-11 mx-auto mb-4">
        <p class="text-dark" id="passwordInfo">
          <slot name="passwordModel"></slot>
        </p>
        <p class="text-danger mt-3">
          <slot name="errorMessage"></slot>
        </p>
      </div>
      <!-- Fin -->
    </div>
    
  </div>
</template>

<script>
export default {
  name: "SigninPageForm",
  props: ["buttonConnectRegister"],
  data: () => {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    // Envoi des données au parent
    sendData() { 
      this.$emit("data-sent", this.$data);
    },
    // Envoie de la requête au parent qui gère la transmission des données à l'API
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