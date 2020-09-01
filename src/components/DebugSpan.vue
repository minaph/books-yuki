<template>
  <!-- done -->
  <div class="debug">
    <span ref="error" v-for="(e, i) in errors" :key="Math.random()">
      <p>{{ e }}</p>
      <ion-chip
        color="dark"
        mode="ios"
        outline="true"
        @click="errors.splice(i, 1)"
      >
        <ion-label>X</ion-label>
      </ion-chip>
    </span>
    <details v-show="debug">
      <summary>ログ</summary>
      <span v-for="d in debugLines" :key="Math.random()">
        <p>{{ d }}</p>
      </span>
    </details>
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
      debugLines: [],
      errors: [],
    };
  },
  conputed: {},
  watch: {
    text() {
      this.errors.push(this.text);
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
        try {
          if (m.length > 0) {
            g(...m);
            vm.handler(...m);
          } else {
            g(m);
            vm.handler(m);
          }
        } catch (error) {
          debugger;
        }
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
          try {
            text = JSON.stringify(e, replacer);
          } catch (error) {
            text = e + "";
          } finally {
            this.debugLines.splice(0, 0, text);
          }
        } catch (error) {
          debugger;
        }
      });
    },
  },
};
</script>

<style></style>
