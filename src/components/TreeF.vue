<template functional>
  <div class="tree">
    <details v-if="Object.keys(props.children).length>0">
      <summary :content="props.content" v-on:click.self>
        {{props.content}}
        <slot></slot>
      </summary>

      <ion-item lines="full">
        <ion-label position="floating">読書メモ</ion-label>
        <ion-textarea
          :value="props.children.comment"
          auto-grow
          @ionFocus="$options.focus()"
          @ionChange="$options.changeComments(props)"
          @ionBlur="$options.blur()"
          :id="props.content + Object.keys(props.children).length"
        ></ion-textarea>
      </ion-item>
      <tree
        v-for="(child, name) in $options.chosenChildren(props)"
        :key="name + Object.keys(child).length"
        :content="name"
        :children="child"
      />
    </details>
    <p v-else>{{props.content}}</p>
  </div>
</template>

<script>
import Tree from "./TreeF.vue";
export default {
  name: "Tree",
  props: {
    content: {
      types: String,
      required: true
    },
    children: {
      types: Object,
      required: true
    }
  },
  chosenChildren(props) {
    const list = Object.keys(props.children);
    let result = new Object();
    // 依存関係を維持するため、for文で処理
    // 依存関係が解消できるなら解消OK
    for (let index = 0; index < list.length; index++) {
      if (list[index] !== "comment") {
        result[list[index]] = props.children[list[index]];
      }
    }
    return result;
  },

  changeComments(props) {
    // var comment = this.$refs[this.content + Object.keys(this.children).length]
    //   .value;
    // this.$set(this.children, "comment", comment);
    var id = props.content + Object.keys(props.children).length;
    var comment = document.getElementById(id).value;
    props.children.comment = comment;

    console.log("Comments changed: " + comment);
  },
  focus() {
    console.group();
  },
  blur() {
    console.groupEnd();
  }
};
</script>

<style scoped>
/* details * {
  margin-left: 10px;
} */
details p {
  margin-block-start: 4px;
  margin-block-end: 4px;
  margin-left: 48px;
  font-size: 16px;
}
details {
  margin-block-start: 10px;
  margin-left: 18px;
  margin-block-end: 20px;
  font-size: 20px;
}
details details {
  margin-block-start: 2px;
  margin-block-end: 2px;
  font-size: 16px;
}
.sc-ion-label-md-h {
  font-size: 11px;
}

ion-textarea {
  font-size: 16px;
  height: 55px;
}
summary::-webkit-details-marker {
  display: none;
}

details summary {
  padding-left: 10px;
}

details details summary {
  list-style: none;
  padding-left: 30px;
}
/* details p{
  margin-left: 5px;
} */
</style>