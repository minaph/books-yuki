<template>
  <!-- Reviewed: 2020/07/20 -->
  <ion-card>
    <ion-card-header>
      <ion-card-title>SpreadSheet URL</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      目次データを保存するGoogle スプレッドシートのURLです。ここにあなたのデータを保存します。
      <br />ログインするアカウントが編集権を持っているスプレッドシートのURLを記入してください。
      <br />やり方がわからない方は、下のリンクから新しくスプレッドシートを作成し、そのURLを記入しておけばOKです。
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