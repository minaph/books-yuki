<template>
  <!-- Reviewed: 2020/07/20 -->
  <ion-button @click="openModal">設定</ion-button>
</template>

<script>
import { modalController } from "@ionic/core";
import SettingModal from "./SettingModal";
export default {
  name: "SettingModalButton",
  props: {
    settings: Object,
    gauth: Object,
    cap: Boolean
  },
  methods: {
    openModal() {
      return this.$ionic.modalController
        .create({
          component: SettingModal,
          componentProps: {
            propsData: {
              settings: this.settings,
              gauth: this.gauth,
              cap: this.cap
            }
          }
        })
        .then(m => m.present());
    }
  }
};
</script>

<style>
</style>

