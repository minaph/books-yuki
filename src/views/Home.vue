<template>
  <!-- Reviewed : 2020/07/19 -->
  <ion-app>
    <link
      href="https://fonts.googleapis.com/css?family=Sawarabi+Mincho"
      rel="stylesheet"
    />
    <SpreadSheet
      :requests="[titlesLoadRequest, indexesInitRequest, indexesLoadRequest]"
    />
    <loading :load="load" :text="loadingText" @present="load = false" />
    <ion-header>
      <slot></slot>
      <ion-toolbar color="light">
        <ion-buttons>
          <EditModalButton
            :titles="titles"
            :indexes="indexes"
            :indent="settings.indent"
          />
          <SaveButton
            :settings="settings"
            @error="handler"
            :requests="[titlesSaveRequest, indexesSaveRequest]"
          />
          <SelectButton
            title="モード選択"
            :choices="choices"
            @change="modeChange"
          />
        </ion-buttons> </ion-toolbar
    ></ion-header>
    <ion-content>
      <DebugSpan :text="errorText" :debug="settings.debug" />
      <tree
        v-for="name in titleNames"
        :key="name + Object.keys(titleNames).length"
        :class="name"
        :content="name"
        :children="indexes[name]"
        @open.self="updateTarget"
        v-show="target[0] || target[1].includes(name)"
      >
      </tree>
    </ion-content>
  </ion-app>
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
import SaveButton from "../components/SaveButton";
import ReorderMode from "../components/ReorderMode";

export default {
  name: "Home",
  components: {
    Tree,
    loading,
    SpreadSheet,
    EditModalButton,
    DebugSpan,
    SelectButton,
    SaveButton,
    ReorderMode
  },
  props: {
    signIn: {
      default: false,
    },
    settings: Object,
  },
  data() {
    return {
      mode: "デフォルト",
      target: [true, {}],
      editIndexText: false,
      titles: new Array(),
      indexes: new Object(),
      load: false,
      loadingText: "目次データをロードしています",
      call: {
        saveIndexes: false,
        saveTitles: false,
        loadIndexes: false,
        loadTitles: false,
        initIndexes: false,
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
    choices: () => [
      "デフォルト",
      "削除モード",
      "Todoリストに共有",
      "並び替え",
      "クイズモード",
    ],
    isBeginner() {
      var settings = this.settings;
      return !Object.keys(this.settings).reduce(function(a, b) {
        return a && ["string", "boolean"].includes(typeof settings[b]);
      });
    },
    titleNames() {
      if (Object.keys(this.indexes).length > 0) {
        return this.titles;
      }
      return [];
    },
    titlesSaveRequest() {
      // var vm = this;
      var SS_ID = this.SS_ID;
      var settings = this.settings;
      var titles = this.titles;
      var valuesArray = this.valuesArray;
      var handler = this.handler;
      var call = this.call;
      return {
        method: "set",
        params: {
          spreadsheetId: settings.SS_ID,
          range: "'" + settings.data + "'!" + "A:" + A1(titles.length),
          valueInputOption: "RAW",
        },
        values: valuesArray,
        majorDimension: "COLUMNS",
        onsucceeded: () => {
          call.saveTitles = false;
        },
        onerror: handler,
        send: call.saveTitles,
      };
    },
    indexesSaveRequest() {
      // var vm = this;
      var SS_ID = this.SS_ID;
      var settings = this.settings;
      var titles = this.titles;
      var handler = this.handler;
      var call = this.call;
      return {
        method: "set",
        params: {
          spreadsheetId: settings.SS_ID,
          range: "'" + settings.index + "'!" + "A:A",
          valueInputOption: "RAW",
        },
        values: [titles],
        majorDimension: "COLUMNS",
        onsucceeded: () => {
          call.saveIndexes = false;
        },
        onerror: handler,
        send: call.saveIndexes,
      };
    },
    titlesLoadRequest() {
      // var vm = this;
      var SS_ID = this.SS_ID;
      var settings = this.settings;
      var titles = this.titles;
      var handler = this.handler;
      var call = this.call;
      var indexes = this.indexes;
      var set = this.$set;
      var del = this.$delete;
      return {
        method: "get",
        params: {
          spreadsheetId: settings.SS_ID,
          range: "'" + settings.index + "'!" + "A:A",
          majorDimension: "COLUMNS",
          // valueRenderOption: "",
        },
        onsucceeded: function(data) {
          console.log("got titles: " + JSON.stringify(data));
          var nodata =
            !Array.isArray(data) || data.length === 0 || data[0].length === 0;
          if ("サイトの使い方（ここをクリック！）" in indexes) {
            del(indexes, "サイトの使い方（ここをクリック！）");
          }
          if (nodata) {
            set(call, "initIndexes", true);
            // call.initIndexes = true;
          } else {
            // data[0].forEach(function(x) {
            //   set(indexes, x, new Object());
            // });
            // set(vm, "titles", data[0]);
            data[0].forEach(function(v, i) {
              titles[i] = v;
            });
            set(call, "loadIndexes", true);
            // call.loadIndexes = true;
            set(call, "loadTitles", false);
            // call.loadTitles = false;
          }
        },
        onerror: handler,
        send: call.loadTitles,
      };
    },
    indexesInitRequest() {
      // var vm = this;
      var SS_ID = this.SS_ID;
      var settings = this.settings;
      var titles = this.titles;
      var handler = this.handler;
      var call = this.call;
      var indexes = this.indexes;
      var set = this.$set;
      var ionic = this.$ionic;
      return {
        method: "get",
        params: {
          spreadsheetId: settings.SS_ID,
          range: "'" + settings.data + "'!" + "1:1",
          // valueRenderOption: "",
        },
        onsucceeded: function(data) {
          var nodata =
            !Array.isArray(data) || data.length === 0 || data[0].length === 0;
          if (nodata) {
            console.log("Your data is empty");
            data = [[]];
            ionic.loadingController.dismiss();
          } else {
            console.log("got titles: " + data[0]);

            data[0].forEach(function(v, i) {
              titles[i] = v;
            });
            set(call, "loadIndexes", true);
            // call.loadIndexes = true;
            set(call, "initIndexes", false);
            // call.initIndexes = false;
          }
        },
        onerror: handler,
        send: call.initIndexes,
      };
    },
    indexesLoadRequest() {
      // var vm = this;
      var SS_ID = this.SS_ID;
      var settings = this.settings;
      var titles = this.titles;
      var handler = this.handler;
      var call = this.call;
      var indexes = this.indexes;
      var set = this.$set;
      var ionic = this.$ionic;
      return {
        method: "get",
        params: {
          spreadsheetId: settings.SS_ID,
          range: "'" + settings.data + "'!" + "A:" + A1(titles.length),
          majorDimension: "COLUMNS",
        },
        onsucceeded: function(data) {
          for (var _i = 0; _i < data.length; _i++) {
            set(
              indexes,
              data[_i][0],
              textParser(data[_i].slice(1), settings.indent)
            );
          }
          console.log("Indexing complete!");
          console.log(indexes);
          // console.log(dismiss)
          // debugger;
          ionic.loadingController.dismiss();
          set(call, "loadIndexes", false);
          // call.loadIndexes = false;
        },
        onerror: handler,
        send: call.loadIndexes,
      };
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
          this.call.loadTitles = true;
        } else {
          this.$set(this.titles, 0, "サイトの使い方（ここをクリック！）");
          this.$set(
            this.indexes,
            "サイトの使い方（ここをクリック！）",
            textParser(intro, "　")
          );
        }
      },
      immediate: true,
    },
    // request: {

    //   deep: false,
    //   immediate: false
    // },
  },
  methods: {
    handler(error) {
      this.$ionic.loadingController.dismiss();
      this.errorText = "Error! " + error.result.error.message;
    },
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
    modeChange(selected) {
      this.mode = selected;
    },
  },
};
</script>

<style scoped>
ion-reorder {
  float: right;
  padding-right: 10px;
}

ion-content {
  font-family: "Sawarabi Mincho";
}
</style>
