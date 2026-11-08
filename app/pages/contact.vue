<template>
  <div>
    <section class="mx-auto w-full max-w-6xl px-5 pt-12 sm:px-8 sm:pt-16">
      <div class="max-w-[60ch]">
        <DesignSectionLabel index="CT" tone="brand">
          <Mail :size="12" class="mr-1 inline" /> Contact printy
        </DesignSectionLabel>
        <h1 class="mt-3 text-[38px] leading-[1.03] font-bold tracking-tight text-ink sm:text-[52px]" style="white-space: pre-line">
          Talk to a human
who knows print.
        </h1>
        <p class="mt-4 text-[15px] leading-relaxed text-ink-2">
          Questions about a quote, a live job, or joining the network? We answer within one business day — usually much sooner.
        </p>
      </div>
      <div class="mt-10 h-px w-full bg-line" />
    </section>

    <section class="mx-auto w-full max-w-6xl px-5 pt-12 sm:px-8">
      <div class="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <!-- form -->
        <div class="rounded-2xl border border-line bg-card p-6 shadow-card">
          <div v-if="sent" class="py-10 text-center">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint">
              <CheckCheck :size="26" class="text-brand" />
            </div>
            <h2 class="mt-4 text-[22px] font-bold tracking-tight text-ink">Message received</h2>
            <p class="mx-auto mt-2 max-w-[38ch] text-[13px] leading-relaxed text-ink-2">
              Thanks {{ form.name.split(' ')[0] }}. We'll reply to {{ form.email }} within one business day.
            </p>
            <button
              class="mt-5 rounded-xl border border-line-strong px-5 py-2.5 font-mono text-[11px] font-semibold tracking-[0.14em] text-ink-2 uppercase transition-colors hover:border-brand hover:text-brand"
              @click="resetForm"
            >
              Send another
            </button>
          </div>

          <template v-else>
            <span class="font-mono text-[10px] tracking-[0.2em] text-ink-3 uppercase">What's this about?</span>
            <div class="mt-2.5 grid grid-cols-2 gap-2">
              <button
                v-for="t in TOPICS"
                :key="t.id"
                type="button"
                class="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors"
                :class="topic === t.id ? 'border-brand bg-mint' : 'border-line bg-card hover:border-line-strong'"
                @click="topic = t.id"
              >
                <component :is="t.icon" :size="14" :class="topic === t.id ? 'text-brand' : 'text-ink-3'" />
                <span class="text-[12.5px] font-semibold" :class="topic === t.id ? 'text-brand-deep' : 'text-ink'">{{ t.label }}</span>
              </button>
            </div>

            <div class="mt-5 space-y-3.5">
              <label v-for="f in fields" :key="f.k" class="block">
                <span class="font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase">{{ f.label }}</span>
                <input
                  :type="f.type"
                  :value="form[f.k]"
                  :placeholder="f.ph"
                  class="mt-1.5 w-full rounded-xl border border-line bg-card px-3.5 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
                  @input="form[f.k] = ($event.target as HTMLInputElement).value"
                >
              </label>
              <label class="block">
                <span class="font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase">Message</span>
                <textarea
                  v-model="form.message"
                  rows="5"
                  placeholder="Tell us about the job, quantity and deadline…"
                  class="mt-1.5 w-full resize-none rounded-xl border border-line bg-card px-3.5 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
                />
              </label>
            </div>

            <button
              type="button"
              :disabled="busy"
              class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-[12px] font-bold tracking-[0.16em] text-white uppercase shadow-brand transition-colors hover:bg-brand-deep disabled:opacity-50"
              @click="submit"
            >
              <template v-if="busy">
                <LoaderCircle :size="15" class="animate-spin" /> Sending
              </template>
              <template v-else>Send message <Send :size="14" /></template>
            </button>
          </template>
        </div>

        <!-- details -->
        <div class="space-y-4">
          <div class="rounded-2xl border border-line bg-card p-6 shadow-card">
            <span class="font-mono text-[10px] tracking-[0.2em] text-ink-3 uppercase">Reach us directly</span>
            <div class="mt-4 space-y-3.5">
              <div v-for="[Icon, a, b] in reach" :key="a" class="flex items-start gap-3">
                <component :is="Icon" :size="15" class="mt-0.5 shrink-0 text-brand" />
                <div>
                  <div class="text-[13.5px] font-semibold text-ink">{{ a }}</div>
                  <div class="font-mono text-[9px] tracking-[0.12em] text-ink-3 uppercase">{{ b }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-line bg-card p-6 shadow-card">
            <div class="flex items-center gap-2">
              <Clock :size="15" class="text-brand" />
              <span class="text-[14px] font-bold text-ink">Faster than emailing us</span>
            </div>
            <p class="mt-2 text-[12.5px] leading-relaxed text-ink-2">
              Most questions are about price or progress — and both are self-serve.
            </p>
            <div class="mt-3 flex flex-col gap-2">
              <NuxtLink to="/" class="rounded-xl bg-brand px-4 py-2.5 text-center font-mono text-[10.5px] font-bold tracking-[0.14em] text-white uppercase shadow-brand transition-colors hover:bg-brand-deep">
                Get an instant quote
              </NuxtLink>
              <NuxtLink to="/track" class="rounded-xl border border-line-strong px-4 py-2.5 text-center font-mono text-[10.5px] font-bold tracking-[0.14em] text-ink-2 uppercase transition-colors hover:border-brand hover:text-brand">
                Track an existing job
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="pb-20" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  CheckCheck, Clock, Factory, LoaderCircle, Mail, MapPin, MessageSquare, Phone, Radar, Send, ShoppingBag,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import DesignSectionLabel from '~/components/design/ui/SectionLabel.vue'
import { useWorkflowStore } from '~/stores/workflow'
import { useApi } from '~/composables/useApi'
import { submitContactMessage, validateContactForm } from '~/shared/contact'
import type { ContactTopic } from '~/shared/contact'

const w = useWorkflowStore()

const TOPICS: Array<{ id: ContactTopic; label: string; icon: Component }> = [
  { id: 'quote', label: 'A quote or order', icon: ShoppingBag },
  { id: 'partner', label: 'Joining as a printer', icon: Factory },
  { id: 'manager', label: 'Becoming a manager', icon: Radar },
  { id: 'other', label: 'Something else', icon: MessageSquare },
]

const topic = ref<ContactTopic>('quote')
const form = reactive({ name: '', email: '', message: '' })
const busy = ref(false)
const sent = ref(false)

const fields: Array<{ label: string; k: 'name' | 'email'; ph: string; type: string }> = [
  { label: 'Your name', k: 'name', ph: 'Ava Lindqvist', type: 'text' },
  { label: 'Email', k: 'email', ph: 'you@company.co.ke', type: 'email' },
]

const reach: Array<[Component, string, string]> = [
  [Mail, 'hello@printy.ke', 'General enquiries'],
  [Phone, '+254 700 000 000', 'Mon–Sat, 8am–6pm EAT'],
  [MapPin, 'Industrial Area, Nairobi', 'Production partner hub'],
]

function resetForm() {
  sent.value = false
  form.name = ''
  form.email = ''
  form.message = ''
}

async function submit() {
  const problem = validateContactForm({ topic: topic.value, name: form.name, email: form.email, message: form.message })
  if (problem) {
    w.pushToast(problem, '#F5A623')
    return
  }
  busy.value = true
  try {
    const { publicApiNoAuth } = useApi()
    await submitContactMessage(
      { topic: topic.value, name: form.name, email: form.email, message: form.message },
      publicApiNoAuth,
    )
    sent.value = true
    w.pushToast('Message sent — we reply within one business day.', '#2FBF71')
  } catch {
    w.pushToast("We couldn't send your message. It was not submitted. Please try again.", '#F5A623')
  } finally {
    busy.value = false
  }
}

definePageMeta({ layout: 'design-public', role: 'client' })
</script>
