<template>
  <div id="app" class="shop container">
    <header class="shop-header">
      <div class="shop-header-top d-flex">
        <button class="btn shop-header__change-server">
          Сменить сервер
          <i class="icon-refresh" />
        </button>
      </div>
      <div class="shop-header-under">
        <ul
          class="
            shop-header-essence
            d-flex
            align-items-center
            justify-content-between
          "
        >
          <li><button class="btn">Привилегии</button></li>
          <li><button class="btn">Кейсы</button></li>
          <li><button class="btn active">Предметы</button></li>
          <li><button class="btn">Наборы</button></li>
        </ul>
        <form
          class="shop-header-search d-flex align-items-center"
          @submit.prevent
        >
          <div class="base-search d-flex">
            <button class="base-search-submit">
              <i class="icon-search" />
            </button>
            <input
              type="search"
              placeholder="Поиск товара по названию"
              v-model.lazy="form.search"
            />
          </div>
          <button
            class="shop-header-search__filter btn_primary"
            :class="{ active: currentPopup === popups.FILTER }"
            @click.stop="openPopup(popups.FILTER)"
          >
            <i class="icon-filter" />
            <base-popup
              class="base-popup-filter"
              v-if="currentPopup === popups.FILTER"
            >
              <div class="base-popup-filter__select">
                <button
                  class="btn_primary"
                  v-for="(filter, idx) in filters"
                  :key="idx"
                  @click="form.filterBy = filter.filterBy"
                >
                  <i :class="`icon-${filter.icon}`" />
                  <span>{{ filter.value }}</span>
                </button>
              </div>
            </base-popup>
          </button>
        </form>
        <button
          class="shop-header-categories btn_success"
          @click.stop="openPopup(popups.CATEGORIES)"
        >
          Категории
          <base-popup
            v-show="currentPopup === popups.CATEGORIES"
            class="base-popup-categories d-flex"
          >
            <button class="btn" @click="form.sortBy = []">Все товары</button>
            <template v-for="category in categories">
              <input
                type="checkbox"
                :key="category.id"
                :id="category.id"
                :value="category.id"
                v-model="form.sortBy"
                hidden
              />
              <label
                :for="category.id"
                :key="`${category.id}-label`"
                class="btn"
                :class="{ active: form.sortBy.includes(category.id) }"
              >
                {{ category.name }}
              </label>
            </template>
          </base-popup>
        </button>
      </div>
    </header>
    <main class="shop-main">
      <card-add @click.native.stop="openPopup(popups.EDIT_ITEM)" />
      <card-product
        :product="product"
        v-for="product in products"
        :key="product.id"
      />
      <base-popup
        v-if="currentPopup === popups.BUY_ITEM"
        class="base-popup-item-buy"
        fullscreen
        @close="counter = 1"
      >
        <h2 class="base-popup__title">Покупка предмета</h2>
        <form class="d-flex" @submit.prevent>
          <div class="base-popup-item-buy__image">
            <img :src="selectedProduct.img" alt="" width="200" height="200" />
          </div>
          <div class="base-popup-item-buy__info">
            <h3>{{ selectedProduct.name }}</h3>
            <base-counter
              v-model="counter"
              :max="selectedProduct.amount"
              min="1"
              @click.prevent.stop
            />
            <summary class="d-flex align-items-center">
              <b>Итого к оплате:</b>
              <span class="d-flex align-items-center"
                >{{ resultSum
                }}<i :class="`icon-${price.type} icon-${price.type}_medium`"
              /></span>
            </summary>
            <button
              class="btn_secondary base-popup__submit"
              @click.prevent="buyProduct"
              :disabled="error"
            >
              Купить
            </button>
          </div>
        </form>
        <strong class="base-popup-item-buy__hint">
          <span class="info">*</span>
          <span> Для получения предметов на сервере, введи команду - </span>
          <span class="info">/cart all</span>
        </strong>
        <div
          class="base-popup-error d-flex align-items-center"
          :class="{ active: error }"
        >
          <i class="icon-warning" />
          <span> Не удалось совершить покупку: </span>&nbsp;<span
            >Недостаточно средств</span
          >
        </div>
      </base-popup>
      <base-popup
        v-else-if="currentPopup === popups.SUCCESSFUL_BOUGHT"
        class="base-popup-item-buy base-popup-item-buy_success"
        fullscreen
      >
        <h2 class="base-popup__title">Покупка завершена</h2>
        <p class="base-popup-item-buy__hint">
          Для получения напишите /cart all
        </p>
        <button class="btn_secondary base-popup__submit" @click="closePopup">
          Ок
        </button>
      </base-popup>
      <base-popup
        v-else-if="currentPopup === popups.EDIT_ITEM"
        fullscreen
        class="base-popup-item-edit"
        @close="clearSelected"
      >
        <h2 class="base-popup__title">Редактор предметов</h2>
        <form @submit.prevent class="d-flex">
          <div class="form-column">
            <div class="form-group">
              <label for="product-name" class="form-group-label"
                >Название:</label
              >
              <input type="text" id="product-name" v-model="controls.name" />
            </div>
            <div class="form-group">
              <label for="product-category" class="form-group-label"
                >Категория:</label
              >
              <div class="base-select">
                <select id="product-category" v-model="controls.catid">
                  <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                    :selected="controls.catid === category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="product-img-link" class="form-group-label"
                >Ссылка на иконку:</label
              >
              <input type="text" id="product-img-link" v-model="controls.img" />
            </div>
            <div class="form-group">
              <label for="product-itemname" class="form-group-label"
                >ID предмета в игре:</label
              >
              <input
                type="text"
                id="product-itemname"
                v-model="controls.itemname"
              />
            </div>
            <div class="form-group">
              <label for="product-extra" class="form-group-label"
                >Экстра: *</label
              >
              <input type="text" id="product-extra" v-model="controls.extra" />
              <div class="form-group-under">
                <span>* только тем, кто знает зачем это</span>
              </div>
            </div>
          </div>
          <div class="form-column">
            <base-counter min="1" v-model="controls.amount" />
            <base-counter min="1" v-model="controls.stacksize">
              <template #title>Размер стака:</template>
            </base-counter>
            <base-counter v-model="controls.sort">
              <template #title>Сортировка:</template>
            </base-counter>
            <div class="form-group">
              <label for="product-price" class="form-group-label">
                Цена:
              </label>
              <div class="d-flex base-popup-item-edit__price">
                <input type="text" v-model.number="price.value" />
                <input
                  type="radio"
                  id="coin"
                  value="coin"
                  name="price-type"
                  v-model="price.type"
                />
                <label for="coin" class="btn_primary">
                  <i class="icon-coin" />
                </label>
                <input
                  type="radio"
                  id="emerald"
                  name="price-type"
                  value="emerald"
                  v-model="price.type"
                />
                <label for="emerald" class="btn_primary">
                  <i class="icon-emerald" />
                </label>
              </div>
            </div>
          </div>
        </form>
        <button class="btn_secondary base-popup__submit" @click="editItem">
          Сохранить
        </button>
      </base-popup>
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import {
  FILTER,
  CATEGORIES,
  BUY_ITEM,
  SUCCESSFUL_BOUGHT,
  EDIT_ITEM,
} from "@/constants/popups";
import { Types } from "./constants/store.types";
import { price } from "@/constants/mixins";
const BaseCounter = () => import("./components/BaseCounter.vue");
const BasePopup = () => import("./components/BasePopup.vue");
const CardAdd = () => import("./components/CardAdd.vue");
const CardProduct = () => import("@/components/CardProduct.vue");

// eslint-disable-next-line no-unused-vars
const convertToCorrectPrice = (priceType) => {
  if (priceType === "emerald") return "priceem";
  else if (priceType === "coin") return "pricerub";
};

export default {
  name: "App",
  components: {
    CardProduct,
    CardAdd,
    BasePopup,
    BaseCounter,
  },
  data() {
    return {
      filters: [
        { icon: "alphabet-asc", value: "По алфавиту", filterBy: "name" },
        {
          icon: "alphabet-desc",
          value: "По алфавиту",
          filterBy: "name-revert",
        },
        { icon: "stairs-asc", value: "По цене", filterBy: "pricerub" },
        { icon: "stairs-desc", value: "По цене", filterBy: "pricerub-revert" },
      ],
      popups: {
        FILTER,
        CATEGORIES,
        BUY_ITEM,
        SUCCESSFUL_BOUGHT,
        EDIT_ITEM,
      },
      counter: 1,
      form: {
        search: "",
        filterBy: "",
        sortBy: [],
      },
    };
  },
  methods: {
    ...mapMutations({
      openPopup: Types.mutations.OPEN_POPUP,
      closePopup: Types.mutations.CLOSE_POPUP,
      clearSelected: Types.mutations.CLEAR_SELECTED,
    }),
    ...mapActions({
      tryToBuy: Types.actions.TRY_TO_BUY,
    }),
    buyProduct() {
      this.tryToBuy(this.resultSum).then(() =>
        this.openPopup(this.popups.SUCCESSFUL_BOUGHT)
      );
    },
    editItem() {
      // Костыли, из-за плохой архитектуры.
      // Необходимо привести price к объекту/массиву,
      // где будет описан тип валюты и её количество
      const priceValue = this.price.value;
      this.controls.priceem = "0.00";
      this.controls.pricerub = "0.00";
      this.controls[convertToCorrectPrice(this.price.type)] =
        priceValue.toFixed(2);
      console.log(this.controls);
    },
  },
  computed: {
    ...mapGetters({
      currentPopup: Types.getters.CURRENT_POPUP,
      categories: Types.getters.GET_CATEGORIES,
      selectedProduct: Types.getters.GET_SELECTED_ITEM,
      error: Types.getters.GET_ERROR,
    }),
    resultSum() {
      if (this.selectedProduct) {
        return this.counter * this.price.value;
      }
      return 0;
    },
    price() {
      if (this.selectedProduct) {
        return price(
          this.selectedProduct.priceem,
          this.selectedProduct.pricerub
        );
      }
      return {
        type: "",
        value: 0,
      };
    },
    controls() {
      // Динамические контролы в попап-окнах.
      if (this.selectedProduct) {
        return this.selectedProduct;
      }
      // Если открывается окно создания
      return {
        name: "",
        catid: "",
        itemname: "",
        img: "",
        extra: "",
        amount: 1,
        stacksize: 64,
        sort: 0,
      };
    },
    products() {
      let products = this.$store.getters[Types.getters.GET_ITEMS];
      if (this.form.sortBy.length) {
        products = this.$store.getters[Types.getters.SORT_ITEMS](
          products,
          this.form.sortBy
        );
      }
      if (this.form.search) {
        products = this.$store.getters[Types.getters.SEARCH_ITEMS](
          products,
          this.form.search.toLowerCase()
        );
      }
      if (this.form.filterBy) {
        products = this.$store.getters[Types.getters.FILTER_ITEMS](
          products,
          this.form.filterBy
        );
      }
      return products;
    },
  },
};
</script>