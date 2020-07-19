<template>
<!-- done -->
  <div class="debug">
    <span ref="error" v-show="errorText.length > 0">
      {{ errorText }}
      <ion-chip color="dark" mode="ios" outline="true" @click="errorText = ''">
        <ion-label>X</ion-label>
      </ion-chip>
    </span>
    <!-- Todo: リスト化 -->
    <span ref="debug" v-show="debug">{{ debugText }}</span>
    <!-- リスト化ここまで -->
  </div>
</template>

<script>
export default {
  name: "DebugSpan",
  props: {
    text: String,
    debug: Boolean,
  },
  data() {
    return {
      debugText: "",
      errorText: "",
    };
  },
  watch: {
    text() {
      this.errorText = this.text;
    },
  },
  created() {
    var functions = [
      console.log,
      console.info,
      console.warn,
      console.error,
      console.debug,
    ];
    var vm = this;
    function f(g) {
      return function(...m) {
        g(...m);
        vm.handler(...m);
      };
    }
    [
      console.log,
      console.info,
      console.warn,
      console.error,
      console.debug,
    ] = functions.map(f);
  },
  methods: {
    handler(...error) {
      error.forEach((e) => {
        var seen = [];
        var replacer = function(key, value) {
          if (value != null && typeof value == "object") {
            if (seen.indexOf(value) >= 0) {
              return;
            }
            seen.push(value);
          }
          return value;
        };
        var text;
        try {
          text = JSON.stringify(e, replacer) + "           ";
        } catch (error) {
          text = e + "";
        } finally {
          this.debugText += text;
        }
      });
    },
  },
};
</script>

<style></style>
