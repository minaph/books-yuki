<template>
  <!-- done -->
  <ion-app>
    <vue-gapi @initGapi="startMonitoring" :cap="cap" />
    <!--　Todo: ここからHomeへ -->
    <ion-toolbar> 
      <ion-title>books</ion-title>
      <ion-buttons slot="end">
        <login-button
          v-show="initialized && !signIn"
          :gauth="gauth"
          :cap="cap"
        />
        <FullScreenButton />
        <SettingModalButton :settings="settings" :gauth="gauth" :cap="cap" />
      </ion-buttons>
    </ion-toolbar>

    <ion-content>
      <Home :signIn="signIn" :settings="settings" />
    </ion-content>
    <!-- ここまで -->
  </ion-app>
</template>

<script>
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
        SS_ID: window.localStorage.getItem("SS_ID"),
        indent: window.localStorage.getItem("indent"),
        url: window.localStorage.getItem("url"),
        index: window.localStorage.getItem("index"),
        data: window.localStorage.getItem("data"),
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
