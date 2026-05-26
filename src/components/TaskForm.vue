<template>
  <el-dialog
    :model-value="visible"
    :title="isEdit ? '编辑任务' : '新增任务'"
    width="520px"
    :close-on-click-modal="false"
    @update:model-value="$emit('update:visible', $event)"
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="top"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="任务标题" prop="title">
        <el-input
          v-model="form.title"
          placeholder="请输入任务标题"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="任务描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="请输入任务描述（可选）"
        />
      </el-form-item>

      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="优先级" prop="priority">
            <el-select v-model="form.priority" style="width: 100%">
              <el-option label="低" value="low" />
              <el-option label="中" value="medium" />
              <el-option label="高" value="high" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分类" prop="category">
            <el-select
              v-model="form.category"
              style="width: 100%"
              allow-create
              filterable
              clearable
              placeholder="选择或输入"
            >
              <el-option
                v-for="cat in categories"
                :key="cat"
                :label="cat"
                :value="cat"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="截止日期" prop="dueDate">
            <el-date-picker
              v-model="form.dueDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="选择日期"
              style="width: 100%"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">
        {{ isEdit ? '保存修改' : '创建任务' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useTaskStore } from '../stores/taskStore'

const props = defineProps({
  visible: { type: Boolean, default: false },
  task: { type: Object, default: null },
})

const emit = defineEmits(['update:visible'])

const store = useTaskStore()
const formRef = ref(null)
const submitting = ref(false)

const defaultForm = () => ({
  title: '',
  description: '',
  priority: 'medium',
  category: '',
  dueDate: '',
})

const form = reactive(defaultForm())

const isEdit = ref(false)

const rules = {
  title: [
    { required: true, message: '请输入任务标题', trigger: 'blur' },
    { min: 1, max: 100, message: '标题长度在 1-100 字之间', trigger: 'blur' },
  ],
}

const categories = computed(() => store.categories)

watch(
  () => props.visible,
  (val) => {
    if (val && props.task) {
      isEdit.value = true
      form.title = props.task.title
      form.description = props.task.description || ''
      form.priority = props.task.priority || 'medium'
      form.category = props.task.category || ''
      form.dueDate = props.task.dueDate || ''
    } else if (val) {
      isEdit.value = false
      Object.assign(form, defaultForm())
    }
  }
)

function handleClosed() {
  formRef.value?.resetFields()
}

function handleSubmit() {
  formRef.value.validate((valid) => {
    if (!valid) return

    submitting.value = true
    const taskData = {
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      category: form.category,
      dueDate: form.dueDate || '',
    }

    if (isEdit.value) {
      store.updateTask(props.task.id, taskData)
      ElMessage.success('任务已更新')
    } else {
      store.addTask(taskData)
      ElMessage.success('任务已创建')
    }

    submitting.value = false
    emit('update:visible', false)
  })
}
</script>
