<template>
  <!-- Reviewed: 2020/07/19 -->
  <div class="md button button-clear ion-activatable ion-focusable hydrated">
    <slot />
    <ion-ripple-effect role="presentation" />
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
div {
  overflow: hidden;
  position: relative;
  vertical-align: -webkit-baseline-middle;
  margin-inline-start: 2px;
  margin-inline-end: 2px;
  margin-bottom: 4px;
  margin-top: 4px;
  height: 36px;
  text-align: center;
  font-size: 14px;
  padding-inline-start: var(--padding-start);
  padding-inline-end: var(--padding-end);
  --padding-start: 1.1em;
  --padding-end: 1.1em;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  transition-property: box-shadow, background-color, color;
  --transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1),
    background-color 15ms linear, color 15ms linear;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

div > * {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
