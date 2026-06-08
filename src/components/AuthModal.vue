<template>
  <view v-if="visible" class="auth-modal-overlay" @click="handleOverlayClick">
    <view class="auth-wrapper" @click.stop>
      <view class="auth-content">
        <text class="fas fa-heart decor heart-1">♥</text>
        <text class="fas fa-star decor star-1">★</text>
        <view class="decor blob-1"></view>
        <view class="decor blob-2"></view>

        <scroll-view scroll-y class="auth-scroll-container">
          <header class="auth-header">
            <view class="logo-box clay-pink">
              <text>🧩</text>
            </view>
            <h1 class="auth-title">
              {{ isLogin ? '欢迎回来' : '开启创作' }}
            </h1>
            <p class="auth-subtitle">
              {{ isLogin ? '登录以继续您的拼豆之旅' : '加入全球玩家社区，分享灵感' }}
            </p>
          </header>

          <main class="auth-form-area">
            <view class="form-card clay-white">
              <view class="mode-switcher clay-inset-gray">
                <view 
                  class="switch-bg clay-blue" 
                  :style="{ transform: isLogin ? 'translateX(0)' : 'translateX(100%)' }"
                ></view>
                <view @click="switchMode(true)" :class="['switch-btn', { 'active-text': isLogin }]">登录</view>
                <view @click="switchMode(false)" :class="['switch-btn', { 'active-text': !isLogin }]">注册</view>
              </view>

              <view class="input-group" v-if="!isLogin">
                <text class="input-label">用户名</text>
                <view class="input-wrapper clay-inset-blue">
                  <text class="input-icon">👤</text>
                  <input 
                    type="text" 
                    placeholder="捏一个响亮的名字" 
                    v-model="form.username"
                  />
                </view>
                <text v-if="errors.username" class="error-text">{{ errors.username }}</text>
              </view>

              <view class="input-group">
                <text class="input-label">邮箱地址</text>
                <view class="input-wrapper clay-inset-blue">
                  <text class="input-icon">✉️</text>
                  <input 
                    type="email" 
                    placeholder="example@bead.com" 
                    v-model="form.email"
                  />
                </view>
                <text v-if="errors.email" class="error-text">{{ errors.email }}</text>
              </view>

              <view class="input-group">
                <text class="input-label">登录密码</text>
                <view class="input-wrapper clay-inset-blue">
                  <text class="input-icon">🔒</text>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    v-model="form.password"
                  />
                </view>
                <text v-if="errors.password" class="error-text">{{ errors.password }}</text>
              </view>

              <text class="forgot-pwd" v-if="isLogin">忘记密码？</text>

              <view class="btn-primary clay-mint clay-interactive" @click="handleSubmit">
                {{ isLogin ? '立即登录' : '立即注册' }}
              </view>
            </view>

            <view class="social-auth">
              <text>或者使用以下方式</text>
              <view class="social-icons">
                <view class="social-item clay-white clay-interactive">
                  <text>💬</text>
                </view>
                <view class="social-item clay-white clay-interactive">
                  <text>🍎</text>
                </view>
                <view class="social-item clay-white clay-interactive">
                  <text>🐧</text>
                </view>
              </view>
            </view>
          </main>
        </scroll-view>

        <view class="close-btn" @click="handleClose">✕</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'

// --- Props ---
const props = defineProps({
  visible: { type: Boolean, default: false }
})

// --- Emits ---
const emit = defineEmits(['close', 'success'])

// --- Store ---
const userStore = useUserStore()

// --- State ---
const isLogin = ref(true)
const loading = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: ''
})

const errors = reactive({
  username: '',
  email: '',
  password: ''
})

// --- Methods ---
const switchMode = (mode) => {
  isLogin.value = mode
  // 清空错误
  Object.keys(errors).forEach(k => errors[k] = '')
}

const handleClose = () => {
  emit('close')
}

const handleOverlayClick = () => {
  handleClose()
}

const validate = () => {
  let valid = true
  
  if (!isLogin.value && !form.username.trim()) {
    errors.username = '请输入用户名'
    valid = false
  } else {
    errors.username = ''
  }

  if (!form.email.trim()) {
    errors.email = '请输入邮箱地址'
    valid = false
  } else {
    errors.email = ''
  }

  if (!form.password.trim()) {
    errors.password = '请输入密码'
    valid = false
  } else {
    errors.password = ''
  }

  return valid
}

const handleSubmit = async () => {
  if (!validate()) return

  loading.value = true
  try {
    const result = await (isLogin.value 
      ? userStore.login(form.email, form.password) 
      : userStore.register(form.username, form.email, form.password))

    if (result.success) {
      uni.showToast({ title: isLogin.value ? '登录成功' : '注册成功', icon: 'success' })
      emit('success')
      handleClose()
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
/* ================= 核心材质变量 ================= */
:root {
  --c-pink: #ffb5c5;
  --c-blue: #abcce9;
  --c-mint: #a0ebd8;
  --c-yellow: #fdf2cd;
  --c-white: #ffffff;
  --text-dark: #4d6076;
}

.auth-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Nunito', sans-serif;
}

.auth-content {
  width: 100%;
  height: 100%;
  background-color: #f6fafd;
  position: relative;
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 20px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  font-size: 18px;
  z-index: 101;
  cursor: pointer;
}

/* ================= 黏土材质类 ================= */
.clay-interactive {
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.clay-pink {
  background-color: #ffb5c5;
  box-shadow: 8px 8px 16px rgba(255, 181, 197, 0.4), 
              inset 4px 4px 10px rgba(255, 255, 255, 0.8),
              inset -4px -4px 10px rgba(232, 152, 168, 0.5);
}

.clay-blue {
  background-color: #abcce9;
  box-shadow: 5px 5px 15px rgba(171, 204, 233, 0.4),
              inset 3px 3px 8px rgba(255, 255, 255, 0.8),
              inset -3px -3px 8px rgba(139, 174, 206, 0.5);
}

.clay-mint {
  background-color: #a0ebd8;
  box-shadow: 0 15px 30px rgba(160, 235, 216, 0.4),
              inset 6px 6px 12px rgba(255, 255, 255, 0.8),
              inset -6px -6px 12px rgba(139, 206, 188, 0.5);
}

.clay-white {
  background-color: #ffffff;
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

/* ================= 布局样式 ================= */
.auth-scroll-container {
  height: 100%;
  overflow-y: auto;
}

.auth-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-box {
  width: 80px;
  height: 80px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px;
  font-size: 40px;
  color: #fff;
}

.auth-title {
  font-size: 28px;
  font-weight: 800;
  color: #4d6076;
  margin-bottom: 8px;
}

.auth-subtitle {
  font-size: 14px;
  color: #7b93a8;
  padding: 0 20px;
}

.form-card {
  padding: 30px 20px;
  border-radius: 35px;
}

.mode-switcher {
  display: flex;
  position: relative;
  height: 50px;
  border-radius: 25px;
  margin-bottom: 30px;
  padding: 5px;
}

.switch-bg {
  position: absolute;
  width: calc(50% - 5px);
  height: calc(100% - 10px);
  border-radius: 20px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.switch-btn {
  flex: 1;
  border: none;
  background: transparent;
  z-index: 1;
  font-weight: 800;
  color: #adb5bd;
  transition: color 0.3s;
  font-family: inherit;
  cursor: pointer;
  text-align: center;
  line-height: 40px;
}

.switch-btn.active-text {
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

.input-label {
  display: block;
  font-size: 13px;
  font-weight: 800;
  color: #4d6076;
  margin-bottom: 10px;
  margin-left: 10px;
}

.input-wrapper {
  height: 55px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.input-icon {
  color: #abcce9;
  font-size: 18px;
  margin-right: 12px;
}

.input-wrapper input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-family: inherit;
  font-weight: 600;
  color: #4d6076;
  font-size: 16px;
}

.input-wrapper input::placeholder {
  color: #cbd5e0;
}

.error-text {
  font-size: 12px;
  color: #ff6b6b;
  margin-top: 5px;
  margin-left: 10px;
  display: block;
}

.forgot-pwd {
  text-align: right;
  font-size: 12px;
  font-weight: 700;
  color: #abcce9;
  margin-top: -10px;
  margin-bottom: 25px;
  cursor: pointer;
  display: block;
}

.btn-primary {
  width: 100%;
  height: 60px;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 800;
  color: #3b6b5e;
  font-family: inherit;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.social-auth {
  margin-top: 40px;
  text-align: center;
}

.social-auth text {
  font-size: 12px;
  color: #adb5bd;
  margin-bottom: 20px;
  display: block;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-item {
  width: 50px;
  height: 50px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #abcce9;
}

/* ================= 装饰物动画 ================= */
.decor { position: absolute; z-index: 0; }
.heart-1 { top: 120px; right: 40px; color: #ffb5c5; font-size: 24px; transform: rotate(15deg); }
.star-1 { bottom: 150px; left: 30px; color: #fdf2cd; font-size: 30px; transform: rotate(-20deg); }
.blob-1 { top: 200px; left: -20px; width: 60px; height: 60px; background: #e0f4ef; border-radius: 50%; filter: blur(20px); }
.blob-2 { bottom: 50px; right: -20px; width: 80px; height: 80px; background: #fdf2cd; border-radius: 50%; opacity: 0.5; filter: blur(30px); }
</style>
