<template>
  <ion-app>
    <ion-toolbar>
      <ion-buttons slot="start" @click="fullscreen()">
        <ion-button>fullscreen</ion-button>
      </ion-buttons>
      <ion-title>books</ion-title>
      <ion-buttons slot="end" @click="resetData()">
        <ion-button>初期設定</ion-button>
      </ion-buttons>
    </ion-toolbar>
    <ion-content>
      <ion-button size="small" v-show="!signIn" @click="auth = true">Authorize</ion-button>
      <!-- <ion-button size="small" v-show="signIn" @click="$set(Google,'signOut', true)">Sign Out</ion-button> -->
      <Home v-show="signIn" :signIn="signIn" />
    </ion-content>
  </ion-app>
</template>

<script>
require("dotenv").config();
import Home from "./views/Home.vue";
export default {
  name: "App",
  components: {
    Home
  },
  data() {
    return {
      status: { ie: false, y3: { value: false } },
      auth: false
    };
  },
  computed: {
    initParams: () => ({
      apiKey: process.env.VUE_APP_API_KEY,
      clientId:
        "186767635929-88v3ukn6ci5f6sego30acvio50d67l2i.apps.googleusercontent.com",
      discoveryDocs: [
        "https://sheets.googleapis.com/$discovery/rest?version=v4"
      ],
      scope: "https://www.googleapis.com/auth/spreadsheets"
    }),
    signIn() {
      return this.status.ie && this.status.y3.value;
    }
  },
  beforeCreate() {
    if (location.host.slice(0, 9) !== "localhost") {
      console.log = function() {};
      console.group = function() {};
      console.groupEnd = function() {};
    }
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
          gapi.auth2.getAuthInstance().isSignedIn.get();
          vm.status = gapi.auth2.getAuthInstance().isSignedIn;
        },
        function(error) {
          console.error(JSON.stringify(error, null, 2));
        }
      );
    }
  },
  watch: {
    auth() {
      this.auth = false;
      gapi.auth2.getAuthInstance().signIn();
    }
  },
  methods: {
    fullscreen() {
      console.log("Fullscreen");
      (function() {
        var doc = window.document;
        var docEl = doc.documentElement;
        var requestFullScreen =
          docEl.requestFullscreen ||
          docEl.mozRequestFullScreen ||
          docEl.webkitRequestFullScreen ||
          docEl.msRequestFullscreen;
        var cancelFullScreen =
          doc.exitFullscreen ||
          doc.mozCancelFullScreen ||
          doc.webkitExitFullscreen ||
          doc.msExitFullscreen;
        if (
          !doc.fullscreenElement &&
          !doc.mozFullScreenElement &&
          !doc.webkitFullscreenElement &&
          !doc.msFullscreenElement
        ) {
          requestFullScreen.call(docEl);
        } else {
          cancelFullScreen.call(doc);
        }
      })();
    },
    resetData() {
      if (confirm("初期設定前に、現在のアカウントからログアウトしますか？")) {
        gapi.auth2.getAuthInstance().signOut();
      }
      localStorage.clear();
      sessionStorage.clear();
      console.info("Data cleaned up");
      location.reload();
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
