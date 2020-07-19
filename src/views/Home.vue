<template>
  <!-- Reviewed : 2020/07/19 -->
  <div class="home">
    <SpreadSheet
      v-bind="ss"
      @send="ss.send = false"
      @get="ssActions.get"
      @set="ssActions.set"
      @error="handler"
    />
    <loading :load="load" :text="loadingText" @present="load = false" />
    <div>
      <ion-toolbar color="light">
        <ion-buttons>
          <EditModalButton
            :titles="titles"
            :indexes="indexes"
            :indent="settings.indent"
          />
          <!-- Todo: コンポーネント化 -->
          <ion-button @click="updateFlag = true" fill="clear">{{
            buttonLabel
          }}</ion-button>
          <!-- コンポーネント化ここまで -->
          <SelectButton title="モード選択" :choices="choices" />
        </ion-buttons>
      </ion-toolbar>
      <br />
      <!-- <span ref="error"></span> -->
      <DebugSpan :text="errorText" :debug="settings.debug" />
      <!-- Todo: reorder分離 -->
      <ion-reorder-group @ionItemReorder="doReorder($event)" disabled="false">
        <tree
          v-for="name in titles"
          :key="name + Object.keys(indexes[name]).length"
          :class="name"
          :content="name"
          :children="indexes[name]"
          @open.self="updateTarget"
          v-show="target[0] || target[1].includes(name)"
        >
          <ion-reorder v-on:click.prevent />
        </tree>
      </ion-reorder-group>
      <!-- Reorder分離ここまで -->
    </div>
  </div>
</template>

<script>
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

var intro = `このイントロダクションは、初期設定が終わっていない方、取得データが空っぽだった方に表示しています。
サイトの概要
　このサイトは、このような形式で目次とそのメモを保存し、読んだ本の内容を効率よく覚えておこう、かんたんに見返せるようにしようというサービスです。
　このサイトは、発案者の美濃佑輝が製作・運営しています。
　　作者Twitter: https://twitter.com/AlphaMinaph
使い方
　画面右上の「設定」ボタンから各種の設定を行ってください。
　　設定欄のすぐそばに解説ボタンがありますのでぜひご覧ください。
　画面の左上にある「本の登録」ボタンから目次の編集ページが開きます。
　　必ずしもなくても使えますが、ぜひインデント文字を使って目次の階層構造を記述してみてください。
　　階層構造を記録しておくと、あなたが今ご覧になっているように、細かい目次を隠しておくことができます。
　　　インデント文字の解説は右上の「設定」ボタンのインデント文字の欄に掲載しています。
　　目次は下書き保存も可能です。
　登録した目次は「保存」ボタンでデータを保存するのをわすれないでください。
その他の機能
　目次タイトル右側のアイコンをドラッグすることで、順番を変更できます。
　あなたのデータは（下書きを除いて）あなたの登録したスプレッドシートに保管されています。
　製作予定の機能
　　目次をGoogle todoリストに登録する機能。`.split("\n");

// import Tree from "./Tree.vue";
import Tree from "../components/Tree";
import loading from "../components/loading.vue";
import SpreadSheet from "../components/SpreadSheet.vue";
import EditModalButton from "./EditModalButton";
import DebugSpan from "../components/DebugSpan";
import textParser from "../components/parser.js";
import SelectButton from "../components/SelectButton";

export default {
  name: "Home",
  components: {
    Tree,
    loading,
    SpreadSheet,
    EditModalButton,
    DebugSpan,
    SelectButton,
  },
  props: {
    signIn: {
      default: false,
    },
    settings: Object,
  },
  data() {
    return {
      mode: "",
      target: [true, {}],
      editIndexText: false,
      titles: new Array(),
      indexes: new Object(),
      
      updateFlag: false,
      load: false,
      loadingText: "目次データをロードしています",
      ss: {
        method: "",
        params: {},
        values: [],
        majorDimension: "",
        send: false,
      },
      ssActions: {
        get: () => {},
        set: () => {},
      },
      buttonLabel: "保存",
      errorText: "",
    };
  },
  computed: {
    valuesArray() {
      var values = [];
      var list = Object.keys(this.indexes);
      for (var k = 0; k < list.length; k++) {
        var arr = [];
        arr.push(list[k]);
        arr.push(...arrayMaker(this.indexes[list[k]], this.settings.indent));
        values.push(arr);
      }
      return values;
    },
    choices: () => ["デフォルト", "削除モード", "Todoリストに共有", "並び替え"],
    isBeginner() {
      var vm = this;
      return !Object.keys(this.settings).reduce(function(a, b) {
        return a && ["string", "boolean"].includes(typeof vm.settings[b]);
      });
    },
  },
  created() {
    // Todo: 別コンポーネント化
    window.addEventListener("beforeunload", (event) => {
      // Cancel the event as stated by the standard.
      event.preventDefault();
      // Chrome requires returnValue to be set.
      event.returnValue =
        "保存されていないデータは消去されます。よろしいですか？";
    });
    // コンポーネント分離ここまで
    // console.log = this.handler
  },
  watch: {
    signIn: {
      handler: function(val, old) {
        var vm = this;

        if (val && !this.isBeginner) {
          this.load = true;
          this.ss.method = "get";
          this.ss.params = {
            spreadsheetId: this.settings.SS_ID,
            range: "'" + this.settings.index + "'!" + "A:A",
            majorDimension: "COLUMNS",
            // valueRenderOption: "",
          };
          this.ssActions.get = function(data) {
            console.log("got titles: " + JSON.stringify(data));
            var nodata =
              !Array.isArray(data) || data.length === 0 || data[0].length === 0;
            if (nodata) {
              initIndex(parseData);
            } else {
              parseData(data);
            }
          };
          // this.request = requestObject("get", params, f);
          this.ss.send = true;
        } else {
          this.$set(this.titles, 0, "サイトの使い方（ここをクリック！）");
          this.$set(
            this.indexes,
            "サイトの使い方（ここをクリック！）",
            textParser(intro, "　")
          );
        }

        function parseData(data) {
          // data = data.map(x=>x[0])
          data[0].forEach(function(x) {
            vm.$set(vm.indexes, x, new Object());
          });
          vm.$set(vm, "titles", data[0]);
          loadIndexes();
        }

        function loadIndexes() {
          // debugger;
          console.log("loadIndexes");
          vm.ss.params = {
            spreadsheetId: vm.settings.SS_ID,
            range: "'" + vm.settings.data + "'!" + "A:" + A1(vm.titles.length),
            majorDimension: "COLUMNS",
            // valueRenderOption: "",
          };
          vm.ssActions.get = function f(data) {
            for (var _i = 0; _i < data.length; _i++) {
              vm.$set(
                vm.indexes,
                data[_i][0],
                textParser(data[_i].slice(1), vm.settings.indent)
              );
            }
            console.log("Indexing complete!");
            console.log(vm.indexes);
            // console.log(dismiss)
            // debugger;
            vm.$ionic.loadingController.dismiss();
          };
          // vm.request = requestObject("get", params, f);
          vm.ss.send = true;
        }

        function initIndex(f) {
          console.log("No index data available");
          vm.ss.method = "get";
          vm.ss.params = {
            spreadsheetId: vm.settings.SS_ID,
            range: "'" + vm.settings.data + "'!" + "1:1",
            // valueRenderOption: "",
          };
          vm.ssActions.get = function(data) {
            var nodata =
              !Array.isArray(data) || data.length === 0 || data[0].length === 0;
            if (nodata) {
              console.log("Your data is empty");
              data = [[]];
              vm.$ionic.loadingController.dismiss();
            } else {
              console.log("got titles: " + data[0]);
              f(data);
            }
          };
          vm.ss.send = true;
        }
      },
      immediate: true,
    },
    // request: {

    //   deep: false,
    //   immediate: false
    // },
    updateFlag: {
      handler: function(val, old) {
        if (val) {
          this.updateFlag = false;
          this.buttonLabel = "スプレッドシートにデータを送信中...";
          this.loadingText = this.buttonLabel;
          this.load = true;

          this.ss.method = "set";
          this.ss.params = {
            spreadsheetId: this.settings.SS_ID,
            range:
              "'" + this.settings.data + "'!" + "A:" + A1(this.titles.length),
            valueInputOption: "RAW",
          };
          this.ss.values = this.valuesArray;
          console.log(this.ss.values);
          this.ss.majorDimension = "COLUMNS";
          var vm = this;
          this.ssActions.set = updateIndex;
          this.ss.send = true;

          function updateIndex() {
            vm.ss.method = "set";
            vm.ss.params = {
              spreadsheetId: vm.settings.SS_ID,
              range: "'" + vm.settings.index + "'!" + "A:A",
              valueInputOption: "RAW",
            };
            vm.ss.values = [vm.titles];
            console.log(vm.ss.values);
            vm.ss.majorDimension = "COLUMNS";
            vm.ssActions.set = function() {
              vm.buttonLabel = "保存";
              vm.$ionic.loadingController.dismiss();
            };
            vm.ss.send = true;
          }
        }
      },
      immediate: false,
    },
  },
  methods: {
    doReorder(event) {
      var changed = event.detail.complete(this.titles);
      for (var i = 0; i < changed.length; i++) {
        if (changed[i] !== this.titles[i]) {
          this.$set(this.titles, i, changed[i]);
        }
      }
    },
    handler(error) {
      this.$ionic.loadingController.dismiss();
      this.errorText += "Error! " + error.result.error.message;
    },
    // report(ev) {
    //   console.log("report");
    //   console.log(ev);
    //   console.log(ev.target.parentNode.open);
    //   console.log(
    //     !ev.target.parentNode.open && ev.target.parentNode.parentNode
    //   );
    //   this.target =
    //     !ev.target.parentNode.open && ev.target.parentNode.parentNode;
    // },
    showTree(name) {
      // console.log("report2");
      console.log(this.target);
      // if (this.target) {
      //   return this.target.open || this.t.includes(name);
      // }
      return true;
    },
    updateTarget(arr) {
      console.log(arr);
      if (arr[2] === "ION-REORDER-GROUP") {
        this.target = arr;
      }
    },
  },
  beforeDestroy() {
    if (confirm("作業内容を保存しますか？")) {
      this.updateFlag = true;
    }
  },
};
</script>

<style scoped>
ion-reorder {
  float: right;
  padding-right: 10px;
}
</style>
