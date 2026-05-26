import { defineStore } from 'pinia'
import { loadTasks, saveTasks } from '../utils/storage'
import dayjs from 'dayjs'

let nextId = Date.now()
function genId() {
  return (nextId++).toString(36)
}

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: loadTasks(),
    filter: {
      keyword: '',
      status: '',
      priority: '',
      category: '',
      overdue: false,
    },
    sort: {
      field: 'createdAt',
      order: 'desc',
    },
  }),

  getters: {
    filteredTasks(state) {
      let list = [...state.tasks]

      // 按关键词搜索标题或描述
      if (state.filter.keyword) {
        const kw = state.filter.keyword.toLowerCase()
        list = list.filter(
          (t) =>
            t.title.toLowerCase().includes(kw) ||
            (t.description && t.description.toLowerCase().includes(kw))
        )
      }

      // 按状态筛选
      if (state.filter.status) {
        list = list.filter((t) => t.status === state.filter.status)
      }

      // 按优先级筛选
      if (state.filter.priority) {
        list = list.filter((t) => t.priority === state.filter.priority)
      }

      // 按分类筛选
      if (state.filter.category) {
        list = list.filter((t) => t.category === state.filter.category)
      }

      // 按逾期筛选
      if (state.filter.overdue) {
        const now = dayjs().format('YYYY-MM-DD')
        list = list.filter((t) => t.dueDate && t.dueDate < now && t.status !== 'done')
      }

      // 排序
      const { field, order } = state.sort
      list.sort((a, b) => {
        let valA = a[field] || ''
        let valB = b[field] || ''

        if (field === 'priority') {
          const map = { high: 3, medium: 2, low: 1 }
          valA = map[valA] || 0
          valB = map[valB] || 0
        } else if (field === 'dueDate' || field === 'createdAt' || field === 'updatedAt') {
          valA = valA || ''
          valB = valB || ''
        } else {
          valA = String(valA)
          valB = String(valB)
        }

        if (valA < valB) return order === 'asc' ? -1 : 1
        if (valA > valB) return order === 'asc' ? 1 : -1
        return 0
      })

      return list
    },

    categories(state) {
      const set = new Set(state.tasks.map((t) => t.category).filter(Boolean))
      return [...set]
    },

    stats() {
      const total = this.tasks.length
      const todo = this.tasks.filter((t) => t.status === 'todo').length
      const inProgress = this.tasks.filter((t) => t.status === 'in-progress').length
      const done = this.tasks.filter((t) => t.status === 'done').length
      const completionRate = total > 0 ? Math.round((done / total) * 100) : 0
      const now = dayjs().format('YYYY-MM-DD')
      const overdue = this.tasks.filter(
        (t) => t.dueDate && t.dueDate < now && t.status !== 'done'
      ).length

      // 分类统计
      const categoryStats = {}
      const priorityStats = { high: 0, medium: 0, low: 0 }
      this.tasks.forEach((t) => {
        if (t.category) {
          categoryStats[t.category] = (categoryStats[t.category] || 0) + 1
        }
        priorityStats[t.priority] = (priorityStats[t.priority] || 0) + 1
      })

      // 最近7天完成趋势
      const trend = []
      for (let i = 6; i >= 0; i--) {
        const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
        const count = this.tasks.filter(
          (t) => t.status === 'done' && dayjs(t.updatedAt).format('YYYY-MM-DD') === date
        ).length
        trend.push({ date, count })
      }

      return { total, todo, inProgress, done, completionRate, overdue, categoryStats, priorityStats, trend }
    },
  },

  actions: {
    persist() {
      saveTasks(this.tasks)
    },

    addTask(task) {
      const now = dayjs().toISOString()
      this.tasks.unshift({
        id: genId(),
        ...task,
        createdAt: now,
        updatedAt: now,
      })
      this.persist()
    },

    updateTask(id, updates) {
      const index = this.tasks.findIndex((t) => t.id === id)
      if (index !== -1) {
        this.tasks[index] = {
          ...this.tasks[index],
          ...updates,
          updatedAt: dayjs().toISOString(),
        }
        this.persist()
      }
    },

    removeTask(id) {
      this.tasks = this.tasks.filter((t) => t.id !== id)
      this.persist()
    },

    toggleStatus(id) {
      const task = this.tasks.find((t) => t.id === id)
      if (task) {
        const next = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' }
        task.status = next[task.status]
        task.updatedAt = dayjs().toISOString()
        this.persist()
      }
    },

    clearCompleted() {
      this.tasks = this.tasks.filter((t) => t.status !== 'done')
      this.persist()
    },

    clearAll() {
      this.tasks = []
      this.persist()
    },

    setFilter(filter) {
      this.filter = { ...this.filter, ...filter }
    },

    setSort(field, order) {
      this.sort = { field, order: order || (this.sort.field === field && this.sort.order === 'asc' ? 'desc' : 'asc') }
    },

    replaceTasks(tasks) {
      this.tasks = tasks
      this.persist()
    },
  },
})
