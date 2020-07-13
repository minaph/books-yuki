<template functional>
  <div style="display: none;">{{$options.handler(props, listeners)}}</div>
</template>
<script>
export default {
  name: "SpreadSheet",
  props: {
    method: String,
    params: Object,
    values: Array,
    majorDimension: String,
    send: Boolean
  },
  handler(props, listeners) {
    if (!props.send) {
      return;
    }
    listeners.send(false);
    let request;
    switch (props.method) {
      case "get":
        request = gapi.client.sheets.spreadsheets.values.get(props.params);
        request.then(
          function(response) {
            // debugger;
            console.log(response);
            listeners.get(response.result.values || response);
          },
          function(reason) {
            listeners.error(reason);
            console.error("error: " + reason.result.error.message);
          }
        );
        break;
      case "set":
        var valueRangeBody = {
          range: props.params["range"],
          values: props.values,
          majorDimension: props.majorDimension
        };
        request = gapi.client.sheets.spreadsheets.values.update(
          props.params,
          valueRangeBody
        );
        request.then(
          function(response) {
            listeners.set(response);
            console.log(response.result);
          },
          function(reason) {
            listeners.error(reason);
            console.error("error: " + reason.result.error.message);
          }
        );
        break;
      default:
        break;
    }
  }
};
</script>