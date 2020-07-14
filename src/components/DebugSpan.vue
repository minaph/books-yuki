<template>
  <div class="debug">
    <span ref="error">{{ text }}</span>
    <span ref="debug" v-show="debug">{{ debugText }}</span>
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
    };
  },
  created() {
    console.log = this.handler;
    console.info = this.handler;
    console.warn = this.handler;
    console.error = this.handler;
    console.debug = this.handler;
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
