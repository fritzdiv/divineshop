<template>
    <div class="itemCard">
        <div class="imgWrap q-px-sm bg-grey-1">
            <q-skeleton height="100px" square />
        </div>
        <q-card-section style="width: 100%">
            <q-skeleton type="text" class="text-subtitle1" />
            <q-skeleton type="text" width="50%" class="text-subtitle1" />
        </q-card-section>
    </div>
</template>

<script>
export default {
    name: "ItemSkeleton",
    setup() {
        return {};
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
    border-radius: 7px;
    background-color: #eaeaea;
}
.imgWrap:deep(img) {
    border-radius: 10px;
}
</style>
