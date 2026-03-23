<template>
  <div class="h-[320px]">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import type { AnalyticsTimeSeriesPoint, AnalyticsTimeSeriesResponse } from '~/services/adminAnalytics'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps<{
  points: AnalyticsTimeSeriesPoint[]
  interval: AnalyticsTimeSeriesResponse['interval']
}>()

function formatBucketLabel(bucket: string, interval: AnalyticsTimeSeriesResponse['interval']) {
  const date = new Date(bucket)
  if (Number.isNaN(date.getTime())) return bucket
  if (interval === 'hour') {
    return date.toLocaleTimeString([], { hour: 'numeric' })
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const chartData = computed<ChartData<'line'>>(() => ({
  labels: props.points.map(point => formatBucketLabel(point.bucket, props.interval)),
  datasets: [
    {
      label: 'Visits',
      data: props.points.map(point => point.visits),
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.12)',
      borderWidth: 2,
      fill: true,
      pointRadius: 2,
      pointHoverRadius: 4,
      tension: 0.32,
    },
    {
      label: 'Quote submissions',
      data: props.points.map(point => point.quote_submits),
      borderColor: '#ea580c',
      backgroundColor: 'rgba(234, 88, 12, 0.08)',
      borderWidth: 2,
      fill: false,
      pointRadius: 2,
      pointHoverRadius: 4,
      tension: 0.32,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: {
      position: 'top',
      align: 'start',
      labels: {
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
    tooltip: {
      callbacks: {
        title(items) {
          const bucket = props.points[items[0]?.dataIndex ?? 0]?.bucket
          if (!bucket) return ''
          const date = new Date(bucket)
          if (Number.isNaN(date.getTime())) return bucket
          return date.toLocaleString()
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        maxRotation: 0,
        autoSkip: true,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(148, 163, 184, 0.18)',
      },
      ticks: {
        precision: 0,
      },
    },
  },
}))
</script>
