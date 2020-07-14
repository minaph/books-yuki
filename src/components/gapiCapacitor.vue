<template>
  <meta name="google-signin-client_id" :content="this.initParams.clientId" />
</template>
<script>
import "@codetrix-studio/capacitor-google-auth";
import { Plugins } from '@capacitor/core';
export default {
  name: "vueGapiCapacitor",
  data() {
    return {
      auth: false,
    };
  },
  computed: {
    initParams: () => ({
      // apiKey: process.env.VUE_APP_API_KEY,
      clientId:
        "186767635929-88v3ukn6ci5f6sego30acvio50d67l2i.apps.googleusercontent.com",
      // discoveryDocs: [
      //   "https://sheets.googleapis.com/$discovery/rest?version=v4"
      // ],
      // scope: "https://www.googleapis.com/auth/spreadsheets"
    })
  },
  created() {
    console.log("created 1", Plugins.GoogleAuth)
    console.log("created 1", Plugins.gapiLoaded)
    console.log("created 1", Plugins.gapiLoaded.get())
    // console.log("created 1", window.gapiResolve)
    // const vm = this;
    // let gapiScript = document.createElement("script");
    // gapiScript.setAttribute("src", "https://apis.google.com/js/api.js");
    // gapiScript.async = true;
    // gapiScript.defer = true;
    // gapiScript.onload = function() {
    //   gapiScript.onload = function() {};
    //   gapi.load("client:auth2", initClient);
    // };
    // gapiScript.onreadystatechange = function() {
    //   if (gapiScript.readyState === "complete") {
    //     gapiScript.onload();
    //   }
    // };
    // document.head.appendChild(gapiScript);
    Plugins.gapiLoaded.then(function(){
      initClient()
    })

    function initClient() {
      console.log("initClient");
      console.log("created", Plugins.GoogleAuth)
      console.log("created", Plugins.gapiLoaded)
      console.log("created", window.gapiResolve)
      // Plugins.GoogleAuth.signIn()
      // gapi.client.init(vm.initParams).then(
      //   function() {
      //     vm.$emit("initGapi", gapi.auth2.getAuthInstance());
      //   },
      //   function(error) {
      //     console.error(JSON.stringify(error, null, 2));
      //   }
      // );
    }
  },
  mounted(){
    console.log("mounted", Plugins.GoogleAuth)
    // Plugins.GoogleAuth.signIn()
  },
  methods: {}
};
</script>