<template>
    <div class="sidebar-container" :style="{ '--color': color }">
        <!-- 导航栏方框 -->
        <div class="nav-box">
            <div class="user-info">
                <el-avatar size="large" :src="userAvatar"></el-avatar>
                <h2 class="username">Lovejoy</h2>
                <p class="status">开发中</p>
            </div>
            <div class="menu-container">
                <h3 class="menu-title">GENERAL</h3>
                <div class="menu-items" ref="menuContainer">
                    <!-- 修复：使用函数式ref正确收集循环DOM元素 -->
                    <div
                        @click="selectMenu(item.path)"
                        @mouseenter="hoverMenu(index)"
                        v-for="(item, index) in menuList"
                        :key="item.path"
                        :class="[
                            'menu-item',
                            { active: index === activeIndex },
                        ]"
                        :ref="setMenuItemRef"
                    >
                        <el-icon class="menu-icon">
                            <component :is="item.meta.icon"></component>
                        </el-icon>
                        <span class="menu-text">{{ item.meta.title }}</span>
                    </div>
                    <div class="menu-indicator" ref="menuIndicator"></div>
                </div>
            </div>
        </div>

        <!-- 最新文章方框 -->
        <div class="article-box">
            <h3 class="section-title">最新文章</h3>
            <div class="article-item">
                <el-image
                    :src="iconUrl"
                    style="width: 80px; height: 80px; border-radius: 10px"
                    fit="cover"
                ></el-image>
                <div class="article-info">
                    <h4 class="article-title">模型动画笔记</h4>
                    <p class="article-desc">骨骼与动画</p>
                    <p class="article-date">2026/2/3</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    ref,
    onMounted,
    onUnmounted,
    onBeforeUpdate,
    nextTick,
    inject,
} from "vue";
import { useRouter } from "vue-router";

// 注入颜色变量
const color = inject("color", "#de5930");

const iconUrl = new URL("@/assets/image.png", import.meta.url).href;
const router = useRouter();
// 头像地址
const userAvatar =
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20character%20avatar%20with%20green%20plant%20on%20head&image_size=square";

// 核心DOM引用
const menuContainer = ref(null);
const menuIndicator = ref(null);
const menuItems = ref([]); // 存储所有菜单项DOM元素
const activeIndex = ref(0); // 当前选中的菜单项索引

// 修复1：路由数据容错，提前过滤有效路由，避免循环失效
const menuList =
    router.options.routes[0]?.children?.filter(
        (item) => item.meta?.title && item.meta?.icon,
    ) || [];

// 修复2：正确的函数式ref，收集v-for循环的所有DOM元素
const setMenuItemRef = (el) => {
    if (el) {
        menuItems.value.push(el);
    }
};

// 修复3：列表更新前重置ref数组，避免脏数据导致索引错乱
onBeforeUpdate(() => {
    menuItems.value = [];
});

// 菜单点击跳转
const selectMenu = (path) => {
    router.push(path);
};

// 修复4：hover时的定位计算，使用offsetTop精准获取相对父容器位置，加完整容错
const hoverMenu = (index) => {
    // 容错：元素不存在直接返回，避免报错
    if (!menuIndicator.value || !menuItems.value[index] || !menuContainer.value)
        return;

    // 更新当前选中的菜单项索引
    activeIndex.value = index;

    const targetItem = menuItems.value[index];
    // 直接获取相对于定位父级(menu-items)的top值和高度，100%精准
    menuIndicator.value.style.top = `${targetItem.offsetTop}px`;
    menuIndicator.value.style.height = `${targetItem.offsetHeight}px`;
};

// 修复5：初始化时用nextTick确保DOM完全渲染后再计算位置
onMounted(async () => {
    // 等待DOM渲染完成
    await nextTick();
    // 容错：无菜单项不执行初始化
    if (!menuIndicator.value || menuItems.value.length === 0) return;

    // 初始化指示器位置到第一个菜单项
    const firstItem = menuItems.value[0];
    menuIndicator.value.style.top = `${firstItem.offsetTop}px`;
    menuIndicator.value.style.height = `${firstItem.offsetHeight}px`;
});

onUnmounted(() => {
    // 清理内存
    menuItems.value = [];
});
</script>

<style lang="scss" scoped>
// 变量定义
// 使用 CSS 变量替代 SCSS 变量
// var(--color): #de5930;
$box-bg: rgba(255, 255, 255, 0.1);
$box-radius: 16px;
$box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
$transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); // 优化动画曲线，更丝滑

// 混合宏
@mixin box-style {
    background-color: $box-bg;
    border-radius: $box-radius;
    padding: 20px;
    margin: 0 10px;
    box-shadow: $box-shadow;
    overflow: hidden;
    backdrop-filter: blur(10px);
}

.sidebar-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    margin-top: 100px;

    // 导航栏方框
    .nav-box {
        @include box-style;
        position: relative;
        border: 2px solid #fff;
        box-shadow: inset 0 0 10px 0 #fff;

        .user-info {
            text-align: center;
            margin-bottom: 20px;

            .username {
                margin: 10px 0 5px 0;
                font-size: 18px;
                font-weight: 600;
                color: var(--color);
            }

            .status {
                margin: 0;
                font-size: 14px;
                color: #999;
            }
        }

        .menu-container {
            position: relative;
            overflow: hidden;

            .menu-title {
                font-size: 14px;
                font-weight: 600;
                color: #999;
                margin-bottom: 10px;
                padding-left: 20px;
            }

            .menu-items {
                position: relative; /* 必须保留：作为offsetParent，offsetTop才会相对于这个容器计算 */
                margin-left: 20px;

                .menu-item {
                    position: relative;
                    height: 50px;
                    line-height: 50px;
                    margin: 5px 0;
                    padding: 0 20px;
                    border-radius: 10px;
                    transition: $transition;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 2;

                    .menu-icon {
                        color: #999;
                        transition: $transition;
                        font-size: 16px;
                    }

                    .menu-text {
                        color: #999;
                        font-weight: 550;
                        transition: $transition;
                    }

                    &:hover,
                    &.active {
                        .menu-icon {
                            color: var(--color);
                        }

                        .menu-text {
                            color: #333;
                            font-weight: 600;
                        }
                    }
                }

                .menu-indicator {
                    position: absolute;
                    left: 0;
                    width: 100%;
                    background-color: rgba(255, 255, 255, 0.8);
                    border-radius: 25px;
                    transition: $transition;
                    z-index: 1;
                    height: 50px;
                    top: 0;
                    pointer-events: none; /* 修复：避免指示器遮挡鼠标hover事件 */
                }
            }
        }
    }

    // 最新文章方框
    .article-box {
        @include box-style;
        border: 2px solid #fff;
        box-shadow: inset 0 0 10px 0 #fff;

        .section-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            color: #333;
        }

        .article-item {
            display: flex;
            gap: 10px;
            padding: 15px;
            background-color: $box-bg;
            border-radius: 10px;
            transition: $transition;
            cursor: pointer;
            backdrop-filter: blur(10px);
            box-shadow: inset 0 0 10px 0 #fff;

            &:hover {
                transform: translateY(-2px);
                box-shadow:
                    inset 0 0 10px 0 #fff,
                    $box-shadow;
            }

            .article-info {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;

                .article-title {
                    margin: 0 0 5px 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: #333;
                }

                .article-desc {
                    margin: 0 0 5px 0;
                    font-size: 12px;
                    color: #666;
                    line-height: 1.4;
                }

                .article-date {
                    margin: 0;
                    font-size: 11px;
                    color: #999;
                }
            }
        }
    }
}
</style>
