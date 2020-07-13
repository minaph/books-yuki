<template><div>
  <ion-chip @click="descriptionPopover" outline>?</ion-chip>
  </div>
</template>

<script>

export default {
  name: "HintChip",
  props: {
    description: Object
  },
  methods:{
    descriptionPopover() {
      const popover = this.$ionic.popoverController
        .create({
          component: this.description,
          componentProps: {
            // propsData: {
            //   which: target,
            // }
          },
          translucent: true
        })
        .then(m => m.present());
      // document.body.appendChild(popover);
      // console.log(Popover);
      // return popover.present();
    }
  }
}
</script>

<style scoped>
ion-chip {
  padding-inline-start: 6px;
  padding-inline-end: 6px;
  padding-top: 2px;
  padding-bottom: 2px;
  height: 22px;
}

ion-popover {
  --width: 65%;
}
</style>