<template>
  <div class="settings-view">
    <div class="page-title">设置</div>

    <!-- 主题设置 -->
    <el-card class="settings-card" shadow="never">
      <template #header>
        <span class="card-title"><el-icon><Brush /></el-icon> 主题设置</span>
      </template>
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">外观模式</div>
          <div class="setting-desc">切换浅色/深色主题</div>
        </div>
        <el-switch
          :model-value="isDark"
          active-text="深色"
          inactive-text="浅色"
          @change="toggleTheme"
        />
      </div>
    </el-card>

    <!-- 数据管理 -->
    <el-card class="settings-card" shadow="never">
      <template #header>
        <span class="card-title"><el-icon><Folder /></el-icon> 数据管理</span>
      </template>

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">导出数据</div>
          <div class="setting-desc">将任务数据导出为 JSON 文件</div>
        </div>
        <el-button @click="handleExport" :disabled="store.tasks.length === 0">
          导出 JSON
        </el-button>
      </div>

      <el-divider />

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">导入数据</div>
          <div class="setting-desc">从 JSON 文件导入任务数据（将替换当前数据）</div>
        </div>
        <el-upload
          :show-file-list="false"
          :before-upload="handleImport"
          accept=".json"
        >
          <el-button>导入 JSON</el-button>
        </el-upload>
      </div>

      <el-divider />

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">清除已完成任务</div>
          <div class="setting-desc">删除所有状态为"已完成"的任务</div>
        </div>
        <el-button
          type="warning"
          @click="handleClearCompleted"
          :disabled="!hasCompleted"
        >
          清除已完成
        </el-button>
      </div>

      <el-divider />

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">清空全部数据</div>
          <div class="setting-desc warning-text">此操作不可恢复，将删除所有任务数据</div>
        </div>
        <el-button type="danger" @click="handleClearAll" :disabled="store.tasks.length === 0">
          清空全部数据
        </el-button>
      </div>
    </el-card>

    <!-- 关于 -->
    <el-card class="settings-card" shadow="never">
      <template #header>
        <span class="card-title"><el-icon><InfoFilled /></el-icon> 关于</span>
      </template>
      <div class="about-info">
        <p><strong>任务管理系统</strong></p>
        <p>版本：1.0.0</p>
        <p>技术栈：Vue 3 + Vite + Pinia + Element Plus + ECharts</p>
        <p>数据存储：localStorage（本地浏览器存储）</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useTaskStore } from '../stores/taskStore'
import { exportTasks, importTasks, saveTheme } from '../utils/storage'

const store = useTaskStore()

const isDark = computed(() => document.documentElement.getAttribute('data-theme') === 'dark')
const hasCompleted = computed(() => store.tasks.some((t) => t.status === 'done'))

function toggleTheme(val) {
  const theme = val ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  saveTheme(theme)
  ElMessage.success(`已切换为${theme === 'dark' ? '深色' : '浅色'}主题`)
}

function handleExport() {
  exportTasks(store.tasks)
  ElMessage.success('数据已导出')
}

async function handleImport(file) {
  try {
    const data = await importTasks(file)
    if (!Array.isArray(data)) {
      ElMessage.error('无效的数据格式')
      return false
    }
    await ElMessageBox.confirm(
      `即将导入 ${data.length} 个任务，当前数据将被覆盖。确定继续吗？`,
      '确认导入',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
    store.replaceTasks(data)
    ElMessage.success(`成功导入 ${data.length} 个任务`)
  } catch {
    ElMessage.error('导入失败，请检查文件格式')
  }
  return false
}

function handleClearCompleted() {
  ElMessageBox.confirm('确定要清除所有已完成的任务吗？', '确认清除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    store.clearCompleted()
    ElMessage.success('已完成任务已清除')
  }).catch(() => {})
}

function handleClearAll() {
  ElMessageBox.confirm(
    '确定要清空全部数据吗？此操作不可恢复！',
    '危险操作',
    {
      confirmButtonText: '确定清空',
      cancelButtonText: '取消',
      type: 'error',
      confirmButtonClass: 'el-button--danger',
    }
  ).then(() => {
    store.clearAll()
    ElMessage.success('全部数据已清空')
  }).catch(() => {})
}
</script>

<style scoped>
.settings-view {
  max-width: 700px;
}

.settings-card {
  margin-bottom: 20px;
  background: var(--card-bg);
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.setting-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.setting-desc {
  font-size: 12px;
  color: var(--text-secondary);
}

.warning-text {
  color: #f56c6c;
}

.about-info p {
  margin-bottom: 6px;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.8;
}

.el-divider {
  margin: 16px 0;
}
</style>
