<template>
  <view class="page-container">
    <!-- 装饰 -->
    <text class="decor decor-star" style="top: 100px; right: 20px; font-size: 24px; transform: rotate(15deg);">★</text>
    <text class="decor decor-heart" style="bottom: 110px; left: 55%; font-size: 22px;">♥</text>
    <text class="decor decor-star" style="bottom: 90px; right: 40px; font-size: 16px; transform: rotate(15deg);">★</text>

    <!-- Header -->
    <header class="header clay">
      <view class="icon-btn clay clay-interactive" @click="goBack">
        <text class="fas">↩</text>
      </view>
      <h1 class="header-title">Bead Weaver</h1>
      <view class="icon-btn clay clay-interactive" @click="saveImage">
        <text class="fas">⬇</text>
      </view>
    </header>

    <!-- 加载态 -->
    <view v-if="loading" class="loading-wrap">
      <view class="loading-inner">
        <view class="loading-spinner"></view>
        <text class="loading-text">正在生成模板...</text>
      </view>
    </view>

    <!-- 结果内容 -->
    <template v-else>
      <!-- 内容分割区: 网格 + 色号清单 -->
      <view class="content-split">
        <!-- 左侧: 拼豆网格 -->
        <view class="grid-container">
          <view class="section-title">生成的拼豆图纸</view>
          <view class="grid-box clay" @click="openFullView">
            <view class="bead-grid" :style="{ gridTemplateColumns: 'repeat(' + templateWidth + ', 1fr)' }">
              <view
                v-for="(pixel, idx) in flatPixels"
                :key="idx"
                class="bead"
                :style="{ backgroundColor: pixel.color }"
              ></view>
            </view>
          </view>
        </view>

        <!-- 右侧: 色号清单 -->
        <view class="list-container">
          <view class="section-title" style="text-align: right; padding-right: 5px;">色号清单</view>
          <scroll-view scroll-y class="color-list-box clay">
            <view
              v-for="(color, index) in usedColors"
              :key="index"
              class="color-item clay clay-interactive"
              :class="{ 'color-item-selected': selectedColor?.code === color.code }"
              @click="selectColor(color)"
            >
              <view class="color-swatch" :style="{ backgroundColor: color.hex }"></view>
              <view class="color-info">
                <view class="color-brand">Perler</view>
                <view class="color-name">{{ color.code }}</view>
                <text style="font-size: 11px; color: #7b93a8;">{{ color.count }} 颗</text>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>

      <!-- 控件: 色号限制滑块 -->
      <view class="controls">
        <view class="slider-header">
          <span>色号限制</span>
          <span>{{ colorCount }}</span>
        </view>
        <view class="slider-track clay-groove" style="height: 12px; width: 100%;">
          <slider
            :value="colorCount"
            :min="4"
            :max="20"
            :step="1"
            activeColor="#90deb3"
            backgroundColor="transparent"
            @change="onColorCountChange"
            style="width: 100%; height: 12px;"
          />
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-btns">
        <view class="btn-large btn-green clay clay-interactive" @click="saveImage">保存图纸</view>
        <view class="btn-large btn-pink clay clay-interactive" @click="openFullView">放大查看</view>
        <view class="btn-large btn-blue clay clay-interactive" @click="goBack" style="grid-column: span 2;">返回修改</view>
      </view>

      <!-- 底部留白 -->
      <view style="height: 30px;"></view>
    </template>

    <!-- 全览模式弹窗 -->
    <view v-if="showFullView" class="full-view-overlay" @click="closeFullView">
      <view class="full-view-content" @click.stop>
        <view class="full-view-header">
          <text class="full-view-title">拼豆图纸 ({{ templateWidth }} × {{ templateHeight }})</text>
          <view class="zoom-controls">
            <view class="zoom-btn clay-interactive" @click="zoomOut">−</view>
            <text class="zoom-level">{{ Math.round(zoom * 100) }}%</text>
            <view class="zoom-btn clay-interactive" @click="zoomIn">+</view>
            <view class="zoom-btn clay-interactive" @click="resetZoom">↺</view>
          </view>
          <view class="close-btn clay-interactive" @click="closeFullView">✕</view>
        </view>
        <scroll-view scroll-x scroll-y class="full-view-scroll">
          <view
            class="full-view-grid"
            :style="{
              width: fullViewWidth,
              height: fullViewHeight,
              transform: 'scale(' + zoom + ')',
              transformOrigin: 'top left'
            }"
          >
            <view v-for="(row, rIdx) in pixelData" :key="rIdx" class="full-view-row">
              <view
                v-for="(pixel, cIdx) in row"
                :key="cIdx"
                class="full-view-pixel"
                :style="{ backgroundColor: pixel.color }"
              >
                <text v-if="showColorCode" class="full-view-code">{{ pixel.code }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="full-view-footer">
          <text>双指缩放或使用按钮调节大小</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { pingDouColors, findClosestColor, rgbToHex } from '@/utils/colors'

interface PixelData {
  color: string
  code: string
  hex: string
}
interface ColorInfo {
  code: string
  hex: string
  count: number
}

const imagePath = ref('')
const templateSize = ref(100)
const pixelSize = ref(16)
const colorCount = ref(10)
const showColorCode = ref(true)
const loading = ref(true)
const pixelData = ref<PixelData[][]>([])
const usedColors = ref<ColorInfo[]>([])
const selectedColor = ref<ColorInfo | null>(null)
const templateWidth = ref(0)
const templateHeight = ref(0)

// 展平像素数据用于网格展示
const flatPixels = computed(() => {
  const result: PixelData[] = []
  for (const row of pixelData.value) {
    result.push(...row)
  }
  return result
})

// 全览模式
const showFullView = ref(false)
const zoom = ref(1)
const fullViewPixelSize = ref(24)
const fullViewWidth = computed(() => templateWidth.value * fullViewPixelSize.value + 'px')
const fullViewHeight = computed(() => templateHeight.value * fullViewPixelSize.value + 'px')

const processImage = (img: HTMLImageElement) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const maxDimension = Math.max(img.width, img.height)
  const scale = templateSize.value / maxDimension
  const newWidth = Math.round(img.width * scale)
  const newHeight = Math.round(img.height * scale)
  canvas.width = newWidth
  canvas.height = newHeight
  ctx.drawImage(img, 0, 0, newWidth, newHeight)

  const imageData = ctx.getImageData(0, 0, newWidth, newHeight)
  const pixels = imageData.data
  const result: PixelData[][] = []
  const colorMap = new Map<string, number>()

  for (let y = 0; y < newHeight; y++) {
    const row: PixelData[] = []
    for (let x = 0; x < newWidth; x++) {
      const i = (y * newWidth + x) * 4
      const r = pixels[i]
      const g = pixels[i + 1]
      const b = pixels[i + 2]
      const a = pixels[i + 3]
      if (a < 128) {
        row.push({ color: '#FFFFFF', code: '714', hex: '#FFFFFF' })
        colorMap.set('714', (colorMap.get('714') || 0) + 1)
      } else {
        const hex = rgbToHex(r, g, b)
        const closest = findClosestColor(hex)
        row.push({ color: closest.hex, code: closest.code, hex: closest.hex })
        colorMap.set(closest.code, (colorMap.get(closest.code) || 0) + 1)
      }
    }
    result.push(row)
  }

  pixelData.value = result
  templateWidth.value = newWidth
  templateHeight.value = newHeight
  usedColors.value = Array.from(colorMap.entries())
    .map(([code, count]) => {
      const color = pingDouColors.find(c => c.code === code)
      return { code, hex: color?.hex || '#FFFFFF', count }
    })
    .sort((a, b) => b.count - a.count)
  loading.value = false
}

const selectColor = (color: ColorInfo) => {
  selectedColor.value = selectedColor.value?.code === color.code ? null : color
}

const onColorCountChange = (e: { detail: { value: number } }) => {
  colorCount.value = e.detail.value
}

const goBack = () => {
  uni.navigateBack()
}

const saveImage = () => {
  uni.showToast({ title: '保存功能开发中', icon: 'none' })
}

// 全览
const openFullView = () => {
  showFullView.value = true
  zoom.value = 1
}
const closeFullView = () => { showFullView.value = false }
const zoomIn = () => { if (zoom.value < 3) zoom.value += 0.25 }
const zoomOut = () => { if (zoom.value > 0.25) zoom.value -= 0.25 }
const resetZoom = () => { zoom.value = 1 }

onLoad((options) => {
  if (options) {
    imagePath.value = decodeURIComponent(options.image || '')
    templateSize.value = parseInt(options.templateSize || '100')
    pixelSize.value = parseInt(options.pixelSize || '16')
    colorCount.value = parseInt(options.colorCount || '10')
    showColorCode.value = options.showColorCode === 'true'
  }
})

onMounted(() => {
  if (!imagePath.value) {
    uni.showToast({ title: '图片加载失败', icon: 'none' })
    return
  }
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => { processImage(img) }
  img.onerror = () => {
    loading.value = false
    uni.showToast({ title: '图片处理失败', icon: 'none' })
  }
  img.src = imagePath.value
})
</script>

<style lang="scss">
$bg-color:        #e4eff8;
$app-bg:          #eff6fb;
$primary-blue:    #abcce9;
$primary-blue-dark: #8baece;
$accent-yellow:   #fcf4d9;
$accent-green:    #90deb3;
$accent-pink:     #fdaab7;
$text-main:       #4d6076;
$text-light:      #7b93a8;
$white:           #ffffff;

$clay-shadow-out: 8rpx 8rpx 16rpx rgba(139, 174, 206, 0.4), -8rpx -8rpx 16rpx rgba(255, 255, 255, 0.9);
$clay-shadow-in: inset 4rpx 4rpx 10rpx rgba(255, 255, 255, 0.8), inset -4rpx -4rpx 10rpx rgba(139, 174, 206, 0.3);
$clay-depressed: inset 4rpx 4rpx 8rpx rgba(139, 174, 206, 0.5), inset -4rpx -4rpx 8rpx rgba(255, 255, 255, 0.9);
$clay-btn-active-out: 2rpx 2rpx 5rpx rgba(139, 174, 206, 0.4), -2rpx -2rpx 5rpx rgba(255, 255, 255, 0.9);
$clay-btn-active-in: inset 6rpx 6rpx 12rpx rgba(139, 174, 206, 0.5), inset -6rpx -6rpx 12rpx rgba(255, 255, 255, 0.9);

page { background-color: $bg-color; }

.page-container {
  width: 100%;
  min-height: 100vh;
  background-color: $app-bg;
  padding: 20px;
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.decor { position: absolute; z-index: 5; }
.decor-star { color: #ffd166; text-shadow: 2px 2px 4px rgba(139,174,206,0.4); }
.decor-heart { color: #ff99ac; text-shadow: 2px 2px 4px rgba(139,174,206,0.4); }

.header {
  background-color: $accent-yellow;
  border-radius: 25px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 26px;
  color: $primary-blue-dark;
  text-shadow: 1px 1px 0px rgba(255,255,255,0.8);
  letter-spacing: 1px;
  font-weight: 800;
}

.fas { font-size: 18px; }

/* 加载 */
.loading-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}
.loading-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.loading-spinner {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  box-shadow: 0 10px 28px rgba(139,174,206,0.4), inset 0 -4px 10px rgba(139,174,206,0.2), inset 0 4px 14px rgba(255,255,255,0.75);
  animation: spin 1.2s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite;
}
.loading-text { font-size: 16px; font-weight: 700; color: $text-main; }

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 分割内容: 网格 + 色号清单 */
.content-split {
  display: flex;
  gap: 15px;
  min-height: 240px;
}

.grid-container {
  flex: 1.2;
  display: flex;
  flex-direction: column;
}
.grid-box {
  background-color: $primary-blue;
  border-radius: 25px;
  padding: 15px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.bead-grid {
  display: grid;
  gap: 1px;
  width: 100%;
  max-width: 300px;
  background-color: #e0e0e0;
  padding: 4px;
  border-radius: 10px;
}
.bead {
  border-radius: 50%;
  width: 100%;
  aspect-ratio: 1;
  box-shadow: inset -1px -1px 3px rgba(0,0,0,0.2), inset 1px 1px 3px rgba(255,255,255,0.6);
  background-color: #ffffff;
}

.list-container {
  flex: 0.8;
  display: flex;
  flex-direction: column;
}
.color-list-box {
  background-color: #d1e5f5;
  border-radius: 25px;
  padding: 12px;
  flex: 1;
  max-height: 260px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.color-item {
  background-color: $white;
  border-radius: 18px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
}
.color-item-selected {
  box-shadow: 0 4px 12px rgba(139,174,206,0.4), inset 0 -2px 4px rgba(139,174,206,0.2), inset 0 2px 5px rgba(255,255,255,0.7);
  transform: scale(1.02);
}
.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: inset -3px -3px 6px rgba(0,0,0,0.15), inset 3px 3px 6px rgba(255,255,255,0.6), 2px 2px 5px rgba(139,174,206,0.5);
}
.color-info {
  font-size: 11px;
  line-height: 1.3;
}
.color-brand { font-size: 9px; color: $primary-blue-dark; font-weight: 800; }
.color-name { font-weight: 800; font-size: 12px; }

/* 滑块 */
.controls { margin-top: 5px; }
.slider-header {
  display: flex;
  justify-content: space-between;
  font-weight: 800;
  font-size: 16px;
  margin-bottom: 10px;
  padding: 0 5px;
}
.slider-track {
  height: 12px;
  border-radius: 10px;
  background: $app-bg;
  box-shadow: $clay-depressed;
  position: relative;
  display: flex;
  align-items: center;
}

/* 按钮 */
.action-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

/* 全览 */
.full-view-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.85);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.full-view-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.full-view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: $app-bg;
  gap: 10px;
}
.full-view-title {
  font-size: 14px;
  font-weight: 700;
  color: $text-main;
  white-space: nowrap;
}
.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: $bg-color;
  padding: 4px 12px;
  border-radius: 30px;
  box-shadow: inset 0 2px 6px rgba(139,174,206,0.2), inset 0 -1px 3px rgba(255,255,255,0.7);
}
.zoom-btn {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: $white;
  box-shadow: 0 2px 6px rgba(139,174,206,0.3), inset 0 -2px 4px rgba(139,174,206,0.1), inset 0 2px 5px rgba(255,255,255,0.7);
  font-size: 16px; font-weight: 700; color: $text-main;
}
.zoom-level {
  font-size: 12px; font-weight: 600; color: $text-main;
  min-width: 50px; text-align: center;
}
.close-btn {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: $accent-pink;
  font-size: 16px; font-weight: 700; color: white;
  box-shadow: 0 2px 6px rgba(139,174,206,0.3), inset 0 -2px 4px rgba(139,174,206,0.1), inset 0 2px 5px rgba(255,255,255,0.7);
}
.full-view-scroll {
  flex: 1;
  padding: 30px;
  background: rgba(0,0,0,0.3);
}
.full-view-grid {
  background: #fff;
  padding: 15px;
  border-radius: 12px;
  transition: transform 0.2s ease;
}
.full-view-row {
  display: flex;
}
.full-view-pixel {
  width: 24px;
  height: 24px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(0,0,0,0.08);
  box-sizing: border-box;
  border-radius: 4px;
}
.full-view-code {
  font-size: 8px; color: rgba(0,0,0,0.5); font-weight: 700;
  text-shadow: 0 0 2px rgba(255,255,255,0.9);
  pointer-events: none;
}
.full-view-footer {
  padding: 14px;
  background: $app-bg;
  text-align: center;
  font-size: 12px; color: $text-light;
}
</style>