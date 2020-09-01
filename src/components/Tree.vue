<template>
  <!-- reviewed: 2020/07/19 -->
  <div class="tree">
    <transition>
      <details v-if="Object.keys(children).length > 0">
        <transition>
          <summary @click.self.stop="emitOpen($event)">
            {{ content }}
            <ion-note v-if="Object.keys(children).length > 1">{{
              Object.keys(children).length - 1
            }}</ion-note>
            <slot></slot>
          </summary>
        </transition>

        <FlexInput :comment="children.comment" @edited="handleMemo" />
        <tree
          v-for="(child, name) in chosenChildren"
          :key="name + Object.keys(child).length"
          :content="name"
          :children="child"
        />
      </details>
    </transition>
    <!-- <p v-else>{{ content }}</p> -->
  </div>
</template>

<script>
import Tree from "./TreeF.vue";
import FlexInput from "./FlexInput"
export default {
  name: "Tree",
  components: {
    FlexInput
  },
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
  data() {
    return {
      close: true,
    };
  },
  computed: {
    chosenChildren() {
      if (!this.children) {
        console.log(this.children);
      }
      const list = Object.keys(this.children);
      let result = new Object();
      // 依存関係を維持するため、for文で処理
      // 依存関係が解消できるなら解消OK
      for (let index = 0; index < list.length; index++) {
        if (list[index] !== "comment") {
          result[list[index]] = this.children[list[index]];
        }
      }
      if (this.close) {
        return {};
      }
      return result;
    },
  },
  mounted() {
    console.assert(this.children, "children warning");
    // if(!this.children){
    // }
  },
  methods: {
    emitOpen(event) {
      console.log(event.target.parentNode.parentNode.classList);
      this.close = event.target.parentNode.open;
      var text = Array.from(event.target.parentNode.parentNode.classList);
      if (text.length > 2) {
        text[1] = text.slice(1).join(" ");
      }
      console.log(text);
      var arr = [
        this.close,
        // JSON.parse(JSON.stringify(text)),
        text,
        event.target.parentNode.parentNode.parentNode.tagName,
      ];
      this.$emit("open", arr);

    },
    handleMemo(comment){
      this.$set(this.children, "comment", comment);
    }
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
  --highlight-color-focused: var(--ion-color-light-contrast);
}

ion-textarea {
  font-size: 16px;
  margin-bottom: 20px;
}

summary::-webkit-details-marker {
  display: none;
}

summary#text {
  padding-left: 10px;
}

details[open] > summary {
  font-weight: bold;
  font-size: 22px;
}

details[open] details[open] summary {
  font-size: 17px;
  margin-block-start: 3px;
  margin-block-end: 3px;
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
