<template>
  <!-- done -->
  <Home :signIn="signIn" :settings="settings">
    <vue-gapi @initGapi="startMonitoring" :cap="cap" />

    <ion-toolbar>
      <ion-title>books</ion-title>
      <ion-buttons slot="end">
        <login-button
          v-show="initialized && !signIn"
          :gauth="gauth"
          :cap="cap"
          @set-token="token"
        />
        <FullScreenButton />
        <SettingModalButton :settings="settings" :gauth="gauth" :cap="cap" />
      </ion-buttons>
    </ion-toolbar>
  </Home>
</template>

<script>
function localGet(x) {
  var r = localStorage.getItem(x);
  if (r === "null") {
    return "";
  }
  return r;
}

require("dotenv").config();
import Home from "./views/Home.vue";
import loginButton from "./components/loginButton";
import vueGapi from "./components/gapi";
import vueGapiCapacitor from "./components/gapiCapacitor.vue";
import SettingModalButton from "./views/SettingModalButton";
import FullScreenButton from "./components/FullScreenButton";
export default {
  name: "App",
  components: {
    Home,
    loginButton,
    vueGapi,
    vueGapiCapacitor,
    SettingModalButton,
    FullScreenButton,
  },
  data() {
    return {
      initialized: false,
      gauth: {
        isSignedIn: {
          get: () => false,
        },
      },
      settings: {
        SS_ID: localGet("SS_ID"),
        indent: localGet("indent"),
        url: localGet("url"),
        index: localGet("index"),
        data: localGet("data"),
        debug: false,
      },
    };
  },
  computed: {
    cap: () => true,
    signIn() {
      var status = this.gauth.isSignedIn.get();
      return status;
    },
  },
  beforeCreate() {},
  created() {},
  mounted() {
    console.log("location: ", location.href);
  },
  methods: {
    startMonitoring(gauth) {
      this.initialized = true;
      if ("isSignedIn" in gauth) {
        this.$set(this, "gauth", gauth);
      }
    },
    token() {
      this.$set(this.gauth.isSignedIn, "get", () => true);
      setTimeout(
        () => this.$set(this.gauth.isSignedIn, "get", () => false),
        3600 * 1000
      );
    },
  },
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
