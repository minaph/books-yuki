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
        var vm = this;
        if (code !== null && code !== "null") {
          gapi.client.setToken({
            access_token: code,
          });
          console.log(vm.gauth.isSignedIn.get());
          if (!vm.gauth.isSignedIn.get()) {
            update = true;
          }
        } else {
          update = true;
        }
        if (update) {
          Plugins.GoogleAuth.signIn().then((GoogleUser) => {
            var code;
            if ("accessToken" in GoogleUser.authentication) {
              gapi.client.setToken({
                access_token: GoogleUser.authentication.accessToken,
              });
              code = GoogleUser.authentication.accessToken;
              // console.assert(
              //   vm.gauth.isSignedIn.get(),
              //   "Login failed " + JSON.stringify(GoogleUser)
              // );
              vm.$emit("set-token")
            } else if ("serverAuthCode" in GoogleUser) {
              vm.gauth.request(GoogleUser.serverAuthCode).then(
                function(response) {
                  if ("access_token" in response.result) {
                    gapi.client.setToken({
                      access_token: response.result.access_token,
                    });
                    code = response.result.access_token;
                    // console.log(code);
                    // console.log(response.result)
                    // console.assert(
                    //   vm.gauth.isSignedIn.get(),
                    //   "Login failed " + JSON.stringify(response)
                    // );
                    // localStorage.setItem("code", code);
                    // vm.gauth.signIn()
                    vm.$emit("set-token")
                  } else {
                    console.log(response);
                  }
                },
                function(e) {
                  console.error(e);
                }
              );
            } else {
              console.error("Auth code not found");
            }
            localStorage.setItem("code", code);
            // console.assert(
            //   gapi.auth2.getAuthInstance().isSignedIn.get(),
            //   "Login failed " + JSON.stringify(GoogleUser)
            // );
          });
        }
      } else {
        this.gauth.signIn();
      }
    },
  },
};
</script>
