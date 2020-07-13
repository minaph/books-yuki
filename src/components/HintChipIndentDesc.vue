<template>
  <ion-card>
    <!-- {{text}} -->
    <ion-card-header>
      <ion-card-title>インデント文字</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      目次データの先頭につく、階層を表す記号のことです。
      <br />インデント文字はなんでも可能です。
      <br />一部の文字は直接入力できませんが、エスケープ文字列が利用できます。
      <a
        href="https://www.javadrive.jp/javascript/num/index2.html#aswift_0:~:text=%E3%82%A8%E3%82%B9%E3%82%B1%E3%83%BC%E3%83%97%E3%82%B7%E3%83%BC%E3%82%B1%E3%83%B3%E3%82%B9%E3%81%AE%E4%B8%80%E8%A6%A7"
        target="_blank"
      >エスケープ文字とは？（外部リンク）</a>
    </ion-card-content>
    <ion-list>
      <ion-list-header>
        <ion-label>インデント文字の例（インデント文字が「 （全角スペース）」の場合）</ion-label>
      </ion-list-header>
      <ion-item v-for="text in texts" :key="text">
        <ion-label>{{text}}</ion-label>
      </ion-item>
    </ion-list>
  </ion-card>
</template>

<script>
export default {
  name: "DataDesc",
  // props: {
  //   text: String
  // }
  data() {
    return {
      texts: [
        "1. このサービスの趣旨",
        "　1.1 必要なもの",
        "　1.2 目次データの例",
        "2. 初期設定",
        "　2.1 スプレッドシート登録",
        "　2.2 インデント文字の登録"
      ]
    };
  }
};
</script>

<style scoped>
ion-card {
  margin: 2px;
}
</style>