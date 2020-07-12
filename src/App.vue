<template>
  <ion-app>
    <vue-gapi @initGapi="initialized = true" />
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
      <!-- <ion-button size="small" v-show="signIn" @click="$set(Google,'signOut', true)">Sign Out</ion-button> -->
      <login-button v-show="initialized && !signIn()" />
      <Home :signIn="signIn()" />
    </ion-content>
  </ion-app>
</template>

<script>
require("dotenv").config();
import Home from "./views/Home.vue";
import loginButton from "./components/loginButton";
import vueGapi from "./components/gapi";
export default {
  name: "App",
  components: {
    Home,
    loginButton,
    vueGapi
  },
  data() {
    return {
      initialized: false
    };
  },
  computed: {
  },
  beforeCreate() {
    if (location.host.slice(0, 9) !== "localhost") {
      console.log = function() {};
      console.group = function() {};
      console.groupEnd = function() {};
    }
  },
  created() {},
  methods: {
    signIn() {
      var auth = this.initialized && gapi.auth2.getAuthInstance().isSignedIn.get()
      return auth;
    },
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
