<!-- Informations d'inscription à renseigner pour s'inscrire -->

<template>
  <div>
    <div class="row">
      <div class="col-lg-9 col-md-9 mb-2 d-flex justify-content-center mx-auto">
        <!-- Input pour le nom -->
        <div class="col-lg-3 col-md-6 mb-2">
          <input
            class="form-control text-center"
            type="text"
            placeholder="Nom"
            id="lastname"
            required
            maxlength="50"
            aria-label="Entrez votre nom"
            v-model="lastname"
            v-on:input="sendData"
          />
        </div>
        <!-- Fin -->
        <!-- Input pour le prénom -->
        <div class="col-lg-3 col-md-6 mb-2">
          <input
            class="form-control text-center"
            type="text"
            placeholder="Prénom"
            id="firstname"
            required
            maxlength="100"
            aria-label="Entrez votre prénom"
            v-model="firstname"
            v-on:input="sendData"
          />
        </div>
      <!-- Fin -->
      </div>
      <!-- Input pour le nom d'utilisateur -->
        <div class="col-lg-4 col-md-8 mb-2 mx-auto">
          <input
            class="form-control text-center"
            type="text"
            placeholder="Nom d'utilisateur"
            id="username"
            required
            maxlength="50"
            aria-label="Entrez votre nom d'utilisateur"
            v-model="username"
            v-on:input="sendData"
          />
        </div>
      <!-- Fin -->
    </div>
  </div>
</template>

<script>
export default {
  name: "SignupPageForm",
  data: () => {
    return {
      firstname: "",
      lastname: "",
      username:""
    };
  },
  methods: {
    // Envoi des données au parent qui gère la transmission des données à l'API
    sendData() { 
      const firstNameValid = document.getElementById("firstname").checkValidity();
      const lastNameValid = document.getElementById("lastname").checkValidity();
      const usernameValid = document.getElementById("username").checkValidity();
      if (firstNameValid && lastNameValid && usernameValid) {
        this.$emit("data-sent", this.$data);
      }
    },
  },
};
</script>