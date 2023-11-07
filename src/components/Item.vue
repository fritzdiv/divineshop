<template>
    <div class="itemCard" @click="goToProduct">
        <div class="imgWrap q-px-sm bg-grey-1">
            <q-img :src="info.ThumbNail"
                   fit="contain"
                   height="100%"
                   width="100%"
                   no-spinner
            />
        </div>
        <p v-if="info.PromoDiscount" class="discountBadgeThumbNail">
            {{ discount }}%
        </p>
        <div class="full-width full-height col justify-between relative-position">
            <div class="row q-mb-sm description">{{ info.Description }} <span class="text-primary">{{ displayNew }}</span></div>
            <div class="row justify-between">
                <div class="flex">
                    <p v-if="info.PromoDiscount != null" class="text-strike text-grey-7 q-pr-sm">
                        ${{ displayRegularPrice }}
                    </p>
                    <p class="text-green-8 text-weight-bold">${{ displayDiscountedPrice }}</p>
                </div>
            </div>
        </div>
        <div v-if="showCartQuantityControl" class="full-width absolute-bottom">
            <quantity-control :product="info"></quantity-control>
        </div>
    </div>
</template>

<script>
import QuantityControl from "src/components/QuantityControl.vue";

export default {
    name: "Product",
    components: {
        QuantityControl,
    },
    props: {
        info: {
            type: Object,
            default: () => {
                return {};
            }
        },
        showCartQuantityControl: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        discount() {
            return parseFloat(100 * this.info.PromoDiscount).toFixed(0);
        },
        displayRegularPrice() {
            return this.info.RootCollectionID == 84 ? this.info.SFPrice : this.info.DefaultPrice;
        },
        displayNew() {
            return this.info.ThirdCollectionMemo === 'New!' ? ' - New!' : '';
        },
        displayDiscountedPrice() {
            return this.info.RootCollectionID == 84 ? (this.info.DiscountedSFPrice !== null ? `${this.info.DiscountedSFPrice}/SF` : `${this.info.DefaultPrice}/${this.info.SaleOuM}`) : `${this.info.DiscountedDefaultPrice}/${this.info.SaleOuM}`;
        },

    },
    methods: {
        goToProduct() {
            this.$router.push("/product/" + this.info.ID);
        },
    },
};
</script>
<style lang="scss" scoped>
.itemCard {
    background-color: #ffffff;
    border-radius: 7px;
    display: flex;
    flex-direction: column;
    //row-gap: 0.10rem;
    align-items: center;
    position: relative;
    padding: 10px 10px;
}
.imgWrap {
    width: 100%;
    min-width: 150px;
    height: 150px;
    border-radius: 7px;
    background-color: #eaeaea;
}
.imgWrap:deep(img) {
    border-radius: 10px;
}
.description {
    padding-top: 0.5rem;
    font-size: 0.9rem;
    line-height: 1rem;
}
.qtyControl {
    margin-top: -10px;
}
</style>
<style>
.qtyControl .q-field--dense .q-field__control, .qtyControl .q-field--dense .q-field__marginal {
    height: 24px;
}
.qtyControl .q-field--outlined .q-field__control {
    border-radius: 12px;
    padding: 0;
}
</style>
