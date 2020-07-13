<template>
  <ion-button size="small" @click="auth()">Authorize</ion-button>
</template>
<script>
export default {
  name: "login-button",
  props: {
    gauth: Object
  },
  methods: {
    auth() {
      this.gauth.signIn();
    },
  }
};
</script>