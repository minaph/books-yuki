<template>
  <div class="home">
    <loading :load="load" :text="loadingText" @present="load=false" />
    <div>
      <ion-button @click="registerButton[1]()">{{registerButton[0]}}</ion-button>
      <ion-button @click="updateFlag = true">保存</ion-button>
      <ion-reorder-group @ionItemReorder="doReorder($event)" disabled="false">
        <tree
          v-for="name in titles"
          :key="name + Object.keys(indexes[name]).length"
          :content="name"
          :children="indexes[name]"
        >
          <ion-reorder v-on:click.prevent />
        </tree>
      </ion-reorder-group>
    </div>
  </div>
</template>

<script>
function requestObject(
  m = "",
  p = new Object(),
  c = function() {},
  v = new Array(),
  md = "RAWS"
) {
  return {
    method: m,
    params: p,
    callBack: c,
    values: v,
    majorDimension: md
  };
}

function A1(n, start = "A") {
  // Aを0としたときのアルファベット表示
  var a = Math.ceil((n + 1) / 26);
  var result = "";
  var _n = n + 1;
  for (var i = a; i > 0; i--) {
    result += String.fromCodePoint(
      Math.floor(_n / 26 ** (i - 1)) + start.charCodeAt(0) - 1
    );
    _n = _n % 26 ** (i - 1);
  }
  return result;
}

function textParser(textArray, indent) {
  var c = new Object();
  var log = [];
  var b = textArray;
  for (var i = 0; i < b.length; i++) {
    var d = b[i];
    var log_index = 0;
    var parent = c;
    while (d[0] === indent) {
      d = d.slice(1);
      parent = parent[log[log_index]];
      if (typeof parent === "undefined") {
        debugger;
      }
      log_index++;
    }
    if (d[0] === "_") {
      parent["comment"] = d.slice(1);
    } else {
      if (!("comment" in parent)) {
        parent["comment"] = "";
      }
      while (typeof parent[d] !== "undefined") {
        console.info("目次の重複を検出（上書きを回避しました）：" + d);
        d += " ";
      }
      parent[d] = new Object();
      log[log_index] = d;
    }
  }
  return c;
}
function arrayMaker(o, indent, spaces = "") {
  var list = Object.keys(o);
  var ans = [];
  var s = spaces + indent;
  for (var t = 0; t < list.length; t++) {
    var z = 0;
    if (spaces === "") {
      z = 0;
    }
    if (list[t] === "comment") {
      ans.push(spaces.slice(z) + "_" + o[list[t]]);
      continue;
    }
    ans.push((spaces + list[t]).slice(z));
    ans.push(...arrayMaker(o[list[t]], indent, s));
  }
  return ans;
}

// import Tree from "./Tree.vue";
import Tree from "../components/TreeF";
import loading from "../components/loading.vue";
export default {
  name: "Home",
  components: {
    Tree,
    loading
  },
  props: {
    signIn: {
      default: false
    }
  },
  data() {
    return {
      title: sessionStorage.getItem("title"),
      titles: new Array(),
      indexes: new Object(),
      SS_ID: window.localStorage.getItem("SS_ID"),
      indent: window.localStorage.getItem("indent"),
      request: requestObject(),
      updateFlag: false,
      load: false,
      loadingText: "目次データをロードしています"
    };
  },
  computed: {
    registerButton() {
      let ans = new Object();
      var vm = this;
      if (vm.title === null) {
        ans["本を登録する"] = function() {
          vm.title = prompt("書の題名");
          if (typeof vm.title !== "undefined" && vm.title !== "") {
            sessionStorage.setItem("title", vm.title);
            vm.title = sessionStorage.getItem("title");
          } else {
            console.info("タイトルが無効です。");
          }
        };
      } else {
        ans[vm.title] = function() {
          var indexText = prompt("目次一覧");
          if (typeof indexText !== "undefined" && indexText !== "") {
            sessionStorage.removeItem("title");
            indexText = indexText.split("\n");
            vm.$set(vm.titles, vm.titles.length, vm.title);
            vm.$set(vm.indexes, vm.title, textParser(indexText, vm.indent));
            vm.title = sessionStorage.getItem("title");
          } else {
            console.info("目次が無効です。");
          }
        };
      }
      return Object.entries(ans)[0];
    }
  },
  created() {
    window.addEventListener("beforeunload", event => {
      // Cancel the event as stated by the standard.
      event.preventDefault();
      // Chrome requires returnValue to be set.
      event.returnValue =
        "保存されていないデータは消去されます。よろしいですか？";
    });
  },
  watch: {
    signIn: {
      handler: function(val, old) {
        if (this.SS_ID === null || this.indent === null) {
          [
            "説明(1/4)\nようこそ。\nこれは、読んだ本の目次にメモをつけ、見やすく保管するためのサービスです。\n現時点では、製作者である美濃佑輝の善意によって運営されています。",
            "説明(2/4)\n以下をご用意ください。\n\nインデント付き目次データ（インデント文字はなんでもよい）\nデータ保管用スプレッドシートのURL",
            "説明(3/4)\nインデント付き目次データの例（インデント文字が「　（全角スペース）」の場合）\n\n1. このサービスの趣旨\n　1.1 必要なもの\n　1.2 目次データの例\n2. 初期設定\n　2.1 スプレッドシート登録\n　2.2 インデント文字の登録",
            "説明(4/4)\n以上で説明を終わります。\nこの説明を読み直したい、または初期設定をやり直したい場合は、右上の「初期設定」ボタンを押してください。"
          ].forEach(alert);
        }
        if (this.SS_ID === null) {
          var url = prompt(
            "初期設定\nデータ保存用のスプレッドシートのURLを入力してください\n現在、どのシートに保存するかは変更できません。"
          );
          if (typeof url !== "undefined" && url !== "") {
            this.SS_ID = url.match(
              /(?<=docs.google.com\/spreadsheets\/d\/)[a-zA-Z0-9\-_]+/
            );
            console.info("スプレッドシートID：" + this.SS_ID);
            window.localStorage.setItem("SS_ID", this.SS_ID);
          } else {
            console.info("無効なURLです。");
          }
        }
        if (this.indent === null) {
          var indent = prompt(
            '初期設定\n目次のインデント文字を指定してください。\nタブを入力する場合は、"tab"と入力してください。\nバックスラッシュによるエスケープ文字も利用可能です。'
          );
          if (typeof indent !== "undefined" && indent !== "") {
            if (indent === "tab") {
              indent = "\t";
            }
            this.indent = indent;
            console.info("インデント：" + this.indent);
            window.localStorage.setItem("indent", this.indent);
          } else {
            console.info("無効なインデント文字です。");
          }
        }

        if (val) {
          this.load = true;

          var params = {
            spreadsheetId: this.SS_ID,
            range: "1:1"
            // valueRenderOption: "",
          };
          var vm = this;
          var f = function(data) {
            console.log("got titles: " + data[0]);
            console.assert(
              typeof data === "object" && typeof data[0] !== "undefined",
              "data should be an array but " + typeof data
            );
            console.assert(
              typeof vm.titles === "object" && vm.titles !== null,
              "titles are null"
            );
            data[0].forEach(function(x) {
              vm.$set(vm.indexes, x, new Object());
            });
            vm.$set(vm, "titles", data[0]);
            loadIndexes();
          };
          this.request = requestObject("get", params, f);

          function loadIndexes() {
            console.log("loadIndexes");
            console.log(vm.titles);
            var params = {
              spreadsheetId: vm.SS_ID,
              range: "A:" + A1(vm.titles.length - 1),
              majorDimension: "COLUMNS"
              // valueRenderOption: "",
            };
            function f(data) {
              for (var _i = 0; _i < data.length; _i++) {
                vm.$set(
                  vm.indexes,
                  data[_i][0],
                  textParser(data[_i].slice(1), vm.indent)
                );
              }
              console.log("Indexing complete!");
              console.log(vm.indexes);
              // console.log(dismiss)
              // debugger;
              vm.$ionic.loadingController.dismiss();
            }
            vm.request = requestObject("get", params, f);
          }
        }
      },
      immediate: false
    },
    request: {
      handler: function(val, old) {
        let request;
        switch (val.method) {
          case "get":
            request = gapi.client.sheets.spreadsheets.values.get(val.params);
            request.then(
              function(response) {
                // debugger;
                console.log(response);
                val.callBack(response.result.values || response);
              },
              function(reason) {
                console.error("error: " + reason.result.error.message);
              }
            );
            break;
          case "set":
            var valueRangeBody = {
              range: val.params["range"],
              values: val.values,
              majorDimension: val.majorDimension
            };
            request = gapi.client.sheets.spreadsheets.values.update(
              val.params,
              valueRangeBody
            );
            request.then(
              function(response) {
                val.callBack(response);
                console.log(response.result);
              },
              function(reason) {
                console.error("error: " + reason.result.error.message);
              }
            );
            break;
          default:
            break;
        }
      },
      deep: false,
      immediate: false
    },
    updateFlag: {
      handler: function(val, old) {
        if (val) {
          this.updateFlag = false;

          var params = {
            spreadsheetId: this.SS_ID,
            range: "A:" + A1(this.titles.length - 1),
            valueInputOption: "RAW"
          };
          var values = [];
          var list = Object.keys(this.indexes);
          for (var k = 0; k < list.length; k++) {
            var arr = [];
            arr.push(list[k]);
            arr.push(...arrayMaker(this.indexes[list[k]], this.indent));
            values.push(arr);
          }
          console.log(values);
          this.request = requestObject(
            "set",
            params,
            function() {},
            values,
            "COLUMNS"
          );
        }
      },
      immediate: false
    }
  },
  methods: {
    doReorder(event) {
      // this.titles[event.detail.from], this.titles[event.detail.to] = this.titles[event.detail.to], this.titles[event.detail.from]
      // this.indexes[event.detail.from], this.indexes[event.detail.to] = this.indexes[event.detail.to], this.indexes[event.detail.from]

      var changed = event.detail.complete(this.titles);
      for (var i = 0; i < changed.length; i++) {
        if (changed[i] !== this.titles[i]) {
          this.$set(this.titles, i, changed[i]);
        }
      }
    }
  },
  beforeDestroy() {
    if (confirm("作業内容を保存しますか？")) {
      this.updateFlag = true;
    }
  }
};
</script>

<style scoped>
ion-reorder {
  float: right;
  padding-right: 10px;
}
</style>