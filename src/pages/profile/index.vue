<template>
  <view class="page-container">
    <scroll-view scroll-y class="scroll-container">
      
      <!-- 背景装饰 -->
      <text class="decor d-heart-1">♥</text>
      <text class="decor d-star-1">★</text>
      <view class="decor d-pill"></view>

      <!-- 1. 头部个人资料 -->
      <header class="profile-header clay-pink">
        <view class="avatar-wrap clay-interactive">
          <image src="https://api.dicebear.com/7.x/notionists/svg?seed=Lily&backgroundColor=fdf5d3" mode="aspectFill"></image>
        </view>
        <view class="user-info">
          <view class="user-name">{{ userStore.user?.username || '捏捏达人' }}</view>
          <view class="level-badge clay-interactive">
            <text class="badge-icon">💎</text>
            <text>1 等级</text>
          </view>
        </view>
        <view class="btn-edit clay-yellow clay-interactive">编辑资料</view>
      </header>

      <!-- 2. 数据统计卡片 -->
      <view class="stats-row">
        <view class="stat-card clay-yellow clay-interactive">
          <view class="stat-title">我的作品</view>
          <view class="stat-val" style="color: #c4a150;">32</view>
          <view class="stat-icons">
            <text style="color: #a0ebd8;">⊞</text>
            <text style="color: #abcce9;">⊞</text>
            <text style="color: #ffb5c5;">⊞</text>
          </view>
        </view>
        <view class="stat-card clay-blue clay-interactive">
          <view class="stat-title">粉丝</view>
          <view class="stat-val" style="color: #6482a3;">300</view>
        </view>
        <view class="stat-card clay-green clay-interactive">
          <view class="stat-title">获得赞</view>
          <view class="stat-val" style="color: #5b9b73;">35</view>
          <view class="stat-icons">
            <text style="color: #7b93a8;">👍</text>
            <text style="color: #ffb5c5;">👍</text>
          </view>
        </view>
      </view>

      <!-- 3. 我的图纸模块 -->
      <view class="blueprints-section clay-yellow">
        <view class="bp-header">
          <view class="bp-title-group">
            <text class="bp-icon">🌸</text>
            <text class="bp-title">我的图纸</text>
            <text class="bp-count">30</text>
          </view>
          <text class="bp-arrow">›</text>
        </view>
        
        <view class="bp-content">
          <!-- 3D 文件夹模型 -->
          <view class="folder-mock clay-interactive">
            <view class="folder-front"></view>
          </view>

          <!-- 图纸 1：熊猫 -->
          <view class="bp-card">
            <view class="bp-grid-wrap clay-inset-light clay-interactive">
              <view class="pixel-grid" :style="{ gridTemplateColumns: 'repeat(8, 1fr)' }">
                <view v-for="(color, index) in pandaPattern" :key="'p'+index" class="pixel" :style="{ backgroundColor: color }"></view>
              </view>
            </view>
            <text class="bp-btn">查看</text>
          </view>

          <!-- 图纸 2：彩虹 -->
          <view class="bp-card">
            <view class="bp-grid-wrap clay-blue clay-interactive">
              <view class="pixel-grid" :style="{ gridTemplateColumns: 'repeat(8, 1fr)' }">
                <view v-for="(color, index) in rainbowPattern" :key="'r'+index" class="pixel" :style="{ backgroundColor: color }"></view>
              </view>
            </view>
            <text class="bp-btn">查看</text>
          </view>

          <!-- 图纸 3：小船 -->
          <view class="bp-card">
            <view class="bp-grid-wrap clay-blue-light clay-interactive">
              <view class="pixel-grid" :style="{ gridTemplateColumns: 'repeat(8, 1fr)' }">
                <view v-for="(color, index) in boatPattern" :key="'b'+index" class="pixel" :style="{ backgroundColor: color }"></view>
              </view>
            </view>
            <text class="bp-btn">管理</text>
          </view>
        </view>
      </view>

      <!-- 菜单装饰物 -->
      <text class="decor d-heart-2">♥</text>
      <text class="decor d-heart-3">♥</text>
      <view class="decor d-dot-1"></view>
      <text class="decor d-star-2">★</text>
      <text class="decor d-star-3">★</text>

      <!-- 4. 功能菜单列表 -->
      <view class="menu-list">
        <view v-for="(item, index) in menuList" :key="index" class="menu-item clay-white clay-interactive" @click="handleMenuItemClick(item)">
          <view class="menu-icon" :style="{ backgroundColor: item.bgColor, color: item.iconColor }">
            <text>{{ item.icon }}</text>
          </view>
          <text class="menu-text">{{ item.label }}</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>

    </scroll-view>

    <!-- 5. 底部导航栏 -->
    <nav class="bottom-nav clay-white">
      <view 
        v-for="item in navItems" 
        :key="item.id"
        :class="['nav-item clay-interactive', { active: currentTab === item.id }]"
        @click="handleNavClick(item.id)"
      >
        <text :style="{ color: item.iconColor }">{{ item.icon }}</text>
        <text>{{ item.label }}</text>
      </view>
    </nav>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const currentTab = ref('profile');

const navItems = [
  { id: 'home', icon: '🏠', label: '首页', iconColor: '#bccfe0' },
  { id: 'tools', icon: '💼', label: '工具箱', iconColor: '#e898a8' },
  { id: 'community', icon: '👥', label: '社区', iconColor: '#e898a8' },
  { id: 'profile', icon: '👤', label: '我', iconColor: '#ffb5c5' }
];

const menuList = [
  { label: '社区动态', icon: '⭐', bgColor: '#fdf2cd', iconColor: '#c4a150' },
  { label: '我的工具箱', icon: '💼', bgColor: '#ffb5c5', iconColor: '#d17586' },
  { label: '消息中心', icon: '💬', bgColor: '#f5f8fc', iconColor: '#d17586' },
  { label: '设置', icon: '⚙️', bgColor: '#d4e8f9', iconColor: '#6482a3' }
];

// ==== 像素图纸数据 (8x8 Grid) ====
const t = 'transparent';

// 1. 熊猫 (黑白)
const b = '#333333', w = '#ffffff';
const pandaMatrix = [
  [t,b,b,t,t,t,b,b],
  [b,b,b,b,t,b,b,b],
  [b,b,w,w,w,w,b,b],
  [t,w,b,w,w,b,w,t],
  [t,w,b,w,w,b,w,t],
  [t,w,w,b,b,w,w,t],
  [t,b,w,w,w,w,b,t],
  [t,b,b,b,b,b,b,t]
];

// 2. 彩虹
const c1='#ff99ac', c2='#fbd28b', c3='#fdf2cd', c4='#a0ebd8', c5='#abcce9';
const rainbowMatrix = [
  [t,t,t,t,t,t,t,t],
  [t,t,c1,c1,c1,c1,t,t],
  [t,c1,c2,c2,c2,c2,c1,t],
  [c1,c2,c3,c3,c3,c3,c2,c1],
  [c2,c3,c4,c4,c4,c4,c3,c2],
  [c3,c4,c5,t,t,c5,c4,c3],
  [c4,c5,t,t,t,t,c5,c4],
  [w,w,w,t,t,w,w,w]
];

// 3. 小船
const r='#e898a8', br='#c4a150', bl='#74a9d8';
const boatMatrix = [
  [t,t,t,t,b,t,t,t],
  [t,t,t,r,b,t,t,t],
  [t,t,r,r,b,w,t,t],
  [t,r,r,r,b,w,w,t],
  [r,r,r,r,b,w,w,w],
  [t,br,br,br,br,br,br,t],
  [t,t,br,br,br,br,t,t],
  [bl,bl,t,bl,bl,t,bl,bl]
];

const pandaPattern = pandaMatrix.flat();
const rainbowPattern = rainbowMatrix.flat();
const boatPattern = boatMatrix.flat();

const handleNavClick = (id: string) => {
  if (id === 'home') {
    uni.navigateBack();
  } else if (id === 'tools') {
    uni.navigateTo({ url: '/pages/tools/index' });
  } else if (id === 'profile') {
    // already on profile page
  } else if (id === 'community') {
    // community - not implemented yet
  }
};

const handleMenuItemClick = (item: any) => {
  // Handle menu item clicks
  if (item.label === '设置') {
    // e.g., show settings or logout
  }
};
</script>

<style lang="scss" scoped>
/* ================= 全局 & 变量 ================= */
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

:root {
  --app-bg: #f5f8fc;
  --text-main: #4d6076;
  --text-light: #7b93a8;
  --c-pink: #ffb5c5;
  --c-yellow: #fdf2cd;
  --c-mint: #a0ebd8;
  --c-blue: #abcce9;
  --c-blue-light: #d4e8f9;
  --c-green: #c4ead2;
  --c-white: #ffffff;
  --c-pink-dark: #d17586;
  --c-yellow-dark: #c4a150;
  --c-blue-dark: #6482a3;
  --c-green-dark: #5b9b73;
}

.page-container {
  width: 100%;
  min-height: 100vh;
  background-color: var(--app-bg);
  position: relative;
}

.scroll-container {
  flex: 1; overflow-y: auto; overflow-x: hidden; padding-bottom: 120px;
}

/* ================= Claymorphism 材质类 ================= */
.clay-interactive {
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}
.clay-interactive:active { transform: scale(0.95); }

.clay-pink {
  background-color: var(--c-pink);
  box-shadow: 8px 8px 16px rgba(255, 181, 197, 0.4), inset 4px 4px 10px rgba(255, 255, 255, 0.8), inset -4px -4px 10px rgba(232, 152, 168, 0.5);
}
.clay-blue {
  background-color: var(--c-blue);
  box-shadow: 5px 5px 15px rgba(171, 204, 233, 0.4), inset 3px 3px 8px rgba(255, 255, 255, 0.8), inset -3px -3px 8px rgba(139, 174, 206, 0.5);
}
.clay-blue-light {
  background-color: var(--c-blue-light);
  box-shadow: 8px 8px 16px rgba(188, 207, 224, 0.4), inset 4px 4px 10px rgba(255, 255, 255, 0.8), inset -4px -4px 10px rgba(188, 207, 224, 0.5);
}
.clay-yellow {
  background-color: var(--c-yellow);
  box-shadow: 8px 8px 16px rgba(210, 195, 165, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 4px 4px 10px rgba(255, 255, 255, 0.8), inset -4px -4px 10px rgba(229, 218, 193, 0.5);
}
.clay-green {
  background-color: var(--c-green);
  box-shadow: 8px 8px 16px rgba(169, 203, 181, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 4px 4px 10px rgba(255, 255, 255, 0.8), inset -4px -4px 10px rgba(169, 203, 181, 0.5);
}
.clay-white {
  background-color: var(--c-white);
  box-shadow: 10px 10px 20px rgba(0,0,0,0.04), -10px -10px 20px rgba(255,255,255,0.9), inset 4px 4px 10px rgba(255, 255, 255, 0.8), inset -4px -4px 10px rgba(230, 235, 240, 0.3);
}
.clay-inset-light {
  background-color: rgba(255,255,255,0.4);
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.05), inset -3px -3px 6px rgba(255, 255, 255, 0.8);
}

/* ================= 页面模块样式 ================= */

/* 顶部个人资料区 */
.profile-header {
  padding: 35px 25px 30px;
  border-bottom-left-radius: 45px;
  border-bottom-right-radius: 45px;
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  z-index: 10;
}
.avatar-wrap {
  width: 70px; height: 70px; border-radius: 50%;
  border: 4px solid var(--c-white);
  box-shadow: 4px 4px 10px rgba(232, 152, 168, 0.5), inset 2px 2px 5px rgba(255,255,255,0.5);
  overflow: hidden;
  flex-shrink: 0;
}
.avatar-wrap image { width: 100%; height: 100%; }
.user-info { flex: 1; }
.user-name { font-size: 22px; font-weight: 800; color: #1e293b; margin-bottom: 4px; }
.level-badge {
  display: inline-flex; align-items: center; gap: 4px;
  background: var(--c-blue-light); padding: 4px 10px; border-radius: 12px;
  font-size: 11px; font-weight: 800; color: var(--text-main);
  box-shadow: inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(188, 207, 224, 0.5);
}
.badge-icon { font-size: 10px; }
.btn-edit {
  padding: 10px 15px; border-radius: 18px; font-size: 13px; font-weight: 800; color: var(--c-yellow-dark);
  text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
}

/* 数据统计区 */
.stats-row {
  display: flex; gap: 15px; padding: 20px; margin-top: 5px;
}
.stat-card {
  flex: 1; border-radius: 25px; padding: 18px 5px; text-align: center;
  display: flex; flex-direction: column; gap: 8px; align-items: center;
}
.stat-title { font-size: 13px; font-weight: 800; color: var(--text-main); }
.stat-val { font-size: 24px; font-weight: 800; text-shadow: 1px 1px 2px rgba(255,255,255,0.8); line-height: 1; }
.stat-icons { display: flex; gap: 4px; font-size: 14px; opacity: 0.8; }

/* 我的图纸横向滚动模块 */
.blueprints-section {
  margin: 5px 20px 20px; border-radius: 35px; padding: 20px;
}
.bp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; }
.bp-title-group { display: flex; align-items: center; gap: 8px; }
.bp-icon { color: var(--c-pink-dark); font-size: 18px; }
.bp-title { font-size: 16px; font-weight: 800; color: var(--text-main); }
.bp-count { background: var(--c-yellow-dark); color: #fff; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 10px; }
.bp-arrow { color: var(--text-main); font-size: 14px; font-weight: 800; }

.bp-content { display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px; align-items: center;}

.folder-mock {
  width: 65px; height: 55px; background: #ebd58b; border-radius: 10px 15px 15px 15px; position: relative; flex-shrink: 0;
  box-shadow: 4px 4px 8px rgba(196, 161, 80, 0.3), inset -3px -3px 6px rgba(196, 161, 80, 0.4);
}
.folder-mock::before {
  content: ''; position: absolute; top: -8px; left: 0; width: 30px; height: 15px; background: #e0ca80; border-radius: 8px 8px 0 0;
}
.folder-mock::after {
  content: ''; position: absolute; top: 6px; left: 5px; width: 50px; height: 40px; background: #fff; border-radius: 5px; opacity: 0.8;
}
.folder-front {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 40px; background: #fadd8c; border-radius: 8px; z-index: 2;
  box-shadow: inset 2px 2px 4px rgba(255,255,255,0.6);
}

.bp-card {
  min-width: 80px; display: flex; flex-direction: column; gap: 10px; align-items: center;
}
.bp-grid-wrap {
  width: 70px; height: 70px; border-radius: 18px; padding: 6px;
  display: flex; justify-content: center; align-items: center;
}
.pixel-grid { display: grid; gap: 1px; width: 100%; height: 100%; }
.pixel { border-radius: 30%; width: 100%; height: 100%; box-shadow: inset -1px -1px 2px rgba(0,0,0,0.1), inset 1px 1px 2px rgba(255,255,255,0.8); }
.bp-btn { font-size: 12px; font-weight: 800; color: var(--text-main); }

/* 列表菜单 */
.menu-list {
  display: flex; flex-direction: column; gap: 15px; padding: 0 20px 20px; position: relative; z-index: 10;
}
.menu-item {
  display: flex; align-items: center; padding: 18px 20px; border-radius: 25px; gap: 15px;
}
.menu-icon { width: 32px; height: 32px; border-radius: 12px; display: flex; justify-content: center; align-items: center; font-size: 16px; box-shadow: inset 2px 2px 4px rgba(255,255,255,0.8); }
.menu-text { flex: 1; font-size: 16px; font-weight: 800; color: var(--text-main); }
.menu-arrow { font-size: 14px; color: var(--text-light); font-weight: 800; }

/* 底部导航 */
.bottom-nav {
  position: absolute; bottom: 25px; left: 20px; right: 20px; height: 80px; border-radius: 35px; display: flex; justify-content: space-around; align-items: center; padding: 0 10px; z-index: 20;
}
.nav-item {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; width: 65px; height: 65px; border-radius: 20px;
}
.nav-item text:first-child { font-size: 24px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1); }
.nav-item text:last-child { font-size: 12px; font-weight: 800; color: var(--text-light); }
.nav-item.active {
  background-color: #eff6fb;
  box-shadow: inset 4px 4px 8px rgba(171, 204, 233, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.9);
}
.nav-item.active text:last-child { color: var(--c-blue-dark); }

/* 装饰物 */
.decor { position: absolute; z-index: 0; pointer-events: none; }
.d-heart-1 { top: 220px; right: 15px; color: var(--c-pink); font-size: 20px; transform: rotate(15deg); text-shadow: 2px 2px 5px rgba(0,0,0,0.1); }
.d-star-1 { top: 320px; right: 10px; color: var(--c-yellow); font-size: 22px; transform: rotate(-15deg); text-shadow: 2px 2px 5px rgba(0,0,0,0.1); }
.d-pill { top: 280px; left: 15px; width: 12px; height: 28px; background: var(--c-mint); border-radius: 6px; transform: rotate(45deg); box-shadow: 3px 3px 6px rgba(0,0,0,0.05), inset 2px 2px 4px rgba(255,255,255,0.8); }

/* 菜单区飞出的爱心和圆点 */
.d-heart-2 { bottom: 310px; right: 100px; color: var(--c-pink-dark); font-size: 28px; transform: rotate(-10deg); text-shadow: 3px 3px 6px rgba(0,0,0,0.15); z-index: 15;}
.d-heart-3 { bottom: 330px; right: 70px; color: var(--c-pink); font-size: 14px; transform: rotate(20deg); text-shadow: 2px 2px 4px rgba(0,0,0,0.1); z-index: 15;}
.d-dot-1 { bottom: 200px; right: 80px; width: 18px; height: 18px; background: #e8a598; border-radius: 50%; box-shadow: 2px 2px 5px rgba(0,0,0,0.1), inset 2px 2px 4px rgba(255,255,255,0.6); z-index: 15;}
.d-star-2 { bottom: 210px; left: 150px; color: var(--c-yellow); font-size: 24px; transform: rotate(15deg); text-shadow: 2px 2px 5px rgba(0,0,0,0.1); z-index: 15;}
.d-star-3 { bottom: 420px; right: 40px; color: var(--c-mint); font-size: 18px; transform: rotate(25deg); text-shadow: 2px 2px 5px rgba(0,0,0,0.1); z-index: 15;}
</style>