<template>
  <!-- reviewed 2020/07/19 -->
  <ion-button fill="outline" color="danger" @click="auth()">Log in</ion-button>
</template>
<script>
import "@codetrix-studio/capacitor-google-auth";
import { Plugins } from "@capacitor/core";
export default {
  name: "login-button",
  props: {
    gauth: Object,
    cap: Boolean,
  },
  methods: {
    auth() {
      // Todo: モバイルログイン実装の確認
      if (this.cap) {
        var update = false;
        var code = localStorage.getItem("code");
        if (code !== null && code !== "null") {
          gapi.client.setToken({
            access_token: code,
          });
          console.log(gapi.auth2.getAuthInstance().isSignedIn.get())
          if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
            update = true;
          }
        } else {
          update = true;
        }
        if (update) {
          Plugins.GoogleAuth.signIn().then((GoogleUser) => {
            gapi.client.setToken({
              access_token: GoogleUser.authentication.accessToken,
            });
            localStorage.setItem("code", GoogleUser.authentication.accessToken);
          });
        }
      } else {
        this.gauth.signIn();
      }
    },
  },
};
</script>
