<template>
    <div class="main-content" :style="{ '--color': color }">
        <!-- 顶部图片 -->
        <div class="top-image">
            <img :src="topImage" alt="Cat on grass" />
        </div>

        <!-- 欢迎区域 -->
        <div class="welcome-section">
            <div class="avatar-container">
                <el-avatar :size="100" :src="userAvatar"></el-avatar>
            </div>
            <h1 class="greeting">Good {{ welcomeName }}</h1>
            <h2 class="introduction">
                I'm <span class="name">Lovejoy</span>, Nice to meet you!
            </h2>
        </div>

        <!-- 社交链接 -->
        <div class="social-links">
            <el-button type="info" class="social-btn">
                <el-icon><Link /></el-icon>
                GitHub
            </el-button>
            <el-button type="warning" class="social-btn">
                <el-icon><Link /></el-icon>
                联系方式
            </el-button>
            <el-button type="primary" class="social-btn">
                <el-icon><Message /></el-icon>
                消息
            </el-button>
        </div>

        <!-- 随机推荐 -->
        <div class="recommendation">
            <h3 class="section-title">随机推荐</h3>
            <div class="recommendation-card">
                <div class="recommendation-icon">
                    <span class="ui-icon">UI</span>
                </div>
                <h4 class="recommendation-title">Neumorphism</h4>
                <p class="recommendation-desc">
                    鲜明的设计风格，总是给人一种干净的感觉，包括热门的
                    Button、Loader 设计，...
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, computed, watch } from "vue";
import { Link, Message } from "@element-plus/icons-vue";

// 注入颜色变量
const color = inject("color", ref("#de5930"));

const welcomeName = ref("");
const date = new Date();
const hour = date.getHours();
if (hour >= 12 && hour < 18) {
    welcomeName.value = "Afternoon";
} else if (hour >= 18 && hour < 24) {
    welcomeName.value = "Evening";
} else {
    welcomeName.value = "Morning";
}

// 图片资源 - 使用固定的图片ID以确保一致性
const images = {
    red: "https://picsum.photos/id/63/800/400", // 红色调图片
    orange: "https://picsum.photos/id/1016/800/400", // 橙色调图片
    yellow: "https://picsum.photos/id/464/800/400", // 黄色调图片
    green: "https://picsum.photos/id/1039/800/400", // 绿色调图片
    blue: "https://picsum.photos/id/1015/800/400", // 蓝色调图片
    purple: "https://picsum.photos/id/82/800/400", // 紫色调图片
    pink: "https://picsum.photos/id/360/800/400", // 粉色调图片
    gray: "https://picsum.photos/id/58/800/400", // 灰色调图片
};

// 将颜色转换为RGB值
const getRGBFromColor = (color) => {
    // 处理十六进制颜色
    if (color.startsWith("#")) {
        const hex = color.replace("#", "");
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        return { r, g, b };
    }
    // 处理rgb/rgba颜色
    if (color.startsWith("rgb")) {
        const match = color.match(/\d+/g);
        if (match && match.length >= 3) {
            return {
                r: parseInt(match[0]),
                g: parseInt(match[1]),
                b: parseInt(match[2]),
            };
        }
    }
    // 默认返回橙色
    return { r: 222, g: 89, b: 48 };
};

// 根据颜色选择匹配的图片
const getImageByColor = (color) => {
    const { r, g, b } = getRGBFromColor(color);

    // 计算颜色的亮度和饱和度
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const brightness = (max + min) / 2;

    // 计算饱和度，避免分母为0的情况
    let saturation = 0;
    if (max !== min) {
        const denominator = 1 - Math.abs((2 * brightness) / 255 - 1);
        if (denominator > 0.01) {
            // 避免分母过小
            saturation = (max - min) / denominator / 255;
        } else {
            saturation = 1; // 当亮度接近0或255时，饱和度设为1
        }
    }

    // 首先处理灰度或低饱和度颜色
    if (saturation < 0.1) {
        return images.gray;
    }

    // 颜色分类
    if (r > g && r > b) {
        if (g / r > 0.7) {
            // 红中带黄，判断是否为橙色
            if (g / r > 0.85) {
                return images.orange;
            } else {
                return images.yellow;
            }
        } else {
            return images.red;
        }
    } else if (g > r && g > b) {
        return images.green;
    } else if (b > r && b > g) {
        if (r / b > 0.6) {
            // 蓝中带红，判断是否为紫色或粉色
            if (r / b > 0.8) {
                return images.pink;
            } else {
                return images.purple;
            }
        } else {
            return images.blue;
        }
    } else {
        return images.gray;
    }
};

// 计算当前颜色对应的图片
const topImage = computed(() => {
    return getImageByColor(color.value);
});

const userAvatar =
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20character%20avatar%20with%20green%20plant%20on%20head&image_size=square";

watch(
    color,
    (newColor) => {
        console.log("颜色变了！新颜色是:", newColor);
        console.log("当前计算出的图片应该是:", getImageByColor(newColor));
    },
    { immediate: true },
);
</script>

<style lang="scss" scoped>
// 使用 CSS 变量替代 SCSS 变量
// $color: #de5930;

.main-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 20px;

    .top-image {
        width: 100%;
        padding: 10px;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border: 2px solid #fff;
        box-shadow: inset 0 0 10px 0 #fff;

        img {
            border-radius: 16px;
            overflow: hidden;
            width: 100%;
            height: auto;
            object-fit: cover;
            vertical-align: top;
            transition: all 0.3s;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            }
        }
    }

    .welcome-section {
        text-align: center;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 40px;
        box-shadow:
            0 4px 12px rgba(0, 0, 0, 0.1),
            inset 0 0 10px 0 #fff;
        border: 2px solid #fff;
        backdrop-filter: blur(10px);
        transition: all 0.3s;

        &:hover {
            transform: translateY(-2px);
            box-shadow:
                0 8px 24px rgba(0, 0, 0, 0.15),
                inset 0 0 10px 0 #fff;
        }

        .avatar-container {
            margin-bottom: 20px;
        }

        .greeting {
            margin: 0 0 10px 0;
            font-size: 24px;
            font-weight: 600;
            color: #333;
        }

        .introduction {
            margin: 0;
            font-size: 18px;
            color: #666;

            .name {
                background: linear-gradient(
                    135deg,
                    var(--color) 0%,
                    color-mix(in srgb, var(--color), #6743f5 30%) 50%,
                    color-mix(in srgb, var(--color), #ff6b6b 70%) 100%
                );
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-weight: 600;
            }
        }
    }

    .social-links {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin: 20px 0;

        .social-btn {
            border-radius: 20px;
            padding: 8px 20px;
            transition: all 0.3s;

            &:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            }
        }
    }

    .recommendation {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 20px;
        box-shadow:
            0 4px 12px rgba(0, 0, 0, 0.1),
            inset 0 0 10px 0 #fff;
        transition: all 0.3s;

        &:hover {
            transform: translateY(-2px);
            box-shadow:
                0 8px 24px rgba(0, 0, 0, 0.15),
                inset 0 0 10px 0 #fff;
        }

        .section-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            color: #333;
        }

        .recommendation-card {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            transition: all 0.3s;
            box-shadow: inset 0 0 10px 0 #fff;
            backdrop-filter: blur(10px);

            &:hover {
                transform: translateY(-2px);
                box-shadow:
                    0 4px 12px rgba(0, 0, 0, 0.1),
                    inset 0 0 10px 0 #fff;
            }

            .recommendation-icon {
                width: 50px;
                height: 50px;
                border-radius: 10px;
                background-color: var(--color);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 18px;
                transition: all 0.3s;

                &:hover {
                    transform: scale(1.05);
                }
            }

            .recommendation-title {
                margin: 0 0 5px 0;
                font-size: 16px;
                font-weight: 600;
                color: #333;
            }

            .recommendation-desc {
                margin: 0;
                font-size: 14px;
                color: #666;
                line-height: 1.4;
                flex: 1;
            }
        }
    }
}
</style>
