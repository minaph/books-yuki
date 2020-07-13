<template>
  <ion-button @click="openModal">設定</ion-button>
</template>

<script>
import { modalController } from "@ionic/core";
import SettingModal from "./SettingModal";
export default {
  name: "SettingModalButton",
  props: {
    settings: Object,
    gauth: Object
  },
  methods: {
    openModal() {
      return this.$ionic.modalController
        .create({
          component: SettingModal,
          componentProps: {
            propsData: {
              settings: this.settings,
              gauth: this.gauth
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

