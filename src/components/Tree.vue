<template>
  <div class="tree">
    <details v-if="Object.keys(children).length > 0" @click="bold($event)">
      <summary :content="content" v-on:click.self>
        {{ content }}
        <ion-note
          v-if="Object.keys(children).length > 1"
          >{{ Object.keys(children).length - 1 }}</ion-note
        >
        <slot></slot>
      </summary>

      <ion-item lines="full">
        <ion-label>読書メモ</ion-label>
        <ion-textarea
          :value="children.comment"
          auto-grow
          @ionFocus="focus()"
          @ionChange="changeComments()"
          @ionBlur="blur()"
          :id="content + Object.keys(children).length"
        ></ion-textarea>
      </ion-item>
      <tree
        v-for="(child, name) in chosenChildren()"
        :key="name + Object.keys(child).length"
        :content="name"
        :children="child"
      />
    </details>
    <p v-else>{{ content }}</p>
  </div>
</template>

<script>
import Tree from "./TreeF.vue";
export default {
  name: "Tree",
  props: {
    content: {
      types: String,
      required: true,
    },
    children: {
      types: Object,
      required: true,
    },
  },
  methods: {
    chosenChildren() {
      const list = Object.keys(this.children);
      let result = new Object();
      // 依存関係を維持するため、for文で処理
      // 依存関係が解消できるなら解消OK
      for (let index = 0; index < list.length; index++) {
        if (list[index] !== "comment") {
          result[list[index]] = this.children[list[index]];
        }
      }
      return result;
    },

    changeComments() {
      // var comment = this.$refs[this.content + Object.keys(this.children).length]
      //   .value;
      // this.$set(this.children, "comment", comment);
      var id = this.content + Object.keys(this.children).length;
      var comment = document.getElementById(id).value;
      this.children.comment = comment;

      console.log("Comments changed: " + comment);
    },
    focus() {
      console.group();
    },
    blur() {
      console.groupEnd();
    },
    bold(event) {
      Array.from(event.target.childNodes).filter(
        (x) => x.tagName === "SUMMARY"
      )[0].class += "open";
    },
  },
};
</script>

<style scoped>
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
  font-size: 14px;
}

ion-item {
  margin-left: 20px;
}

ion-textarea {
  font-size: 16px;
  height: 55px;
}
summary::-webkit-details-marker {
  display: none;
}

summary#text {
  padding-left: 10px;
}

details[open] > summary {
  font-weight: bold;
}
details[open] > summary > ion-note {
  font-weight: normal;
}

/* details details summary {
  list-style: none;
  padding-left: 30px;
} */
/* details p{
  margin-left: 5px;
} */
</style>
