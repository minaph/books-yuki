<template>
  <div class="setting-modal">
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>設定</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="dismissModal()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <ion-item>
        <ion-label>SpreadSheet URL</ion-label>
        <!-- <ion-chip id="url" @click="descriptionPopover" outline>?</ion-chip> -->
        <HintChip :description="url" />
        <ion-input
          clear-input
          inputmode="url"
          :value="settings.url"
          @ionChange="editUrl($event)"
        />
      </ion-item>
      <ion-item>
        <ion-label>データシート名</ion-label>
        <HintChip :description="data" />
        <ion-input clear-input :value="settings.data" @ionChange="editData" />
      </ion-item>
      <ion-item>
        <ion-label>インデックスシート名</ion-label>
        <!-- <ion-chip id="index" @click="descriptionPopover" outline>?</ion-chip> -->
        <HintChip :description="index" />
        <ion-input clear-input :value="settings.index" @ionChange="editIndex" />
      </ion-item>
      <ion-item>
        <ion-label>インデント文字</ion-label>
        <HintChip :description="indent" />
        <ion-input
          clear-input
          :value="settings.indent"
          @ionChange="editIndent"
        />
      </ion-item>
      <ion-item>
        <ion-label>Googleからログアウトする</ion-label>
        <ion-button @click="logout">Log out</ion-button>
      </ion-item>
      <ion-item>
        <ion-label>設定を初期化する</ion-label>
        <ion-button @click="reset">reset</ion-button>
      </ion-item>
      <ion-item>
        <ion-label>デバッグモード</ion-label>
        <ion-toggle @ionChange="debugmode($event)" :checked="settings.debug" />
      </ion-item>
    </ion-content>
  </div>
</template>
<script>
import HintChip from "../components/HintChip";
import HintChipIndentDesc from "../components/HintChipIndentDesc";
import HintChipUrlDesc from "../components/HintChipUrlDesc";
import HintChipIndexDesc from "../components/HintChipIndexDesc";
import HintChipDataDesc from "../components/HintChipDataDesc";
import "@codetrix-studio/capacitor-google-auth";
import { Plugins } from "@capacitor/core";
export default {
  name: "SettingModal",
  props: {
    settings: Object,
    gauth: Object,
    cap: Boolean,
  },
  components: {
    HintChip,
  },
  data() {
    return {
      indent: HintChipIndentDesc,
      url: HintChipUrlDesc,
      index: HintChipIndexDesc,
      data: HintChipDataDesc,
    };
  },
  computed: {
    url2id() {
      var SS_ID = this.settings.url.match(
        /(?<=docs.google.com\/spreadsheets\/d\/)[a-zA-Z0-9\-_]+/
      );
      return SS_ID;
    },
  },
  methods: {
    dismissModal() {
      ["url", "data", "index", "indent"].forEach((x) => {
        localStorage.setItem(x, this.settings[x]);
      });
      localStorage.setItem("SS_ID", this.url2id);
      console.log(localStorage);
      this.$ionic.modalController.dismiss();
      // localStorage
    },
    editUrl(event) {
      // console.log(this.settings);
      // console.log(event.target.value);
      this.$set(this.settings, "url", event.target.value);
    },
    editData(event) {
      // console.log(this.settings);
      // console.log(event.target.value);
      this.$set(this.settings, "data", event.target.value);
    },
    editIndent(event) {
      // console.log(this.settings);
      // console.log(event.target.value);
      this.$set(this.settings, "indent", event.target.value);
    },
    editIndex(event) {
      // console.log(this.settings);
      // console.log(event.target.value);
      this.$set(this.settings, "index", event.target.value);
    },
    logout() {
      if (this.cap) {
        Plugins.GoogleAuth.signOut()
      } else {
        this.gauth.signOut();
      }
    },
    reset() {
      this.logout();
      localStorage.clear();
      sessionStorage.clear();
      ["url", "SS_ID", "data", "index", "indent"].forEach((x) => {
        this.$set(this.settings, x, "");
      });
      console.info("Data cleaned up");
    },
    debugmode(event) {
      this.$set(this.settings, "debug", event.target.checked);
    },
  },
};
</script>

<style scoped></style>
