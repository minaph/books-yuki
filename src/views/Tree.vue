<template>
  <div class="tree">
    <details v-if="Object.keys(children).length>0">
      <summary :content="content">{{content}}</summary>
      <ion-item lines="full">
        <ion-label position="floating">読書メモ</ion-label>
        <ion-textarea
          :value="children.comment"
          autoGrow
          @ionFocus="focus"
          @ionChange="changeComments"
          @ionBlur="blur"
          :ref="content+Object.keys(children).length"
        ></ion-textarea>
      </ion-item>
      <tree
        v-for="(child, name) in chosenChildren"
        :key="name + Object.keys(child).length"
        :content="name"
        :children="child"
      />
    </details>
    <p v-else>{{content}}</p>
  </div>
</template>

<script>
import Tree from "./Tree.vue";
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
  components: {
    Tree
  },
  computed: {
    chosenChildren() {
      const list = Object.keys(this.children);
      let result = new Object();
      for (let index = 0; index < list.length; index++) {
        if (list[index] !== "comment") {
          result[list[index]] = this.children[list[index]];
        }
      }
      return result;
    }
  },
  created() {
    console.log(
      "Tree called: " + this.content + " | " + Object.keys(this.children)
    );
    console.assert(this.content !== "comment");

    if (!("comment" in this.children)) {
      this.$set(this.children, "comment", "");
    }
  },
  methods: {
    changeComments() {
      var comment = this.$refs[this.content + Object.keys(this.children).length]
        .value;
      this.$set(this.children, "comment", comment);

      console.log("Comments changed: " + comment);
    },
    focus(){
      console.group();
    },
    blur(){
      console.groupEnd();
    }
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
}
/* details p{
  margin-left: 5px;
} */
</style>