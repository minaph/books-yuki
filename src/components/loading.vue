<template functional>
  <div style="display: none;">{{$options.presentLoading(props, listeners)}}</div>
</template>
<script>
import { loadingController } from "@ionic/core";

export default {
  props: {
    load: Boolean,
    text: String
  },
  async presentLoading(props, listeners) {
    if (props.load) {
      console.count("start loading");
      listeners.present(false);
      // parent.load = false;
      const loading = await loadingController.create({
        message: props.text
        // duration: 5000
      });
      loading.present();
      // } else if (typeof parent.$ionic.loadingController.dismiss == "function") {
      //   parent.$ionic.loadingController.dismiss();
    }
  }
};
</script>