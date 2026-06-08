<template>
  <view class="page-container">
    <AuthModal :visible="showAuthModal" @close="showAuthModal = false" @success="onAuthSuccess" />

    <text class="decor home-star-1">★</text>
    <text class="decor home-star-2">★</text>
    <text class="decor home-star-3">★</text>
    <view class="decor pill-1"></view>
    <view class="decor flower-1">
      <text>✿</text></view>

    <header class="header-area clay-pink">
      <view class="header-content">
        <view class="search-bar clay-inset-yellow">
          <text>🔍</text>
          <input type="text" placeholder="搜索项目..." />
        </view>
        <view class="btn-new clay-yellow clay-interactive">新建作品</view>
        <view class="avatar clay-interactive">
          <image src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=fdf5d3" mode="aspectFill" />
        </view>
      </view>
    </header>

    <main class="main-content">
      <view class="main-action-btn clay-mint clay-interactive" @click="goToIndex">
        <view class="clay-camera clay-mint-protrude">
          <view class="camera-lens clay-inset-dark"></view>
          <view class="camera-flash"></view>
        </view>
        <text class="action-text">上传/拍摄图片生成拼豆色号模板</text>
      </view>

      <view class="section-header">
        <text class="section-title">我的历史模板</text>
      </view>
      
      <view class="history-scroll-container">
        <view 
          v-for="template in historyTemplates" 
          :key="template.id" 
          :class="['history-card clay-interactive', `clay-${template.theme}`]"
        >
          <view class="preview-grid-wrapper clay-inset-light">
            <view class="bead-grid">
              <view 
                v-for="(color, index) in template.pattern" 
                :key="index" 
                class="bead" 
                :style="{ backgroundColor: color }"
              ></view>
            </view>
          </view>
          
          <text class="card-title">{{ template.title }}</text>
          
          <view class="card-actions">
            <view class="action-btn clay-interactive">
              <text>✏️ 编辑</text>
            </view>
            <view class="action-btn clay-interactive">
              <text>🔗 分享</text>
            </view>
            <view class="action-btn clay-interactive" @click="saveTemplate(template)">
              <text>💾 保存</text>
            </view>
          </view>
        </view>
      </view>
    </main>

    <nav class="bottom-nav clay-white">
      <view 
        v-for="item in navItems" 
        :key="item.id"
        :class="['nav-item clay-interactive', { 'active clay-inset-blue': currentTab === item.id }]"
        @click="handleNavClick(item.id)"
      >
        <text :style="{ color: item.iconColor }">{{ item.icon }}</text>
        <text>{{ item.label }}</text>
      </view>
    </nav>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AuthModal from '@/components/AuthModal.vue';
import { useUserStore } from '@/stores/user';
import { templateApi, storage, type Template } from '@/utils/api';

const userStore = useUserStore();

const currentTab = ref('home');
const showAuthModal = ref(false);
const isLoading = ref(false);

const navItems = [
  { id: 'home', icon: '🏠', label: '首页', iconColor: '#bccfe0' },
  { id: 'community', icon: '👥', label: '社区', iconColor: '#e898a8' },
  { id: 'profile', icon: '👤', label: '我', iconColor: '#ffb5c5' }
];

const buildPattern = (matrix: number[][], colorMap: Record<number, string>) => {
  return matrix.flat().map(code => colorMap[code]);
};

const rabbitMatrix = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,1,1,0,0,0,1,1,0,0],
  [1,2,3,1,0,1,3,2,1,0],
  [1,2,3,1,0,1,3,2,1,0],
  [1,2,2,1,1,1,2,2,1,0],
  [1,2,2,2,2,2,2,2,1,0],
  [1,2,1,2,2,2,1,2,1,0],
  [1,3,2,2,1,2,2,3,1,0],
  [0,1,2,2,2,2,2,1,0,0],
  [0,0,1,1,1,1,1,0,0,0]
];
const rabbitColors: Record<number, string> = { 0: 'transparent', 1: '#4a4a4a', 2: '#ffffff', 3: '#ffb5c5' };

const carMatrix = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,1,1,1,0,0,0],
  [0,0,1,3,3,3,3,1,0,0],
  [0,1,2,2,2,2,2,2,1,0],
  [1,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,1],
  [0,1,4,4,1,1,4,4,1,0],
  [0,0,4,4,0,0,4,4,0,0],
  [0,0,0,0,0,0,0,0,0,0]
];
const carColors: Record<number, string> = { 0: 'transparent', 1: '#4a7ba6', 2: '#8ab6d6', 3: '#ffffff', 4: '#333333' };

const flowerMatrix = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,1,1,0,0,0,0],
  [0,0,1,1,2,1,1,0,0,0],
  [0,1,1,2,2,2,1,1,0,0],
  [0,0,1,1,2,1,1,0,0,0],
  [0,0,0,1,1,1,0,0,0,0],
  [0,0,0,0,3,0,0,4,0,0],
  [0,4,4,0,3,0,4,4,0,0],
  [0,0,4,4,3,4,4,0,0,0],
  [0,0,0,0,3,0,0,0,0,0]
];
const flowerColors: Record<number, string> = { 0: 'transparent', 1: '#ffb5c5', 2: '#fdf2cd', 3: '#81c784', 4: '#4caf50' };

const historyTemplates = ref<Template[]>([
  { id: 1, title: '小兔拼豆模板', theme: 'yellow', pattern: buildPattern(rabbitMatrix, rabbitColors), matrix: rabbitMatrix, colors: rabbitColors },
  { id: 2, title: '城市赛车模板', theme: 'blue', pattern: buildPattern(carMatrix, carColors), matrix: carMatrix, colors: carColors }
]);

const loadTemplates = async () => {
  const token = storage.getToken()
  if (!token) {
    await loadPublicTemplates()
    return
  }
  
  isLoading.value = true
  const response = await templateApi.getList()
  
  if (response.success && response.data) {
    historyTemplates.value = response.data
  } else {
    await loadPublicTemplates()
  }
  
  isLoading.value = false
}

const loadPublicTemplates = async () => {
  const response = await templateApi.getPublic()
  if (response.success && response.data && response.data.length > 0) {
    historyTemplates.value = response.data
  }
}

onMounted(() => {
  loadTemplates()
});

const saveTemplate = async (template: any) => {
  uni.showLoading({
    title: '正在保存...'
  });
  
  try {
    const token = storage.getToken()
    if (token) {
      const templateData: Omit<Template, 'id' | 'createdAt'> = {
        title: template.title,
        matrix: template.matrix,
        colors: template.colors,
        pattern: template.pattern,
        theme: template.theme
      }
      await templateApi.save(templateData)
    }
    
    const svgContent = generateSVG(template);
    const base64Data = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`;
    
    uni.downloadFile({
      url: base64Data,
      success: (res) => {
        uni.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            uni.hideLoading();
            uni.showToast({
              title: '保存成功',
              icon: 'success'
            });
          },
          fail: () => {
            uni.hideLoading();
            uni.showToast({
              title: '保存图片失败',
              icon: 'none'
            });
          }
        });
      },
      fail: () => {
        uni.hideLoading();
        uni.showToast({
          title: '生成图片失败',
          icon: 'none'
        });
      }
    });
  } catch (error) {
    uni.hideLoading();
    uni.showToast({
      title: '保存失败',
      icon: 'none'
    });
  }
};

const generateSVG = (template: any) => {
  const matrix = template.matrix;
  const colors = template.colors;
  const cellSize = 20;
  const padding = 20;
  const width = matrix[0].length * cellSize + padding * 2;
  const height = matrix.length * cellSize + padding * 2;
  
  let beads = '';
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      const color = colors[matrix[row][col]];
      if (color !== 'transparent') {
        const cx = padding + col * cellSize + cellSize / 2;
        const cy = padding + row * cellSize + cellSize / 2;
        beads += `<circle cx="${cx}" cy="${cy}" r="${cellSize / 2 - 1}" fill="${color}" stroke="#fff" stroke-width="0.5"/>`;
      }
    }
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#ffffff"/>
  ${beads}
</svg>`;
};

const goToIndex = () => {
  uni.navigateTo({
    url: '/pages/index/index'
  });
};

const handleNavClick = (id: string) => {
  if (id === 'profile') {
    if (userStore.isLoggedIn) {
      uni.navigateTo({
        url: '/pages/profile/index'
      });
    } else {
      showAuthModal.value = true;
    }
  } else {
    currentTab.value = id;
  }
};

const onAuthSuccess = () => {
  uni.navigateTo({
    url: '/pages/profile/index'
  });
};
</script>

<style lang="scss" scoped>
:root {
  --app-bg-auth: #d8e6f1;
  --app-bg-home: #f5f8fc;
  --text-main: #1e293b;
  --text-light: #64748b;

  --c-pink: #ffb5c5;
  --c-yellow: #fdf2cd;
  --c-mint: #a0ebd8;
  --c-blue: #abcce9;
  --c-blue-light: #d4e8f9;
  --c-green: #c4ead2;
  --c-white: #ffffff;
  
  --scale-active: 0.95;
}

.page-container {
  width: 100%;
  min-height: 100vh;
  background-color: var(--app-bg-home);
  position: relative;
}

.clay-interactive {
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}
.clay-interactive:active {
  transform: scale(var(--scale-active));
}

.clay-pink {
  background-color: var(--c-pink);
  box-shadow: 8px 8px 16px rgba(255, 181, 197, 0.4), 
              inset 4px 4px 10px rgba(255, 255, 255, 0.8),
              inset -4px -4px 10px rgba(232, 152, 168, 0.5);
}

.clay-blue {
  background-color: var(--c-blue);
  box-shadow: 5px 5px 15px rgba(171, 204, 233, 0.4),
              inset 3px 3px 8px rgba(255, 255, 255, 0.8),
              inset -3px -3px 8px rgba(139, 174, 206, 0.5);
}

.clay-blue-light {
  background-color: var(--c-blue-light);
  box-shadow: 8px 8px 16px rgba(188, 207, 224, 0.4),
              -8px -8px 16px rgba(255, 255, 255, 0.9),
              inset 4px 4px 10px rgba(255, 255, 255, 0.8),
              inset -4px -4px 10px rgba(188, 207, 224, 0.5);
}

.clay-mint {
  background-color: var(--c-mint);
  box-shadow: 12px 12px 24px rgba(139, 206, 188, 0.4),
              -12px -12px 24px rgba(255, 255, 255, 0.6),
              inset 6px 6px 12px rgba(255, 255, 255, 0.8),
              inset -6px -6px 12px rgba(139, 206, 188, 0.5);
}

.clay-yellow {
  background-color: var(--c-yellow);
  box-shadow: 8px 8px 16px rgba(210, 195, 165, 0.4),
              -8px -8px 16px rgba(255, 255, 255, 0.9),
              inset 4px 4px 10px rgba(255, 255, 255, 0.8),
              inset -4px -4px 10px rgba(229, 218, 193, 0.5);
}

.clay-green {
  background-color: var(--c-green);
  box-shadow: 8px 8px 16px rgba(169, 203, 181, 0.4),
              -8px -8px 16px rgba(255, 255, 255, 0.9),
              inset 4px 4px 10px rgba(255, 255, 255, 0.8),
              inset -4px -4px 10px rgba(169, 203, 181, 0.5);
}

.clay-white {
  background-color: var(--c-white);
  box-shadow: 10px 10px 20px rgba(0,0,0,0.04),
              -10px -10px 20px rgba(255,255,255,0.9),
              inset 4px 4px 10px rgba(255, 255, 255, 0.8),
              inset -4px -4px 10px rgba(230, 235, 240, 0.3);
}

.clay-inset-blue {
  background-color: #eff6fb;
  box-shadow: inset 5px 5px 10px rgba(171, 204, 233, 0.5),
              inset -5px -5px 10px rgba(255, 255, 255, 0.9);
}

.clay-inset-gray {
  background-color: #f0f3f5;
  box-shadow: inset 4px 4px 8px rgba(0,0,0,0.05),
              inset -4px -4px 8px rgba(255,255,255,0.9);
}

.clay-inset-yellow {
  background-color: var(--c-yellow);
  box-shadow: inset 4px 4px 8px rgba(210, 195, 165, 0.6),
              inset -4px -4px 8px rgba(255, 255, 255, 0.9);
}

.clay-inset-light {
  background-color: rgba(255,255,255,0.3);
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.05),
              inset -3px -3px 6px rgba(255, 255, 255, 0.8);
}

.clay-inset-dark {
  background-color: #4a5568;
  box-shadow: inset 3px 3px 6px rgba(0,0,0,0.8), inset -2px -2px 5px rgba(255,255,255,0.2);
}

.clay-mint-protrude {
  background-color: var(--c-mint);
  box-shadow: 6px 6px 12px rgba(139, 206, 188, 0.5), -4px -4px 8px rgba(255, 255, 255, 0.9),
              inset 3px 3px 6px rgba(255, 255, 255, 0.9), inset -3px -3px 6px rgba(139, 206, 188, 0.4);
}

.header-area {
  padding: 65px 20px 30px;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
  position: relative;
  z-index: 2;
}
.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}
.search-bar {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  color: #a89468;
}
.search-bar input {
  border: none;
  background: transparent;
  outline: none;
  margin-left: 8px;
  width: 100%;
  color: #887855;
  font-family: inherit;
  font-weight: 600;
  font-size: 14px;
}
.search-bar input::placeholder { color: #bcae8d; }
.btn-new {
  height: 44px;
  padding: 0 16px;
  border-radius: 22px;
  font-weight: 700;
  color: #6d5b32;
  font-family: inherit;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--c-white);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.avatar image { width: 100%; height: 100%; }

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  padding-bottom: 100px;
  position: relative;
  z-index: 1;
}

.main-action-btn {
  margin-top: 20px;
  border-radius: 35px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
.clay-camera {
  width: 100px;
  height: 70px;
  border-radius: 20px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.clay-camera::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 20px;
  width: 30px;
  height: 15px;
  background: var(--c-mint);
  border-radius: 5px 5px 0 0;
  box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.9);
}
.camera-lens {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 6px solid #e0f4ef;
}
.camera-flash {
  position: absolute;
  top: 10px;
  right: 15px;
  width: 8px;
  height: 8px;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(255,255,255,0.8);
}
.action-text {
  font-weight: 800;
  color: #3b6b5e;
  font-size: 15px;
  text-align: center;
}

.section-header {
  margin-top: 40px;
  margin-bottom: 20px;
  padding: 0 10px;
}
.section-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-main);
}
.history-scroll-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 10px;
  margin: 0 -10px;
}

.history-card {
  border-radius: 20px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.preview-grid-wrapper {
  aspect-ratio: 1;
  border-radius: 15px;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bead-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 1px;
  width: 100%;
  height: 100%;
}
.bead {
  border-radius: 50%;
  width: 100%;
  height: 100%;
  box-shadow: inset -1px -1px 3px rgba(0,0,0,0.1), inset 1px 1px 3px rgba(255,255,255,0.8);
}
.card-title {
  font-size: 14px;
  font-weight: 800;
  color: #475569;
  text-align: center;
  margin: 0;
}
.card-actions {
  display: flex;
  gap: 6px;
}
.action-btn {
  flex: 1;
  background: rgba(255,255,255,0.4);
  border-radius: 10px;
  padding: 6px 4px;
  font-size: 10px;
  font-weight: 700;
  color: #64748b;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.05), inset 1px 1px 2px rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-nav {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  height: 80px;
  border-radius: 40px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 10px;
  z-index: 10;
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 65px;
  height: 65px;
  border-radius: 20px;
}
.nav-item text:first-child { font-size: 24px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1); }
.nav-item text:last-child { font-size: 12px; font-weight: 800; color: #64748b; }
.nav-item.active {
  background-color: #eff6fb;
  box-shadow: inset 4px 4px 8px rgba(171, 204, 233, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.9);
}

.decor { position: absolute; z-index: 0; pointer-events: none; }
.home-star-1 { top: 140px; left: 20px; color: #fdf2cd; font-size: 24px; transform: rotate(-15deg); text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
.home-star-2 { top: 150px; right: 25px; color: #ffb5c5; font-size: 20px; transform: rotate(15deg); text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
.home-star-3 { top: 230px; right: 15px; color: #fdf2cd; font-size: 16px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
.pill-1 { 
  top: 330px; left: 25px; width: 14px; height: 35px; 
  background: var(--c-mint); border-radius: 7px; 
  transform: rotate(45deg);
  box-shadow: 4px 4px 8px rgba(139, 206, 188, 0.4), inset 2px 2px 4px rgba(255,255,255,0.8);
}
.flower-1 {
  top: 350px; right: 25px; color: #ffb5c5; font-size: 32px;
  text-shadow: 2px 2px 5px rgba(0,0,0,0.1);
}
</style>