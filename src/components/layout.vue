<template>
    <div class="container" :style="{ '--color': color }">
        <div class="background">
            <div class="color1"></div>
            <div class="color2"></div>
        </div>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import { ref, provide, watch } from "vue";

// 从localStorage读取颜色值，如果没有则使用默认值
const savedColor = localStorage.getItem("themeColor");
const color = ref(savedColor || "#de5930");

// 监听颜色变化，保存到localStorage
watch(color, (newColor) => {
    localStorage.setItem("themeColor", newColor);
});

// 提供颜色变量给子组件
provide("color", color);
</script>

<style lang="scss" scoped>
// 使用 CSS 变量替代 SCSS 变量
// var(--color): #de5930;
$offset_x: 8px;
$offset_y: 8px;

.container {
    position: relative;
    min-height: 100vh;
    background: #e9eaeb;
    overflow: hidden;
    z-index: 2;
    .background {
        position: absolute;
        top: calc($offset_y / 2);
        left: calc($offset_x / 2);
        width: calc(100% - $offset_x);
        height: calc(100% - $offset_y);
        z-index: 1;
        background: linear-gradient(135deg, #ffffff 0%, #c3cfe2 100%);
        border-radius: 1%;
        .color1 {
            position: absolute;
            top: 700px;
            left: 1000px;
            width: 300px;
            height: 300px;
            filter: blur(150px);
            background-color: var(--color);
            box-shadow:
                0 0 20px 100px
                    color-mix(
                        in srgb,
                        var(--color),
                        rgba(223, 195, 215, 0.781) 70%
                    ),
                0 0 40px 200px
                    color-mix(in srgb, var(--color), rgb(214, 130, 130) 50%);
        }

        .color2 {
            position: absolute;
            top: 620px;
            left: 300px;
            width: 200px;
            height: 200px;
            filter: blur(150px);
            background-color: color-mix(
                in srgb,
                var(--color),
                rgb(207, 188, 13) 50%
            );
            box-shadow:
                0 0 20px 100px
                    color-mix(
                        in srgb,
                        var(--color),
                        rgba(129, 190, 227, 0.5) 70%
                    ),
                0 0 40px 200px
                    color-mix(
                        in srgb,
                        var(--color),
                        rgba(245, 174, 21, 0.3) 50%
                    );
        }
    }

    .content {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 1200px;
        margin: 20px auto;
        .el-main {
            padding: 20px;
            background: transparent;
            // background-color: rgba(255, 255, 255, 0.1);
            // backdrop-filter: blur(10px);
        }
    }
}
</style>
