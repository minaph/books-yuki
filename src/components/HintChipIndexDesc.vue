<template>
  <!-- Reviewed: 2020/07/20 -->
  <ion-card>
    <ion-card-header>
      <ion-card-title>インデックスシート名</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      あなたの目次の並び替えデータを保存します。URL欄で記入したスプレッドシートの中にあるシートのうち、並び替えデータを保存したいシート名を記入してください。
      <br />データシートと同じではいけません。また、存在しないシート名でもいけません。
      <br />やり方がわからない方は、スプレッドシートで新しくシートを作成し、その名前を記入しておけば大丈夫です。
      <a
        href="https://www.google.com/intl/ja_jp/sheets/about/"
        target="_blank"
      >Google スプレッドシートのトップページ</a>
    </ion-card-content>
  </ion-card>
</template>

<script>
export default {
  name: "DataDesc"
};
</script>

<style scoped>
ion-card {
  margin: 2px;
}
</style>