<template>
  <ion-item lines="full" :style="itemStyle" color="light">
    <!-- <ion-label position="stacked">読書メモ</ion-label> -->
    <ion-textarea
      :value="comment"
      auto-grow
      @ionFocus="focus()"
      @ionChange="changeComments($event)"
      @ionBlur="blur($event)"
      :style="textareaStyle"
      @click="handleClick($event)"
      placeholder="読書メモ"
      ref="textarea"
    />
  </ion-item>
</template>

<script>
export default {
  name: "FlexInput",
  props: {
    comment: String,
  },
  data() {
    return {
      marginTop: 8,
      marginBottom: 20,
      paddingTop: 8,
      paddingBottom: 8,
      writable: 59,
    };
  },
  computed: {
    itemStyle() {
      return {
        height: this.wholeHeight,
      };
    },
    wholeHeight() {
      return [
        "marginTop",
        "marginBottom",
        "paddingTop",
        "paddingBottom",
        "writable2",
      ].reduce((a, b) => a + this[b], 0);
    },
    textareaStyle() {
      return {
        "margin-top": this.marginTop,
        "margin-bottom": this.marginBottom,
        height: this.writable2 + this.paddingTop + this.paddingBottom,
        "--padding-top": this.paddingTop,
        "--padding-bottom": this.paddingBottom,
      };
    },
    writable2() {
      if (this.writable > 59) {
        return this.writable;
      }
      return 59;
    },
  },
  activated() {
    // var height = this.$refs.textarea.style.height;
    // height = Number.parseInt(height.slice(0, height.length - 2));
    // if (height <= this.$refs.textarea.scrollHeight) {
    //   this.$refs.textarea.style.height = this.$refs.textarea.scrollHeight;
    // }
  },
  methods: {
    changeComments(event) {
      var comment = event.target.value;
      // this.children.comment = comment;
      // console.log(event.target);
      this.writable =
        event.target.children[0].scrollHeight -
        this.paddingTop -
        this.paddingBottom;

      console.log("Comments changed: " + comment);
      this.$emit("edited", comment);
    },
    focus() {
      this.writable =
        event.target.children[0].scrollHeight -
        this.paddingTop -
        this.paddingBottom;
      console.group();
    },
    blur(ev) {
      if (ev.target.tagName.includes("TEXTAREA") && this.writable > 59) {
        this.writable = 59;
      }
      console.groupEnd();
    },
    handleClick(ev) {
      console.log(ev.target);
      if (ev.target.tagName === "ION-TEXTAREA") {
        ev.target.children[0].click();
      } else if (
        ev.target.tagName === "TEXTAREA" &&
        ev.target.style.height !== ev.target.scrollHeight + "px"
      ) {
        ev.target.style.height = ev.target.scrollHeight + "px";
        ev.target.focus();
      }
    },
  },
};
</script>

<style scoped></style>
