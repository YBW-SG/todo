<template>
  <el-container class="app-container">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="app-aside">
      <div class="logo">
        <el-icon :size="28"><List /></el-icon>
        <span v-show="!isCollapse" class="logo-text">任务管理</span>
      </div>
      <el-menu
        :default-active="route.path"
        :collapse="isCollapse"
        :router="true"
        background-color="transparent"
        class="nav-menu"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <template #title>首页</template>
        </el-menu-item>
        <el-menu-item index="/tasks">
          <el-icon><List /></el-icon>
          <template #title>任务列表</template>
        </el-menu-item>
        <el-menu-item index="/stats">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>统计分析</template>
        </el-menu-item>
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <template #title>设置</template>
        </el-menu-item>
      </el-menu>
      <div class="collapse-btn" @click="isCollapse = !isCollapse">
        <el-icon>
          <Fold v-if="!isCollapse" />
          <Expand v-else />
        </el-icon>
      </div>
    </el-aside>
    <el-container class="main-container">
      <el-header class="app-header" height="56px">
        <h2>{{ route.meta.title }}</h2>
      </el-header>
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { loadTheme } from './utils/storage'

const route = useRoute()
const isCollapse = ref(false)

// 应用保存的主题
const savedTheme = loadTheme()
document.documentElement.setAttribute('data-theme', savedTheme)
</script>

<style scoped>
.app-container {
  height: 100vh;
}

.app-aside {
  background: var(--aside-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  overflow: hidden;
}

.logo {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-bottom: 1px solid var(--border-color);
  color: var(--primary-color);
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
}

.nav-menu {
  flex: 1;
  border-right: none;
  padding-top: 8px;
}

.collapse-btn {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
  transition: color 0.2s;
}

.collapse-btn:hover {
  color: var(--primary-color);
}

.app-header {
  background: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.app-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.app-main {
  background: var(--main-bg);
  padding: 20px 24px;
  overflow-y: auto;
  height: calc(100vh - 56px);
}

.main-container {
  display: flex;
  flex-direction: column;
}
</style>
