<template>
  <div
    class="base-popup"
    :class="{ 'base-popup_fullscreen': fullscreen }"
    ref="popup"
  >
    <div class="base-popup-background" @click="close"></div>
    <div class="base-popup-content">
      <slot></slot>
      <button class="base-popup__close" @click="close">
        <i class="icon-times" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { Types } from "@/constants/store.types";
export default {
  name: "BasePopup",
  mounted() {
    window.onkeydown = this.handlerWindowKeydown;
    if (!this.fullscreen) {
      window.onclick = this.close;
    }
  },
  props: {
    fullscreen: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  destroyed() {
    window.onkeydown = null;
    window.onclick = null;
  },
  methods: {
    handlerWindowKeydown(e) {
      if (e.keyCode === 27) {
        this.close();
      }
    },
    close() {
      this.$emit("close");
      this.closePopup();
    },
    ...mapMutations({
      closePopup: Types.mutations.CLOSE_POPUP,
    }),
  },
};
</script>