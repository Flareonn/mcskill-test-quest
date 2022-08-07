<template>
  <div class="base-counter form-group">
    <h4 class="base-counter__title form-group-label">
      <slot name="title">Количество:</slot>
    </h4>
    <div class="base-counter-main d-flex">
      <button
        class="btn_primary"
        @click.ctrl="changeCounter(-10)"
        @click.exact="changeCounter(-1)"
      >
        <i class="icon-minus" />
      </button>
      <input
        type="text"
        class="btn_primary base-counter__display"
        v-model.number="controls"
      />
      <button
        class="btn_primary"
        @click.ctrl="changeCounter(10)"
        @click.exact="changeCounter(1)"
      >
        <i class="icon-plus" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseCounter",
  model: {
    prop: "model",
    event: "change",
  },
  props: {
    model: {
      type: [String, Number],
      required: true,
      default: 0,
    },
    min: {
      type: [String, Number],
      required: false,
      default: undefined,
    },
    max: {
      type: [String, Number],
      required: false,
      default: undefined,
    },
  },
  data() {
    return {
      controls: +this.model,
    };
  },
  methods: {
    changeCounter(value) {
      this.controls += value;
      if (this.max && this.controls > this.max) {
        this.controls = +this.max;
      } else if (this.min && this.controls < this.min) {
        this.controls = +this.min;
      }
      this.$emit("change", this.controls);
    },
  },
};
</script>