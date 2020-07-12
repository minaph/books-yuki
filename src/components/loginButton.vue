<template>
  <ion-button size="small" @click="auth()" :disabled="disabled()">Authorize</ion-button>
</template>
<script>
export default {
  name: "login-button",
  methods: {
    auth() {
      if (!this.disabled()) {
        gapi.auth2.getAuthInstance().signIn();
      }
    },
    disabled() {
      var f = x => x !== "undefined";
      return (
        f(typeof gapi) &&
        f(typeof gapi.auth2) &&
        f(typeof gapi.auth2.getAuthInstance)
      );
    }
  }
};
</script>