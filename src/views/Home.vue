<template>
    <div class="container">
        <div class="aside sidebar"><SideBar /></div>
        <div class="main"><MainBar /></div>
        <div class="aside calendar"><Calendar /></div>
    </div>
</template>

<script setup>
import SideBar from "../components/SideBar.vue";
import MainBar from "../components/MainBar.vue";
import Calendar from "../components/Calendar.vue";
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    width: 100%;
    max-width: 1200px;
    margin: 20px auto;
    position: relative;
    z-index: 1;
    gap: 20px;
    background-color: transparent;

    .aside {
        width: 320px;
    }

    .main {
        flex: 1;
        padding: 20px;
        background: transparent;
    }
}
</style>
