<template>
  <el-card :class="['task-card', `task-card--${task.status}`]" shadow="hover">
    <div class="task-card__header">
      <div class="task-card__title-row">
        <el-checkbox
          v-if="task.status !== 'done'"
          :model-value="false"
          @click="store.toggleStatus(task.id)"
          title="标记为已完成"
        />
        <el-checkbox
          v-else
          :model-value="true"
          @click="store.toggleStatus(task.id)"
          title="恢复为待办"
        />
        <span :class="['task-card__title', { 'is-done': task.status === 'done' }]">
          {{ task.title }}
        </span>
        <el-tag
          :type="statusType"
          :hit="true"
          size="small"
          class="task-card__status-tag"
        >
          {{ statusLabel }}
        </el-tag>
      </div>
      <div class="task-card__actions">
        <el-tooltip content="编辑" placement="top">
          <el-button text circle @click="emit('edit', task)">
            <el-icon><Edit /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="删除" placement="top">
          <el-button text circle type="danger" @click="handleDelete">
            <el-icon><Delete /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>
    <div v-if="task.description" class="task-card__desc">
      {{ task.description }}
    </div>
    <div class="task-card__meta">
      <div class="task-card__tags">
        <el-tag v-if="task.category" size="small" type="info" effect="plain">
          {{ task.category }}
        </el-tag>
        <el-tag :type="priorityType" size="small" effect="plain">
          {{ priorityLabel }}
        </el-tag>
      </div>
      <div class="task-card__info">
        <span v-if="task.dueDate" :class="{ 'is-overdue': isOverdue }">
          <el-icon><Calendar /></el-icon>
          {{ task.dueDate }}
        </span>
        <span class="task-card__time">
          <el-icon><Clock /></el-icon>
          {{ dayjs(task.createdAt).format('MM-DD HH:mm') }}
        </span>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useTaskStore } from '../stores/taskStore'
import dayjs from 'dayjs'

const props = defineProps({
  task: { type: Object, required: true },
})

const emit = defineEmits(['edit'])
const store = useTaskStore()

const statusLabel = computed(() => {
  const map = { todo: '待办', 'in-progress': '进行中', done: '已完成' }
  return map[props.task.status] || '待办'
})

const statusType = computed(() => {
  const map = { todo: 'info', 'in-progress': 'warning', done: 'success' }
  return map[props.task.status] || 'info'
})

const priorityLabel = computed(() => {
  const map = { low: '低', medium: '中', high: '高' }
  return map[props.task.priority] || '中'
})

const priorityType = computed(() => {
  const map = { low: 'info', medium: 'warning', high: 'danger' }
  return map[props.task.priority] || 'warning'
})

const isOverdue = computed(() => {
  return props.task.dueDate && props.task.dueDate < dayjs().format('YYYY-MM-DD') && props.task.status !== 'done'
})

function handleDelete() {
  ElMessageBox.confirm('确定要删除该任务吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    store.removeTask(props.task.id)
    ElMessage.success('任务已删除')
  }).catch(() => {})
}
</script>

<style scoped>
.task-card {
  margin-bottom: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.task-card:hover {
  transform: translateY(-1px);
}

.task-card--done {
  opacity: 0.7;
}

.task-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.task-card__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.task-card__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-card__title.is-done {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.task-card__status-tag {
  flex-shrink: 0;
}

.task-card__actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.task-card__desc {
  margin-top: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-card__meta {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.task-card__tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.task-card__info {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-secondary);
}

.task-card__info .el-icon {
  vertical-align: middle;
  margin-right: 2px;
}

.is-overdue {
  color: #f56c6c;
  font-weight: 600;
}
</style>
