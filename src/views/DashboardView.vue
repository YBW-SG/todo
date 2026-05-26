<template>
  <div class="dashboard">
    <div class="page-title">仪表盘</div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :xs="12" :sm="8" :md="4">
        <div class="stat-card">
          <div class="stat-value" style="color: #409eff">{{ stats.total }}</div>
          <div class="stat-label">总任务</div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="8" :md="4">
        <div class="stat-card">
          <div class="stat-value" style="color: #909399">{{ stats.todo }}</div>
          <div class="stat-label">待办</div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="8" :md="4">
        <div class="stat-card">
          <div class="stat-value" style="color: #e6a23c">{{ stats.inProgress }}</div>
          <div class="stat-label">进行中</div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="8" :md="4">
        <div class="stat-card">
          <div class="stat-value" style="color: #67c23a">{{ stats.done }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="8" :md="4">
        <div class="stat-card">
          <div class="stat-value" style="color: #409eff">{{ stats.completionRate }}%</div>
          <div class="stat-label">完成率</div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="8" :md="4">
        <div class="stat-card">
          <div class="stat-value" :style="{ color: stats.overdue > 0 ? '#f56c6c' : '#67c23a' }">
            {{ stats.overdue }}
          </div>
          <div class="stat-label">逾期任务</div>
        </div>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <el-card class="section-card" shadow="never">
      <div class="section-header">
        <span class="section-title">快捷操作</span>
      </div>
      <div class="quick-actions">
        <el-button type="primary" @click="showForm = true">
          <el-icon><Plus /></el-icon> 新增任务
        </el-button>
        <el-button @click="$router.push('/tasks')">
          <el-icon><List /></el-icon> 查看全部任务
        </el-button>
        <el-button @click="$router.push('/stats')">
          <el-icon><DataAnalysis /></el-icon> 查看统计
        </el-button>
      </div>
    </el-card>

    <!-- 近期任务 -->
    <el-card class="section-card" shadow="never">
      <div class="section-header">
        <span class="section-title">近期任务</span>
      </div>
      <div v-if="recentTasks.length === 0" class="empty-tip">暂无任务，快去创建一个吧！</div>
      <TaskCard
        v-for="task in recentTasks"
        :key="task.id"
        :task="task"
        @edit="handleEdit"
      />
    </el-card>

    <!-- 任务表单 -->
    <TaskForm v-model:visible="showForm" :task="editingTask" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/taskStore'
import TaskCard from '../components/TaskCard.vue'
import TaskForm from '../components/TaskForm.vue'

const store = useTaskStore()
const showForm = ref(false)
const editingTask = ref(null)

const stats = computed(() => store.stats)

const recentTasks = computed(() =>
  [...store.tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
)

function handleEdit(task) {
  editingTask.value = task
  showForm.value = true
}
</script>

<style scoped>
.dashboard {
  max-width: 1100px;
}

.stat-row {
  margin-bottom: 20px;
}

.stat-row .stat-card {
  margin-bottom: 12px;
}

.section-card {
  margin-bottom: 20px;
  background: var(--card-bg);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.empty-tip {
  text-align: center;
  padding: 40px 0;
  color: var(--text-secondary);
  font-size: 14px;
}
</style>
