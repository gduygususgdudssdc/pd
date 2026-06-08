<template>
  <!-- ========================================
   像素级复刻 Bead Weaver HTML
   元素顺序 / CSS 属性 / 颜色值 / 阴影 / 间距 — 完全一致
   ======================================== -->
  <view class="page-container">

    <!-- Decorations -->
    <text class="decor star" style="top: 80px; right: 20px; font-size: 24px; transform: rotate(15deg);">★</text>
    <text class="decor heart" style="top: 110px; right: 10px; font-size: 18px; transform: rotate(-10deg);">♥</text>
    <text class="decor star" style="top: 330px; left: 10px; font-size: 28px; transform: rotate(-20deg);">★</text>
    <text class="decor star" style="bottom: 110px; left: 55%; font-size: 22px;">★</text>
    <text class="decor heart" style="bottom: 90px; right: 40px; font-size: 16px; transform: rotate(15deg);">♥</text>
    <text class="decor heart" style="bottom: 110px; right: 65px; font-size: 20px; transform: rotate(-15deg);">♥</text>

    <!-- Header -->
    <header class="header clay">
      <view class="icon-btn clay clay-interactive" @click="goBack">
        <text>↩</text>
      </view>
      <h1 class="header-title">Bead Weaver</h1>
      <view class="icon-btn clay clay-interactive" @click="showSettingsModal = true">
        <text>⚙</text>
      </view>
    </header>

    <!-- Upload 图片 -->
    <view>
      <view class="section-title">上传图片</view>
      <view class="upload-area clay clay-interactive" @click="chooseImage">
        <view class="upload-inner clay">
          <text class="upload-icon">+</text>
          <text class="upload-text">点击或拖拽图片到此</text>
        </view>
      </view>
    </view>

    <!-- Content Split: Grid + Color List -->
    <view class="content-split">
      <!-- Left: Grid -->
      <view class="grid-container">
        <view class="section-title">生成的拼豆图纸</view>
        <view class="grid-box clay">
          <view class="bead-grid" :style="{ gridTemplateColumns: 'repeat(' + cols + ', 1fr)' }">
            <view
              v-for="(c, i) in beads"
              :key="i"
              class="bead"
              :style="{ backgroundColor: c }"
            ></view>
          </view>
        </view>
      </view>
      <!-- Right: Color List -->
      <view class="list-container">
        <view class="section-title" style="text-align: right; padding-right: 5px;">色号清单</view>
        <scroll-view scroll-y class="color-list-box clay">
          <view
            v-for="(item, idx) in colorItems"
            :key="idx"
            class="color-item clay clay-interactive"
          >
            <view class="color-swatch" :style="{ backgroundColor: item.hex }"></view>
            <view class="color-info">
              <view class="color-brand">⏺ Perler</view>
              <view class="color-name">{{ item.name }}</view>
              <text>{{ item.count }} 颗</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- Controls -->
    <view class="controls">
      <!-- 网格大小 -->
      <view class="slider-header">
        <span>网格大小</span>
        <span>{{ gridSize }}×{{ gridSize }}</span>
      </view>
      <view style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap;">
        <view v-for="s in [10,20,30,40,50]" :key="s"
          class="clay-interactive clay"
          :style="{
            padding:'5px 12px',borderRadius:'12px',fontSize:'11px',fontWeight:700,
            background: gridSize===s ? '#90deb3' : '#fcf4d9',
            color: gridSize===s ? '#4d6076' : '#7b93a8'
          }"
          @click="gridSize=s"
        >{{ s }}×{{ s }}</view>
      </view>

      <!-- 色号限制 -->
      <view class="slider-header">
        <span>色号限制</span>
        <span>{{ colorLimit }}</span>
      </view>
      <view class="slider-track" @click="(e:any) => onColorLimitTrackClick(e)">
        <view class="slider-progress" :style="{ width: colorLimitPercent + '%' }"></view>
        <view class="slider-thumb" :style="{ left: colorLimitPercent + '%' }"></view>
      </view>

      <!-- Action Buttons (exact HTML layout) -->
      <view class="action-btns">
        <view class="btn-large btn-green clay clay-interactive" @click="handleGenerate">生成清单</view>
        <view
          class="btn-large btn-blue clay clay-interactive"
          @click="handleGenerate"
        >生成图单</view>
        <view class="btn-large btn-pink clay clay-interactive save-btn" @click="saveImage">保存图纸</view>
      </view>
    </view>

    <!-- ========== Settings Modal (gear icon) ========== -->
    <view v-if="showSettingsModal" class="modal-overlay" @click="showSettingsModal = false">
      <view class="modal-card clay" @click.stop>
        <view style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <text style="font-size:18px;font-weight:800;color:#4d6076;">设置</text>
          <view class="clay-interactive" style="width:32px;height:32px;border-radius:50%;background:#fdaab7;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;" @click="showSettingsModal = false">✕</view>
        </view>
        <view style="display:flex;flex-direction:column;gap:14px;">
          <view style="display:flex;align-items:center;justify-content:space-between;">
            <text style="font-size:14px;font-weight:800;color:#4d6076;">网格大小</text>
            <view style="display:flex;gap:5px;justify-content:flex-end;">
              <view v-for="s in [10,20,30,40,50]" :key="s"
                class="clay-interactive"
                :style="{
                  padding:'4px 9px',borderRadius:'10px',fontSize:'10px',fontWeight:700,
                  background: gridSize===s ? '#abcce9' : '#eff6fb',
                  color: gridSize===s ? '#4d6076' : '#7b93a8',
                  boxShadow:'inset 4px 4px 8px rgba(139,174,206,0.5), inset -4px -4px 8px rgba(255,255,255,0.9)'
                }"
                @click="gridSize=s"
              >{{ s }}×{{ s }}</view>
            </view>
          </view>
          <view style="display:flex;align-items:center;justify-content:space-between;">
            <text style="font-size:14px;font-weight:800;color:#4d6076;">格子大小</text>
            <view style="display:flex;align-items:center;gap:10px;">
              <view class="clay-groove" style="width:120px;height:10px;border-radius:10px;">
                <slider :value="pixelSize" :min="8" :max="30" :step="1" activeColor="#90deb3" backgroundColor="transparent" @change="(e:any)=>pixelSize=e.detail.value" style="width:100%;height:10px;" />
              </view>
              <text style="font-size:11px;font-weight:700;color:#4d6076;background:#fcf4d9;padding:2px 10px;border-radius:10px;box-shadow:0 2px 5px rgba(139,174,206,0.4), inset 0 -2px 4px rgba(139,174,206,0.15), inset 0 2px 5px rgba(255,255,255,0.7);">{{ pixelSize }}</text>
            </view>
          </view>
          <view style="display:flex;align-items:center;justify-content:space-between;">
            <text style="font-size:14px;font-weight:800;color:#4d6076;">显示色号</text>
            <switch :checked="showCode" color="#abcce9" @change="(e:any)=>showCode=e.detail.value" />
          </view>
        </view>
      </view>
    </view>

    <!-- ========== Full View Modal (tap grid) ========== -->
    <view v-if="showFullModal" class="modal-overlay" style="background:rgba(0,0,0,0.85);" @click="showFullModal = false">
      <view class="full-content" @click.stop>
        <view style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:#eff6fb;">
          <text style="font-size:14px;font-weight:700;color:#4d6076;">拼豆图纸 ({{ cols }}×{{ rows }})</text>
          <view style="display:flex;align-items:center;gap:8px;">
            <view class="clay-interactive" style="width:36px;height:36px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;box-shadow:0 2px 6px rgba(139,174,206,0.3), inset 0 -2px 4px rgba(139,174,206,0.1), inset 0 2px 5px rgba(255,255,255,0.7);" @click="zoomOut">−</view>
            <text style="font-size:12px;font-weight:600;min-width:50px;text-align:center;">{{ Math.round(zoom*100) }}%</text>
            <view class="clay-interactive" style="width:36px;height:36px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;box-shadow:0 2px 6px rgba(139,174,206,0.3), inset 0 -2px 4px rgba(139,174,206,0.1), inset 0 2px 5px rgba(255,255,255,0.7);" @click="zoomIn">+</view>
            <view class="clay-interactive" style="width:36px;height:36px;border-radius:50%;background:#fdaab7;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#fff;box-shadow:0 2px 6px rgba(139,174,206,0.3), inset 0 -2px 4px rgba(139,174,206,0.1), inset 0 2px 5px rgba(255,255,255,0.7);" @click="showFullModal=false">✕</view>
          </view>
        </view>
        <scroll-view scroll-x scroll-y style="flex:1;padding:30px;background:rgba(0,0,0,0.3);">
          <view :style="{ transform:'scale('+zoom+')',transformOrigin:'top left',background:'#fff',padding:'15px',borderRadius:'12px',display:'inline-flex',flexDirection:'column' }">
            <view v-for="(row,rIdx) in pixelMatrix" :key="rIdx" style="display:flex;">
              <view v-for="(p,cIdx) in row" :key="cIdx"
                :style="{width:'24px',height:'24px',backgroundColor:p.color,border:'0.5px solid rgba(0,0,0,0.08)',boxSizing:'border-box',display:'flex',alignItems:'center',justifyContent:'center'}"
              >
                <text v-if="showCode" style="font-size:7px;color:rgba(0,0,0,0.5);font-weight:700;text-shadow:0 0 2px rgba(255,255,255,0.9);">{{ p.code }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
        <view style="padding:14px;background:#eff6fb;text-align:center;font-size:12px;color:#7b93a8;">双指缩放或使用按钮调节大小</view>
      </view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { pingDouColors, findClosestColor, rgbToHex } from '@/utils/colors'
import { templateApi, storage, type Template } from '@/utils/api'

// ───── HTML 中的演示小猫图案 ─────
const catPattern = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,0,0,0,0,1,1,0,0],
  [0,1,3,4,1,0,0,1,4,3,1,0],
  [0,1,2,2,2,1,1,2,2,2,1,0],
  [1,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,2,2,2,2,2,2,1,2,1],
  [1,4,2,2,1,2,2,1,2,2,4,1],
  [1,2,2,2,2,1,1,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,1],
  [0,1,2,2,2,2,2,2,2,2,1,0],
  [0,0,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
]
const catColors: Record<number, string> = {
  0: '#9cdabc', 1: '#555555', 2: '#fcf3d6', 3: '#8c9ea7', 4: '#ffb5c5',
}

// ───── 状态 ─────
const showSettingsModal = ref(false)
const showFullModal = ref(false)
const zoom = ref(1)
const colorLimit = ref(10)
const pixelSize = ref(16)
const templateSize = ref(100)
const gridSize = ref(40)
const showCode = ref(true)
const imagePath = ref('')
const hasImage = ref(false)
const cols = ref(12)
const rows = ref(12)

// 简略版模式判断：网格小于60时生成简略版
const isSimplified = computed(() => gridSize.value < 60)

interface Pixel { color: string; code: string; hex: string }
const pixelMatrix = ref<Pixel[][]>([])
const colorStats = ref<{ hex: string; name: string; count: number }[]>([])

// ───── 展平 beads ─────
const beads = computed(() => {
  if (hasImage.value && pixelMatrix.value.length) {
    const out: string[] = []
    for (const row of pixelMatrix.value) for (const p of row) out.push(p.color)
    return out
  }
  const out: string[] = []
  for (const row of catPattern) for (const v of row) out.push(catColors[v])
  return out
})

// ───── 色号清单 ─────
const colorItems = computed(() => {
  if (hasImage.value && colorStats.value.length) return colorStats.value
  return [
    { hex: '#9cdabc', name: '薄荷绿', count: 150 },
    { hex: '#a4b4bb', name: 'P123',   count: 100 },
    { hex: '#f7ebc6', name: 'P123',   count: 100 },
    { hex: '#7b7d7f', name: 'P123',   count: 150 },
  ]
})

// ───── 方法 ─────
const goBack = () => { uni.navigateBack() }

// ───── 滑块位置计算 ─────
// 旧的滑块相关已移除，保留 colorLimit 部分
const colorLimitPercent = computed(() => ((colorLimit.value - 4) / 16) * 70 + 15)

// ───── 滑块点击处理 ─────
// 网格大小现在用按钮选择，不再需要滑块处理
const onColorLimitTrackClick = (e: any) => {
  const touch = e.touches?.[0] || e
  const rect = e.currentTarget?.getBoundingClientRect?.() || { left: 0, width: 200 }
  const percent = Math.max(0, Math.min(100, ((touch.clientX || touch.pageX) - rect.left) / rect.width * 100))
  const newValue = Math.round(((percent - 15) / 70 * 16 + 4))
  colorLimit.value = Math.max(4, Math.min(20, newValue))
}

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res: any) => {
      imagePath.value = res.tempFilePaths[0]
      processImage(res.tempFilePaths[0])
    },
    fail: () => { uni.showToast({ title: '选择图片失败', icon: 'none' }) },
  })
}

const processImage = (path: string) => {
  uni.showLoading({ title: '正在生成...' })
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) { uni.hideLoading(); return }
    const scale = gridSize.value / Math.max(img.width, img.height)
    const w = Math.round(img.width * scale)
    const h = Math.round(img.height * scale)
    canvas.width = w; canvas.height = h
    ctx.drawImage(img, 0, 0, w, h)
    const data = ctx.getImageData(0, 0, w, h).data
    const result: Pixel[][] = []
    const map = new Map<string, number>()
    for (let y = 0; y < h; y++) {
      const row: Pixel[] = []
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4
        const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3]
        if (a < 128) {
          row.push({ color: '#FFFFFF', code: '714', hex: '#FFFFFF' })
          map.set('714', (map.get('714') || 0) + 1)
        } else {
          const hex = rgbToHex(r, g, b)
          const closest = findClosestColor(hex)
          row.push({ color: closest.hex, code: closest.code, hex: closest.hex })
          map.set(closest.code, (map.get(closest.code) || 0) + 1)
        }
      }
      result.push(row)
    }
    pixelMatrix.value = result
    cols.value = w; rows.value = h
    colorStats.value = Array.from(map.entries())
      .map(([code, count]) => {
        const c = pingDouColors.find(x => x.code === code)
        return { hex: c?.hex || '#FFFFFF', name: c?.name || code, count }
      })
      .sort((a, b) => b.count - a.count)
    hasImage.value = true
    uni.hideLoading()
  }
  img.onerror = () => { uni.hideLoading(); uni.showToast({ title: '图片处理失败', icon: 'none' }) }
  img.src = path
}

const handleGenerate = () => {
  if (!hasImage.value) { uni.showToast({ title: '请先上传图片', icon: 'none' }); return }
  if (imagePath.value) processImage(imagePath.value)
}

const saveImage = async () => {
  if (!hasImage.value && pixelMatrix.value.length === 0) {
    uni.showToast({ title: '请先上传图片', icon: 'none' })
    return
  }
  
  uni.showLoading({ title: '正在保存...' })
  
  try {
    const token = storage.getToken()
    const isLoggedIn = !!token
    
    if (isLoggedIn) {
      await saveTemplateToServer()
    }
    
    const svgContent = generateSVG()
    const base64Data = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`
    
    uni.downloadFile({
      url: base64Data,
      success: (res) => {
        uni.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            uni.hideLoading()
            uni.showToast({
              title: '保存成功',
              icon: 'success'
            })
          },
          fail: () => {
            uni.hideLoading()
            uni.showToast({
              title: '保存图片失败',
              icon: 'none'
            })
          }
        })
      },
      fail: () => {
        uni.hideLoading()
        uni.showToast({
          title: '生成图片失败',
          icon: 'none'
        })
      }
    })
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: '保存失败',
      icon: 'none'
    })
  }
}

const saveTemplateToServer = async () => {
  const currentMatrix = pixelMatrix.value.length ? pixelMatrix.value : getDefaultMatrix()
  
  const numericMatrix = currentMatrix.map(row => 
    row.map(p => Object.values(catColors).indexOf(p.color))
  )
  
  const colors: Record<number, string> = { ...catColors }
  currentMatrix.flat().forEach(p => {
    const idx = Object.values(colors).indexOf(p.color)
    if (idx === -1) {
      colors[Object.keys(colors).length] = p.color
    }
  })
  
  const pattern = currentMatrix.flat().map(p => p.color)
  
  const templateData: Omit<Template, 'id' | 'createdAt'> = {
    title: hasImage.value ? '我的拼豆设计' : '小猫图案',
    matrix: numericMatrix,
    colors,
    pattern,
    theme: 'blue'
  }
  
  const response = await templateApi.save(templateData)
  
  if (!response.success) {
    console.log('保存到服务器失败:', response.message)
  }
}

const generateSVG = () => {
  const currentMatrix = pixelMatrix.value.length ? pixelMatrix.value : getDefaultMatrix()
  const cellSize = 18
  const padding = 20
  const width = currentMatrix[0]?.length * cellSize + padding * 2 || 200
  const height = currentMatrix.length * cellSize + padding * 2 || 200
  
  let beads = ''
  for (let row = 0; row < currentMatrix.length; row++) {
    for (let col = 0; col < currentMatrix[row].length; col++) {
      const color = currentMatrix[row][col].color
      const cx = padding + col * cellSize + cellSize / 2
      const cy = padding + row * cellSize + cellSize / 2
      beads += `<circle cx="${cx}" cy="${cy}" r="${cellSize / 2 - 1}" fill="${color}" stroke="#fff" stroke-width="0.5"/>`
    }
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#ffffff"/>
  ${beads}
</svg>`
}

const getDefaultMatrix = () => {
  return catPattern.map(row => row.map(v => ({ color: catColors[v], code: '', hex: catColors[v] })))
}
const zoomIn = () => { if (zoom.value < 3) zoom.value += 0.25 }
const zoomOut = () => { if (zoom.value > 0.25) zoom.value -= 0.25 }
</script>

<style lang="scss">
/* ===================================================
   完全复刻 — 每个值都与 HTML 对照一致
   =================================================== */
$bg:          #e4eff8;
$app:         #eff6fb;
$blue:        #abcce9;
$blue-dark:   #8baece;
$yellow:      #fcf4d9;
$green:       #90deb3;
$pink:        #fdaab7;
$text:        #4d6076;
$text-lt:     #7b93a8;
$white:       #ffffff;

$out: 8px 8px 16px rgba(139,174,206,0.4), -8px -8px 16px rgba(255,255,255,0.9);
$inn: inset 4px 4px 10px rgba(255,255,255,0.8), inset -4px -4px 10px rgba(139,174,206,0.3);
$btn-out: 2px 2px 5px rgba(139,174,206,0.4), -2px -2px 5px rgba(255,255,255,0.9);
$btn-in: inset 6px 6px 12px rgba(139,174,206,0.5), inset -6px -6px 12px rgba(255,255,255,0.9);
$dep: inset 4px 4px 8px rgba(139,174,206,0.5), inset -4px -4px 8px rgba(255,255,255,0.9);

page { background-color: $bg; }

/* ───── Page Container ───── */
.page-container {
  width: 100%;
  min-height: 100vh;
  background-color: $app;
  padding: 20px;
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
}

/* ───── Decor ───── */
.decor { position: absolute; z-index: 5; pointer-events: none; }
.star { color: #ffd166; text-shadow: 2px 2px 4px rgba(139,174,206,0.4); }
.heart { color: #ff99ac; text-shadow: 2px 2px 4px rgba(139,174,206,0.4); }

/* ───── Clay ───── */
.clay {
  background-color: $white;
  border-radius: 20px;
  box-shadow: $out, $inn;
  position: relative;
}
.clay-interactive {
  transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
  cursor: pointer;
}
.clay-interactive:active {
  box-shadow: $btn-out, $btn-in;
  transform: scale(0.97);
}
.clay-groove {
  background: $app;
  border-radius: 10px;
  box-shadow: $dep;
}

/* ───── Header ───── */
.header {
  background-color: $yellow;
  border-radius: 25px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}
.header-title {
  font-size: 26px;
  color: $blue-dark;
  text-shadow: 1px 1px 0px rgba(255,255,255,0.8);
  letter-spacing: 1px;
  font-weight: 800;
}
.icon-btn {
  width: 45px; height: 45px;
  background-color: $blue;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #5c7b99;
}

/* ───── Section Title ───── */
.section-title {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 12px;
  color: $text;
  padding-left: 5px;
}

/* ───── Upload ───── */
.upload-area {
  background-color: $blue;
  padding: 20px;
  border-radius: 25px;
}
.upload-inner {
  background-color: $blue;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
.upload-icon {
  font-size: 32px;
  color: #5c7b99;
  font-weight: bold;
}
.upload-text {
  font-size: 14px;
  color: #5c7b99;
  font-weight: 700;
}

/* ───── Content Split ───── */
.content-split {
  display: flex;
  gap: 15px;
  flex: 1;
  min-height: 260px;
}
.grid-container {
  flex: 1.2;
  display: flex;
  flex-direction: column;
}
.grid-box {
  background-color: $blue;
  border-radius: 25px;
  padding: 15px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 180px;
}
.bead-grid {
  display: grid;
  gap: 1px;
  width: 100%;
  max-width: 220px;
  background: #d0dde8;
  padding: 4px;
  border-radius: 12px;
}
.bead {
  border-radius: 50%;
  width: 100%;
  aspect-ratio: 1;
  box-shadow: inset -2px -2px 4px rgba(0,0,0,0.15), inset 2px 2px 4px rgba(255,255,255,0.6);
  background-color: #9cdabc;
}

/* ───── Color List ───── */
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
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  max-height: 220px;
}
.color-item {
  background-color: $white;
  border-radius: 18px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.color-swatch {
  width: 32px; height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: inset -3px -3px 6px rgba(0,0,0,0.15), inset 3px 3px 6px rgba(255,255,255,0.6), 2px 2px 5px rgba(139,174,206,0.5);
}
.color-info {
  font-size: 11px;
  line-height: 1.3;
}
.color-brand { font-size: 9px; color: $blue-dark; font-weight: 800; }
.color-name { font-weight: 800; font-size: 12px; }

/* ───── Controls ───── */
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
  background: $app;
  box-shadow: $dep;
  position: relative;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.slider-progress {
  height: 12px;
  border-radius: 10px;
  background: $green;
  position: absolute;
  left: 0;
  top: 0;
}
.slider-thumb {
  width: 24px; height: 24px;
  background: $green;
  border-radius: 50%;
  position: absolute;
  transform: translateX(-50%);
  box-shadow: inset -2px -2px 5px rgba(0,0,0,0.15), inset 2px 2px 5px rgba(255,255,255,0.7), 2px 2px 5px rgba(139,174,206,0.6);
  cursor: grab;
  z-index: 1;
}

/* ───── Buttons ───── */
.action-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 15px;
}
.action-btns .save-btn {
  grid-column: 2;
  grid-row: 1 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-large {
  padding: 15px 0;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 800;
  text-align: center;
  color: $white;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.15);
}
.btn-green { background-color: $green; }
.btn-blue { background-color: $blue; color: $text; text-shadow: 1px 1px 2px rgba(255,255,255,0.6); }
.btn-pink { background-color: $pink; }

/* ───── Modal Overlay ───── */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal-card {
  width: 340px;
  padding: 24px;
  border-radius: 25px;
}
</style>