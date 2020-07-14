<template>
  <ion-app>
    <vue-gapi @initGapi="startMonitoring" :cap="cap" />
    <ion-toolbar>
      <ion-buttons slot="start"> </ion-buttons>
      <ion-buttons>
        <ion-button @click="">並び替え</ion-button>
        <ion-button @click="">Todoリストに送信</ion-button>
      </ion-buttons>
      <ion-title>books</ion-title>
      <ion-buttons slot="end">
        <!-- <ion-button @click="fullscreen()">fullscreen</ion-button> -->
        <FullScreenButton />
        <SettingModalButton
          :settings="settings()"
          :gauth="gauth"
          :cap="cap"
        />
      </ion-buttons>
    </ion-toolbar>
    <ion-content>
      <!-- <ion-button size="small" v-show="signIn" @click="$set(Google,'signOut', true)">Sign Out</ion-button> -->
      <login-button
        v-show="initialized && !signIn()"
        :gauth="gauth"
        :cap="cap"
        @initGapi="startMonitoring"
      />
      <Home :signIn="signIn()" ref="home" />
    </ion-content>
  </ion-app>
</template>

<script>
require("dotenv").config();
import Home from "./views/Home.vue";
import loginButton from "./components/loginButton";
import vueGapi from "./components/gapi";
import vueGapiCapacitor from "./components/gapiCapacitor.vue";
import SettingModalButton from "./views/SettingModalButton";
import FullScreenButton from "./components/FullScreenButton"
export default {
  name: "App",
  components: {
    Home,
    loginButton,
    vueGapi,
    vueGapiCapacitor,
    SettingModalButton,
    FullScreenButton
  },
  data() {
    return {
      initialized: false,
      gauth: {},
    };
  },
  computed: {
    cap: () => true,
  },
  beforeCreate() {},
  created() {},
  mounted() {
    console.log("location: ", location.href);
  },
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
          indent: "",
        };
      }
      return this.$refs.home.settings;
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
