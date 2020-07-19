<template>
  <!-- Reviewed: 2020/07/19 -->
  <ion-button @click="fullscreen()">fullscreen</ion-button>
</template>

<script>
export default {
  name: "FullScreenButton",
  methods: {
    confirmFullScreen() {
      if (
        confirm(
          "フルスクリーンにしますか？ 特にスマホの方にはフルスクリーンをおすすめします。左上のFullscreenボタンからいつでも元に戻せます。"
        )
      ) {
        this.fullscreen();
      }
    },
    fullscreen() {
      console.log("Fullscreen");
      (function() {
        var doc = window.document;
        var docEl = doc.documentElement;
        var requestFullScreen =
          docEl.requestFullscreen ||
          docEl.mozRequestFullScreen ||
          docEl.webkitRequestFullScreen ||
          docEl.msRequestFullscreen;
        var cancelFullScreen =
          doc.exitFullscreen ||
          doc.mozCancelFullScreen ||
          doc.webkitExitFullscreen ||
          doc.msExitFullscreen;
        if (
          !doc.fullscreenElement &&
          !doc.mozFullScreenElement &&
          !doc.webkitFullscreenElement &&
          !doc.msFullscreenElement
        ) {
          requestFullScreen.call(docEl);
        } else {
          cancelFullScreen.call(doc);
        }
      })();
    },
  },
};
</script>

<style></style>
