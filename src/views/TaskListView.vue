<template>
  <div class="task-list">
    <div class="page-title">任务列表</div>

    <!-- 操作栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="openAdd">
        <el-icon><Plus /></el-icon> 新增任务
      </el-button>
      <el-button
        v-if="store.tasks.some(t => t.status === 'done')"
        @click="handleClearCompleted"
      >
        <el-icon><Delete /></el-icon> 清除已完成
      </el-button>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-input
        v-model="store.filter.keyword"
        placeholder="搜索任务标题或描述..."
        clearable
        :prefix-icon="Search"
      />
      <el-select
        v-model="store.filter.status"
        placeholder="任务状态"
        clearable
      >
        <el-option label="待办" value="todo" />
        <el-option label="进行中" value="in-progress" />
        <el-option label="已完成" value="done" />
      </el-select>
      <el-select
        v-model="store.filter.priority"
        placeholder="优先级"
        clearable
      >
        <el-option label="高" value="high" />
        <el-option label="中" value="medium" />
        <el-option label="低" value="low" />
      </el-select>
      <el-select
        v-model="store.filter.category"
        placeholder="分类"
        clearable
      >
        <el-option
          v-for="cat in store.categories"
          :key="cat"
          :label="cat"
          :value="cat"
        />
      </el-select>
      <el-checkbox v-model="store.filter.overdue" :checked="store.filter.overdue">
        仅显示逾期
      </el-checkbox>
    </div>

    <!-- 排序栏 -->
    <div class="sort-bar">
      <span class="sort-label">排序：</span>
      <el-radio-group
        :model-value="store.sort.field"
        @change="(val) => store.setSort(val)"
        size="small"
      >
        <el-radio-button value="createdAt">创建时间</el-radio-button>
        <el-radio-button value="dueDate">截止日期</el-radio-button>
        <el-radio-button value="priority">优先级</el-radio-button>
      </el-radio-group>
      <el-tooltip :content="store.sort.order === 'asc' ? '升序' : '降序'" placement="top">
        <el-button
          text
          circle
          @click="toggleOrder"
          :icon="store.sort.order === 'asc' ? SortUp : SortDown"
          class="sort-order-btn"
        />
      </el-tooltip>
    </div>

    <!-- 任务列表 -->
    <div v-if="store.filteredTasks.length === 0" class="empty-state">
      <el-empty description="没有找到匹配的任务" />
    </div>

    <div v-else class="task-grid">
      <TaskCard
        v-for="task in store.filteredTasks"
        :key="task.id"
        :task="task"
        @edit="handleEdit"
      />
    </div>

    <div class="task-count">
      共 {{ store.filteredTasks.length }} 个任务
    </div>

    <!-- 任务表单弹窗 -->
    <TaskForm v-model:visible="formVisible" :task="editingTask" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Search, SortUp, SortDown } from '@element-plus/icons-vue'
import { useTaskStore } from '../stores/taskStore'
import TaskCard from '../components/TaskCard.vue'
import TaskForm from '../components/TaskForm.vue'

const store = useTaskStore()
const formVisible = ref(false)
const editingTask = ref(null)

function openAdd() {
  editingTask.value = null
  formVisible.value = true
}

function handleEdit(task) {
  editingTask.value = task
  formVisible.value = true
}

function toggleOrder() {
  store.setSort(store.sort.field, store.sort.order === 'asc' ? 'desc' : 'asc')
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
</script>

<style scoped>
.task-list {
  max-width: 1100px;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.sort-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.sort-label {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.sort-order-btn {
  font-size: 18px;
  color: var(--text-secondary);
}

.task-grid {
  margin-top: 8px;
}

.task-count {
  margin-top: 16px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 13px;
}

.empty-state {
  padding: 60px 0;
}
</style>
