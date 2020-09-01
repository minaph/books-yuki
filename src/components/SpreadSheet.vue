<template></template>
<!-- Reviewed: 2020/07/19 -->
<!-- <div style="display: none;">{{$options.handler(props, listeners)}}</div> -->

<script>
export default {
  name: "SpreadSheet",
  props: {
    requests: Array,
  },
  data() {
    return {};
  },
  watch: {
    requests: {
      handler: function() {
        console.log("Detected");
        this.requests.filter((x) => x.send).forEach(this.handler);
      },
      deep: true,
    },
  },
  methods: {
    handler(r) {
      this.$set(r, "send", false);
      // r.send = false;
      let request;
      switch (r.method) {
        case "get":
          request = gapi.client.sheets.spreadsheets.values.get(r.params);
          request.then(
            function(response) {
              // debugger;
              console.log(response);
              r.onsucceeded(response.result.values || response);
            },
            function(reason) {
              r.onerror(reason);
              console.error("error: " + reason.result.error.message);
            }
          );
          break;
        case "set":
          var valueRangeBody = {
            range: r.params["range"],
            values: r.values,
            majorDimension: r.majorDimension,
          };
          request = gapi.client.sheets.spreadsheets.values.update(
            r.params,
            valueRangeBody
          );
          request.then(
            function(response) {
              console.log("done!");
              r.onsucceeded(response);
              console.log(response.result);
            },
            function(reason) {
              r.onerror(reason);
              console.error("error: " + reason.result.error.message);
            }
          );
          break;
        default:
          break;
      }
    },
  },
};
</script>
