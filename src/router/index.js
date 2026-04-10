import { createRouter, createWebHashHistory } from "vue-router";
import layout from "@/components/layout.vue";
import {
    MapLocation,
    Document,
    ChatDotRound,
    Star,
    Grid as Project,
} from "@element-plus/icons-vue";

// 创建路由配置
const routeConfig = [
    {
        path: "/",
        component: layout,
        children: [
            {
                path: "articles",
                component: () => import("@/views/Articles.vue"),
                meta: {
                    title: "近期文章",
                    icon: "Notebook",
                },
            },
            {
                path: "projects",
                component: () => import("@/views/Projects.vue"),
                meta: {
                    title: "我的项目",
                    icon: Project,
                },
            },

            {
                path: "aboutus",
                component: () => import("@/views/AboutUs.vue"),
                meta: {
                    title: "关于网站",
                    icon: "Help",
                },
            },
            {
                path: "recommendation",
                component: () => import("@/views/Recommendation.vue"),
                meta: {
                    title: "推荐分享",
                    icon: "Star",
                },
            },

            {
                path: "blogs",
                component: () => import("@/views/Blogs.vue"),
                meta: {
                    title: "优秀博客",
                    icon: "PriceTag",
                },
            },
        ],
    },
];

// 创建路由实例
const router = createRouter({
    history: createWebHashHistory(),
    routes: [...routeConfig],
});

export default router;
