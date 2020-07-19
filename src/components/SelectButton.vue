<template>
  <!-- Reviewed: 2020/07/19 -->
  <Buttonize>
    <ion-select
      :value="choices[0]"
      :placeholder="title"
      interface="popover"
      ref="select"
      @ionChange="change"
    >
      <ion-select-option v-for="c in choices" :key="c" :value="c">{{
        c
      }}</ion-select-option>
    </ion-select>
  </Buttonize>
</template>

<script>
import Buttonize from "./Buttonize";
export default {
  name: "SelectButton",
  components: {
    Buttonize,
  },
  props: {
    title: String,
    choices: Array,
  },
  computed: {
  },
  methods: {
    change() {
      this.$emit("change", this.$refs.select.value);
    },
  },
};
</script>
