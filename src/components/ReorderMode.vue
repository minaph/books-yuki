<template>
  <ion-reorder-group @ionItemReorder="doReorder($event)" disabled="false">
    <p v-for="(t, i) in titles" :key="t + i">
      {{ t }} <ion-reorder v-on:click.prevent />
    </p>
  </ion-reorder-group>
</template>

<script>
export default {
  name: "ReorderMode",
  props: {
    titles: Array,
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
  },
};
</script>

<style></style>
