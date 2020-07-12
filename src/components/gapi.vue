<template></template>
<script>
export default {
  name: "vueGapi",
  computed: {
    initParams: () => ({
      apiKey: process.env.VUE_APP_API_KEY,
      clientId:
        "186767635929-88v3ukn6ci5f6sego30acvio50d67l2i.apps.googleusercontent.com",
      discoveryDocs: [
        "https://sheets.googleapis.com/$discovery/rest?version=v4"
      ],
      scope: "https://www.googleapis.com/auth/spreadsheets"
    })
  },
  created() {
    const vm = this;
    let gapiScript = document.createElement("script");
    gapiScript.setAttribute("src", "https://apis.google.com/js/api.js");
    gapiScript.async = true;
    gapiScript.defer = true;
    gapiScript.onload = function() {
      gapiScript.onload = function() {};
      gapi.load("client:auth2", initClient);
    };
    gapiScript.onreadystatechange = function() {
      if (gapiScript.readyState === "complete") {
        gapiScript.onload();
      }
    };
    document.head.appendChild(gapiScript);

    function initClient() {
      console.log("initClient");
      // var vm = this;
      gapi.client.init(vm.initParams).then(
        function() {
          // gapi.auth2.getAuthInstance().isSignedIn.get();
          vm.$emit("initGapi");
        },
        function(error) {
          console.error(JSON.stringify(error, null, 2));
        }
      );
    }
  }
};
</script>