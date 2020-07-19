<template>
  <!-- reviewed: 2020/07/19 -->
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="save">一時保存</ion-button>
        </ion-buttons>
        <ion-title>目次の編集</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="done">完了</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-textarea :value="text" auto-grow autofocus @ionChange="edit($event)" />
    </ion-content>
  </div>
</template>

<script>
import textParser from "../components/parser.js"

export default {
  name: "EditModal",
  data() {
    return {
      text: localStorage.getItem("indexText") || ""
    };
  },
  props: {
    indent: String,
    titles: Array,
    indexes: Object,
    title: Array,
  },
  methods: {
    edit(ev) {
      this.text = ev.target.value;
    },
    save() {
      localStorage.setItem("indexText", this.text);
      this.$ionic.modalController.dismiss();
    },
    done() {
      var indexText = this.text;
      if (typeof indexText !== "undefined" && indexText !== "") {
        localStorage.removeItem("title");
        localStorage.removeItem("indexText")
        indexText = indexText.split("\n");
        this.$set(this.titles, this.titles.length, this.title[0]);
        this.$set(this.indexes, this.title[0], textParser(indexText, this.indent));
        // this.title[0] = null;
        this.$set(this.title, 0, null)
      } else {
        console.info("目次が無効です。");
      }
      this.$ionic.modalController.dismiss();
    }
  }
};
</script>

<style scoped>
ion-textarea{
  height: 85%;
}
</style>