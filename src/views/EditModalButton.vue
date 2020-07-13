<template>
  <ion-button @click="registerButton[1]()">{{registerButton[0]}}</ion-button>
</template>

<script>
import { modalController } from "@ionic/core";
import EditModal from "./EditModal";
export default {
  name: "EditModalButton",
  props: {
    indent: String,
    titles: Array,
    indexes: Object
  },
  data() {
    return {
      title: [localStorage.getItem("title")]
    };
  },
  computed: {
    registerButton() {
      let ans = new Object();
      var vm = this;
      if (vm.title[0] === null) {
        ans["本を登録する"] = function() {
          vm.$set(this.title, 0, prompt("書の題名"));
          if (typeof vm.title[0] !== "undefined" && vm.title[0] !== "") {
            localStorage.setItem("title", vm.title[0]);
          } else {
            console.info("タイトルが無効です。");
          }
        };
      } else {
        ans[vm.title[0]] = this.openModal;
      }
      return Object.entries(ans)[0];
    }
  },
  methods: {
    openModal() {
      return this.$ionic.modalController
        .create({
          component: EditModal,
          componentProps: {
            propsData: {
              indent: this.indent,
              titles: this.titles,
              indexes: this.indexes,
              title: this.title
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

