<template>
  <div class="card-product d-flex align-items-center">
    <div class="card-product__image">
      <img :src="product.img" :alt="product.name" height="120" width="120" />
    </div>
    <div class="card-product__text">{{ product.name }}</div>
    <button
      class="btn_info card-product__buy-button"
      @click.stop="selectItem(product), openPopup(popups.BUY_ITEM)"
    >
      Купить
    </button>
    <div class="card-product__price d-flex align-items-center">
      <span>{{ price.value }}</span>
      <i :class="`icon-${price.type} icon-${price.type}_small`" />
    </div>
    <div class="card-product-actions d-flex">
      <button
        class="btn"
        @click.stop="selectItem(product), openPopup(popups.EDIT_ITEM)"
      >
        <i class="icon-pen" />
      </button>
      <button class="btn" @click="removeItem(product.id)">
        <i class="icon-trash" />
      </button>
    </div>
  </div>
</template>

<script>
import { Types } from "@/constants/store.types";
import { mapMutations } from "vuex";
import { BUY_ITEM, EDIT_ITEM } from "@/constants/popups";
import { price } from "@/constants/mixins";
export default {
  name: "CardProduct",
  props: {
    product: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    price() {
      return price(this.product.priceem, this.product.pricerub);
    },
  },
  mixins: [],
  data() {
    return {
      popups: {
        BUY_ITEM,
        EDIT_ITEM,
      },
    };
  },
  methods: {
    ...mapMutations({
      openPopup: Types.mutations.OPEN_POPUP,
      selectItem: Types.mutations.SELECT_ITEM,
      removeItem: Types.mutations.REMOVE_ITEM,
    }),
  },
};
</script>