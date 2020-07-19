<template>
  <!-- reviewed: 2020/07/19 -->
  <div class="tree">
    <transition>
      <details
        v-if="Object.keys(children).length > 0"
      >
        <transition>
          <summary @click.self.stop="emitOpen($event)">
            {{ content }}
            <ion-note v-if="Object.keys(children).length > 1">{{
              Object.keys(children).length - 1
            }}</ion-note>
            <slot></slot>
          </summary>
        </transition>

        <ion-item lines="full" :style="{ height: height + 'px' }">
          <ion-label>読書メモ</ion-label>
          <ion-textarea
            :value="children.comment"
            auto-grow
            @ionFocus="focus()"
            @ionChange="changeComments($event)"
            @ionBlur="blur()"
            :id="content + Object.keys(children).length"
          ></ion-textarea>
        </ion-item>
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
  data() {
    return {
      height: 59,
      close: true,
    };
  },
  computed: {
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
      if(this.close){
        return {}
      }
      return result;
    }
  },
  methods: {

    changeComments(event) {
      // var comment = this.$refs[this.content + Object.keys(this.children).length]
      //   .value;
      // this.$set(this.children, "comment", comment);
      // var id = this.content + Object.keys(this.children).length;
      // var el = document.getElementById(id)
      var comment = event.target.value;
      this.children.comment = comment;
      this.height = event.target.scrollHeight;

      console.log("Comments changed: " + comment);
    },
    focus() {
      if (this.height < 59) {
        this.height = 59;
      }
      console.group();
    },
    blur() {
      console.groupEnd();
    },
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

      var id = this.content + Object.keys(this.children).length;
      var element = document.getElementById(id);
      if (element.childNodes[0].scrollHeight > 59) {
        this.height = element.childNodes[0].scrollHeight;
        element.style.height = element.childNodes[0].scrollHeight;
        element.childNodes[0].style.height = element.childNodes[0].scrollHeight;
      } else {
        element.childNodes[0].style.height = this.height + "px";
      }
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
