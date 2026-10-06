<template>
  <component :is="icon" :size="size" aria-hidden="true" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  AlertOctagon,
  BadgeCheck,
  Database,
  Factory,
  FileText,
  Flag,
  Gauge,
  Inbox,
  Lock,
  Rocket,
  Users,
  Wallet,
} from 'lucide-vue-next'
import type { AdminNavIcon } from '~/shared/admin-nav'

const props = withDefaults(defineProps<{ name: AdminNavIcon; size?: number }>(), { size: 14 })

const ICONS = {
  gauge: Gauge,
  'file-text': FileText,
  rocket: Rocket,
  users: Users,
  factory: Factory,
  wallet: Wallet,
  flag: Flag,
  'badge-check': BadgeCheck,
  'alert-octagon': AlertOctagon,
  inbox: Inbox,
  lock: Lock,
  database: Database,
}

const icon = computed(() => ICONS[props.name])
</script>