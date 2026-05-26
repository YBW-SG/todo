<template>
  <div class="stats-view">
    <div class="page-title">统计分析</div>

    <!-- 概览统计 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :xs="12" :sm="6">
        <div class="stat-card">
          <div class="stat-value" style="color: #409eff">{{ stats.total }}</div>
          <div class="stat-label">总任务数</div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card">
          <div class="stat-value" style="color: #67c23a">{{ stats.done }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card">
          <div class="stat-value" style="color: #409eff">{{ stats.completionRate }}%</div>
          <div class="stat-label">完成率</div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card">
          <div class="stat-value" :style="{ color: stats.overdue > 0 ? '#f56c6c' : '#67c23a' }">
            {{ stats.overdue }}
          </div>
          <div class="stat-label">逾期任务</div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <!-- 状态分布 -->
      <el-col :xs="24" :sm="12">
        <el-card class="chart-card" shadow="never">
          <template #header><span class="card-title">任务状态分布</span></template>
          <v-chart :option="statusChartOption" style="height: 300px" autoresize />
        </el-card>
      </el-col>

      <!-- 优先级分布 -->
      <el-col :xs="24" :sm="12">
        <el-card class="chart-card" shadow="never">
          <template #header><span class="card-title">优先级分布</span></template>
          <v-chart :option="priorityChartOption" style="height: 300px" autoresize />
        </el-card>
      </el-col>

      <!-- 分类分布 -->
      <el-col :xs="24" :sm="12">
        <el-card class="chart-card" shadow="never">
          <template #header><span class="card-title">分类分布</span></template>
          <v-chart :option="categoryChartOption" style="height: 300px" autoresize />
        </el-card>
      </el-col>

      <!-- 最近7天完成趋势 -->
      <el-col :xs="24" :sm="12">
        <el-card class="chart-card" shadow="never">
          <template #header><span class="card-title">最近7天完成趋势</span></template>
          <v-chart :option="trendChartOption" style="height: 300px" autoresize />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useTaskStore } from '../stores/taskStore'

use([CanvasRenderer, PieChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

const store = useTaskStore()
const stats = computed(() => store.stats)

const statusChartOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 0, textStyle: { color: 'var(--text-secondary)' } },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['50%', '45%'],
    avoidLabelOverlap: false,
    label: { show: false },
    emphasis: {
      label: { show: true, fontSize: 14, fontWeight: 'bold' },
    },
    data: [
      { value: stats.value.todo, name: '待办', itemStyle: { color: '#909399' } },
      { value: stats.value.inProgress, name: '进行中', itemStyle: { color: '#e6a23c' } },
      { value: stats.value.done, name: '已完成', itemStyle: { color: '#67c23a' } },
    ],
  }],
}))

const priorityChartOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 0, textStyle: { color: 'var(--text-secondary)' } },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['50%', '45%'],
    avoidLabelOverlap: false,
    label: { show: false },
    emphasis: {
      label: { show: true, fontSize: 14, fontWeight: 'bold' },
    },
    data: [
      { value: stats.value.priorityStats.high || 0, name: '高', itemStyle: { color: '#f56c6c' } },
      { value: stats.value.priorityStats.medium || 0, name: '中', itemStyle: { color: '#e6a23c' } },
      { value: stats.value.priorityStats.low || 0, name: '低', itemStyle: { color: '#909399' } },
    ],
  }],
}))

const categoryChartOption = computed(() => {
  const entries = Object.entries(stats.value.categoryStats)
  const hasData = entries.length > 0
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: {
      bottom: 0,
      textStyle: { color: 'var(--text-secondary)' },
      type: 'scroll',
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold' },
      },
      data: hasData
        ? entries.map(([name, value]) => ({ name, value }))
        : [{ name: '暂无数据', value: 1, itemStyle: { color: '#dcdfe6' } }],
    }],
  }
})

const trendChartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '12%', containLabel: true },
  xAxis: {
    type: 'category',
    data: stats.value.trend.map((t) => t.date.slice(5)),
    axisLabel: { color: 'var(--text-secondary)' },
    axisLine: { lineStyle: { color: 'var(--border-color)' } },
  },
  yAxis: {
    type: 'value',
    minInterval: 1,
    axisLabel: { color: 'var(--text-secondary)' },
    splitLine: { lineStyle: { color: 'var(--border-color)', type: 'dashed' } },
  },
  series: [{
    type: 'bar',
    data: stats.value.trend.map((t) => t.count),
    itemStyle: {
      color: '#409eff',
      borderRadius: [4, 4, 0, 0],
    },
    barMaxWidth: 40,
  }],
}))
</script>

<style scoped>
.stats-view {
  max-width: 1100px;
}

.stat-row {
  margin-bottom: 20px;
}

.stat-row .stat-card {
  margin-bottom: 12px;
}

.chart-card {
  margin-bottom: 16px;
  background: var(--card-bg);
}

.card-title {
  font-size: 15px;
  font-weight: 600;
}
</style>
