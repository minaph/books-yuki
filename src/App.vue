<template>
  <ion-app>
    <vue-gapi @initGapi="startMonitoring" />
    <ion-toolbar>
      <ion-buttons slot="start" @click="fullscreen()">
        <ion-button>fullscreen</ion-button>
      </ion-buttons>
      <ion-title>books</ion-title>
      <ion-buttons slot="end">
        <SettingModalButton :settings="settings()" :gauth="gauth" />
      </ion-buttons>
    </ion-toolbar>
    <ion-content>
      <!-- <ion-button size="small" v-show="signIn" @click="$set(Google,'signOut', true)">Sign Out</ion-button> -->
      <login-button v-show="initialized && !signIn()" :gauth="gauth" />
      <Home :signIn="signIn()" ref="home" />
    </ion-content>
  </ion-app>
</template>

<script>
require("dotenv").config();
import Home from "./views/Home.vue";
import loginButton from "./components/loginButton";
import vueGapi from "./components/gapi";
import SettingModalButton from "./views/SettingModalButton";
export default {
  name: "App",
  components: {
    Home,
    loginButton,
    vueGapi,
    SettingModalButton
  },
  data() {
    return {
      initialized: false,
      // auth: false,
      gauth: {}
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
    startMonitoring(gauth) {
      this.initialized = true;
      this.$set(this, "gauth", gauth);
    },
    signIn() {
      if (this.initialized) {
        return this.gauth.isSignedIn.get();
      }
      return false;
    },
    // signIn(flag) {
    //   console.log("received changes");
    //   this.auth = flag;
    // },
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
    settings() {
      if (
        typeof this.$refs === "undefined" ||
        typeof this.$refs.home === "undefined"
      ) {
        return {
          url: "",
          SS_ID: "",
          data: "",
          index: "",
          indent: ""
        };
      }
      return this.$refs.home.settings;
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
