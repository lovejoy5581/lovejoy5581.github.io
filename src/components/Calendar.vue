<template>
    <div class="right-panel" :style="{ '--color': color }">
        <!-- 写文章按钮 -->
        <div class="write-article">
            <el-button type="danger" class="write-btn">
                <el-icon><Edit /></el-icon>
                写文章
            </el-button>

            <div class="more-btn-container">
                <el-button type="default" class="more-btn">
                    <el-icon><More /></el-icon>
                </el-button>
                <div class="more-button color-button">
                    <el-color-picker
                        v-model="color"
                        show-alpha
                        class="color-picker-popup"
                        @change="updateColor"
                        size="small"
                    >
                        <template #reference>
                            <el-button type="text" class="color-button-icon">
                                <el-icon><Brush /></el-icon>
                            </el-button>
                        </template>
                    </el-color-picker>
                </div>
                <el-button type="default" class="more-button">
                    <el-icon class><Setting /></el-icon>
                </el-button>
                <el-button type="default" class="more-button">
                    <el-icon><Bell /></el-icon>
                </el-button>
                <el-button type="default" class="more-button">
                    <el-icon><Message /></el-icon>
                </el-button>
            </div>
        </div>

        <!-- 时钟 -->
        <div class="clock">
            <div class="time">{{ currentTime }}</div>
        </div>

        <!-- 日历 -->
        <div class="calendar">
            <div class="calendar-header">
                <h3 class="calendar-title">{{ currentDate }}</h3>
            </div>
            <div class="calendar-weekdays">
                <span
                    v-for="(day, index) in weekdays"
                    :key="day"
                    class="weekday"
                    :class="{
                        'current-weekday':
                            index + 1 === currentWeekday ||
                            (index === 6 && currentWeekday === 0),
                    }"
                    >{{ day }}</span
                >
            </div>
            <div class="calendar-days">
                <span
                    v-for="(day, index) in daysInMonth"
                    :key="`${day}-${index}`"
                    class="day"
                    :class="{ active: day === currentDay, empty: day === null }"
                >
                    {{ day || "" }}
                </span>
            </div>
        </div>

        <!-- 随机音乐 -->
        <div class="music-player">
            <div class="music-container">
                <div class="music-icon">
                    <el-icon class="music-note"><Headset /></el-icon>
                </div>
                <div class="music-info">
                    <select
                        v-model="currentSong"
                        class="music-title-select"
                        @change="changeSong"
                    >
                        <option
                            v-for="song in songs"
                            :key="song.id"
                            :value="song.id"
                        >
                            {{ song.title }}
                        </option>
                    </select>
                    <div class="music-progress">
                        <div
                            class="progress-bar"
                            :style="{ width: progress + '%' }"
                        ></div>
                    </div>
                </div>
                <el-button type="default" class="play-btn" @click="togglePlay">
                    <el-icon v-if="!isPlaying"><VideoPlay /></el-icon>
                    <el-icon v-else><VideoPause /></el-icon>
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from "vue";

// 从父组件注入颜色变量
const color = inject("color", ref("#de5930"));
const currentTime = ref("");
const currentDate = ref("");
const currentDay = ref(0);
const currentWeekday = ref(0); // 0-6，0表示周日，1-6表示周一到周六
const weekdays = ["一", "二", "三", "四", "五", "六", "日"];
const daysInMonth = ref([]);
const volume = ref(50);

// 音乐播放相关 - 使用免费音频CDN
const songs = ref([
    {
        id: 1,
        title: "Close To You",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
        id: 2,
        title: "Yesterday Once More",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
        id: 3,
        title: "My Heart Will Go On",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
    {
        id: 4,
        title: "Shape of You",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    },
    {
        id: 5,
        title: "Perfect",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    },
]);
const currentSong = ref(1);
const isPlaying = ref(false);
const progress = ref(0);
const audio = ref(null);

// 切换播放/暂停
const togglePlay = () => {
    if (isPlaying.value) {
        pauseMusic();
    } else {
        playMusic();
    }
};

// 播放音乐
const playMusic = () => {
    if (!audio.value) {
        audio.value = new Audio();
        audio.value.addEventListener("timeupdate", updateProgress);
        audio.value.addEventListener("ended", () => {
            isPlaying.value = false;
            progress.value = 0;
        });
    }

    const song = songs.value.find((s) => s.id === currentSong.value);
    if (song) {
        audio.value.src = song.url;
        audio.value.play().catch((error) => {
            console.error("播放失败:", error);
        });
        isPlaying.value = true;
    }
};

// 暂停音乐
const pauseMusic = () => {
    if (audio.value) {
        audio.value.pause();
        isPlaying.value = false;
    }
};

// 切换歌曲
const changeSong = () => {
    if (isPlaying.value) {
        playMusic();
    }
    progress.value = 0;
};

// 更新播放进度
const updateProgress = () => {
    if (audio.value && audio.value.duration) {
        progress.value = (audio.value.currentTime / audio.value.duration) * 100;
    }
};

// 组件卸载时停止播放
onUnmounted(() => {
    if (audio.value) {
        audio.value.pause();
        audio.value = null;
    }
});

// 更新颜色
const updateColor = (newColor) => {
    color.value = newColor;
};

const updateDateTime = () => {
    const now = new Date();

    // 更新时间
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    currentTime.value = `${hours}:${minutes}:${seconds}`;

    // 更新日期
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const weekday = weekdays[now.getDay() === 0 ? 6 : now.getDay() - 1];
    currentDate.value = `${year}/${month}/${day} \t周${weekday}`;
    currentDay.value = now.getDate();
    currentWeekday.value = now.getDay(); // 0-6，0表示周日，1-6表示周一到周六
};

const generateDaysInMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // 获取当月第一天是星期几（0-6，0表示周日）
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // 获取当月的天数
    const days = new Date(year, month + 1, 0).getDate();

    // 生成日期数组，包括空白日期
    const daysArray = [];

    // 添加空白日期（如果当月第一天不是周一）
    const startIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // 调整为从周一开始
    for (let i = 0; i < startIndex; i++) {
        daysArray.push(null);
    }

    // 添加当月日期
    for (let i = 1; i <= days; i++) {
        daysArray.push(i);
    }

    daysInMonth.value = daysArray;
};

onMounted(() => {
    updateDateTime();
    generateDaysInMonth();
    const timer = setInterval(updateDateTime, 1000); // 每秒更新一次
    onUnmounted(() => clearInterval(timer));
});
</script>

<style lang="scss" scoped>
// 使用 CSS 变量替代 SCSS 变量
// $color: #de5930;

.right-panel {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .write-article {
        display: flex;
        // justify-content: space-between;
        align-items: center;
        margin-top: 80px;

        .write-btn {
            border-radius: 20px;
            padding: 8px 20px;
            font-weight: 600;
            background-color: var(--color);
            border-color: var(--color);
            margin-right: 50px;
            transition: all 0.3s;

            &:hover {
                background-color: var(--color);
                border-color: var(--color);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            }
        }

        .color-picker {
            margin: 0 10px;
        }

        .more-btn-container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            // width: 100px;
            // height: 100px;
            transition: all 0.3s ease;

            .more-btn {
                position: absolute;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                // padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
                z-index: 10;

                &:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }
            }

            .more-button {
                position: absolute;
                margin-left: 0;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease 0.5s;
                background-color: rgba(255, 255, 255, 0.9);
                border: 1px solid rgba(255, 255, 255, 0.5);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

                &:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                &.color-button {
                    background: linear-gradient(
                        135deg,
                        var(--color) 0%,
                        color-mix(in srgb, var(--color), #6743f5 30%) 50%,
                        color-mix(in srgb, var(--color), #ff6b6b 70%) 100%
                    );
                    border: none;
                    color: white;
                    cursor: pointer;

                    &:hover {
                        transform: scale(1.1);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    }

                    .color-picker-popup {
                        position: absolute;
                        top: 100%;
                        left: 50%;
                        transform: translateX(-50%);
                        margin-top: 8px;
                        z-index: 100;
                        border: 0px solid rgba(255, 255, 255, 0.5);
                    }

                    .color-button-icon {
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        border: none;
                        padding: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(
                            135deg,
                            var(--color) 0%,
                            color-mix(in srgb, var(--color), #6743f5 30%) 50%,
                            color-mix(in srgb, var(--color), #ff6b6b 70%) 100%
                        );
                        color: white;
                        transition: all 0.3s ease;

                        &:hover {
                            transform: scale(1.1);
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        }

                        .el-icon {
                            font-size: 16px;
                        }
                    }
                }
                // }
            }

            &:hover {
                opacity: 1;
                visibility: visible;
                // 均匀圆形扩散（4个按钮 90° 分布）
                .more-button:nth-child(2) {
                    transform: translate(-38px, -45px);
                    transition-delay: 0.1s;
                }

                .more-button:nth-child(3) {
                    transform: translate(10px, -59px);
                    transition-delay: 0.2s;
                }

                .more-button:nth-child(4) {
                    transform: translate(51px, -30px);
                    transition-delay: 0.3s;
                }

                .more-button:nth-child(5) {
                    transform: translate(56px, 20px);
                    transition-delay: 0.4s;
                }
            }
        }
    }

    .clock {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 20px;
        text-align: center;
        margin: 20px 0;
        transition: all 0.3s;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: inset 0 0 10px 0 #fff;
        backdrop-filter: blur(10px);

        &:hover {
            transform: translateY(-2px);
            box-shadow:
                0 4px 12px rgba(0, 0, 0, 0.1),
                inset 0 0 10px 0 #fff;
        }

        .time {
            font-size: 32px;
            font-weight: 600;
            color: #333;
            font-family: "Courier New", monospace;
            display: flex;
            align-items: center;
            gap: 5px;
            background-color: #cbb493;
            border-radius: 8px;
            padding: 10px 20px;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);

            .time-part {
                position: relative;
                display: inline-block;
                min-width: 40px;
                text-align: center;
                transition: all 0.3s ease;
                font-family: "Digital", monospace;

                &.updating {
                    opacity: 0;
                    transform: translateY(100%);
                    transition: all 0.3s ease;
                }
            }

            .time-separator {
                display: inline-block;
                transition: all 0.3s ease;
                font-family: "Digital", monospace;
            }
        }
    }

    .calendar {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 15px;
        box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.05),
            inset 0 0 10px 0 #fff;
        transition: all 0.3s;

        &:hover {
            transform: translateY(-2px);
            box-shadow:
                0 4px 12px rgba(0, 0, 0, 0.1),
                inset 0 0 10px 0 #fff;
        }

        .calendar-header {
            margin-bottom: 10px;

            .calendar-title {
                font-size: 14px;
                font-weight: 600;
                margin: 0;
                color: #999;
            }
        }

        .calendar-weekdays {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;
            margin-bottom: 10px;

            .weekday {
                font-size: 12px;
                color: #999;
                text-align: center;
                padding: 5px 0;
                transition: all 0.3s;

                &.current-weekday {
                    color: var(--color);
                    font-weight: 600;
                }
            }
        }

        .calendar-days {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;

            .day {
                font-size: 14px;
                text-align: center;
                padding: 8px 0;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s;
                color: #999;

                &:hover {
                    background-color: rgba(var(--color), 0.1);
                }

                &.active {
                    background: linear-gradient(
                        135deg,
                        var(--color) 0%,
                        color-mix(in srgb, var(--color), #6743f5 30%) 50%,
                        color-mix(in srgb, var(--color), #ff6b6b 70%) 100%
                    );
                    border: 1.5px solid #fff;
                    color: white;
                    font-weight: 600;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }

                &.empty {
                    cursor: default;
                    background: transparent;

                    &:hover {
                        background: transparent;
                    }
                }
            }
        }
    }

    .music-player {
        margin: 20px 0;

        .music-container {
            background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.1) 0%,
                rgba(255, 255, 255, 0.05) 100%
            );
            border-radius: 20px;
            padding: 15px;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow:
                0 4px 12px rgba(0, 0, 0, 0.05),
                inset 0 0 10px 0 rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(10px);
            transition: all 0.3s;

            &:hover {
                transform: translateY(-2px);
                box-shadow:
                    0 6px 16px rgba(0, 0, 0, 0.1),
                    inset 0 0 10px 0 rgba(255, 255, 255, 0.5);
            }

            .music-icon {
                .music-note {
                    font-size: 24px;
                    background: linear-gradient(
                        135deg,
                        var(--color) 0%,
                        color-mix(in srgb, var(--color), #6743f5 30%) 50%,
                        color-mix(in srgb, var(--color), #ff6b6b 70%) 100%
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
            }

            .music-info {
                flex: 1;

                .music-title-select {
                    margin: 0 0 8px 0;
                    font-size: 14px;
                    font-weight: 600;
                    width: 100%;
                    // background: rgba(255, 255, 255, 0.1);
                    // border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    padding: 6px 12px;
                    color: #333;
                    appearance: none;
                    // background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23333' d='M8 11l-5-5h10z'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 8px center;
                    background-size: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;

                    &:hover {
                        border-color: var(--color);
                    }

                    &:focus {
                        outline: none;
                        border-color: var(--color);
                        box-shadow: 0 0 0 2px rgba(var(--color), 0.2);
                    }

                    option {
                        background: rgba(255, 255, 255, 0.1);
                        color: #333;
                        padding: 8px 12px;
                    }

                    option:hover {
                        background: rgba(var(--color), 0.1);
                    }

                    option:checked {
                        background: var(--color);
                        color: white;
                    }
                }

                .music-progress {
                    width: 100%;
                    height: 4px;
                    background-color: rgba(0, 0, 0, 0.1);
                    border-radius: 2px;
                    overflow: hidden;

                    .progress-bar {
                        height: 100%;
                        background: linear-gradient(
                            90deg,
                            var(--color) 0%,
                            color-mix(in srgb, var(--color), #6743f5 50%) 100%
                        );
                        border-radius: 2px;
                    }
                }
            }

            .play-btn {
                border-radius: 50%;
                width: 36px;
                height: 36px;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                transition: all 0.3s;

                &:hover {
                    transform: scale(1.05);
                    background-color: rgba(255, 255, 255, 0.3);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }
            }
        }
    }

    .like-section {
        margin-top: auto;
        text-align: center;

        .like-btn {
            border-radius: 20px;
            padding: 8px 20px;
            font-weight: 600;
            background-color: var(--color);
            border-color: var(--color);
            transition: all 0.3s;

            &:hover {
                background-color: var(--color);
                border-color: var(--color);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            }

            .like-count {
                margin-left: 5px;
            }
        }
    }
}
</style>
