<template>
  <div>
    <loading :load="load" :text="loadingText" @present="load = false" />
    <ion-button @click="updateFlag = true" fill="clear">{{
      buttonLabel
    }}</ion-button>
    <SpreadSheet :requests="req" />
  </div>
</template>

<script>
import loading from "./loading.vue";
import SpreadSheet from "./SpreadSheet.vue";
export default {
  name: "SaveButton",
  components: {
    loading,
    SpreadSheet,
  },
  data() {
    return {
      updateFlag: false,
      buttonLabel: "保存",
      load: false,
      loadingText: "お待ち下さい...",
      save: false,
    };
  },
  props: {
    requests: Array,
  },
  computed: {
    req() {
      var req = [];
      this.requests.forEach((x) => {
        req.push(Object.assign({}, x, { send: this.save }));
      });
      return req;
    },
  },
  watch: {
    updateFlag: {
      handler: function(val) {
        if (val) {
          this.$emit("will-save");
          this.updateFlag = false;
          this.buttonLabel = "データを送信中...";
          this.loadingText = "スプレッドシートに" + this.buttonLabel;
          this.load = true;

          var vm = this;
          var f = this.requests[this.requests.length - 1].onsucceeded;
          this.$set(
            this.requests[this.requests.length - 1],
            "onsucceeded",
            function() {
              f();
              vm.save = false;
              vm.buttonLabel = "保存";
              vm.$ionic.loadingController.dismiss();
              vm.$emit("did-save");
            }
          );
          this.save = true;

          // this.requests[this.requests.length - 1].onsucceeded = function() {
          //   f(x);
          //   vm.buttonLabel = "保存";
          //   vm.$ionic.loadingController.dismiss();
          //   vm.$emit("did-save");
          // };
          // this.requests.forEach(function(r, i) {
          //   // x.send = true;
          //   vm.requests[i].send = true;
          //   // vm.$set(vm.requests[i], "send", true);
          // });
        }
      },
      immediate: false,
    },
    // requests:{
    //   handler(){
    //     console.log("cloning")
    //     var vm = this
    //     this.requests.forEach(function(v,i){
    //       vm.$set(vm.cloned, i, v);
    //     })
    //   },
    //   deep: true
    // }
  },
  methods: {
    handler(e) {
      this.$emit("error", e);
    },
  },
};
</script>

<style scoped></style>
