<template>
  <div>
    <PageHero
      eyebrow="contact printy"
      :icon="Mail"
      title="Talk to a human
who knows print."
      lead="Questions about a quote, a live job, or joining the network? We answer within one business day — usually much sooner."
    />

    <Section>
      <div class="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <!-- form -->
        <div class="rounded-3xl border p-6" style="border-color: var(--line); background: var(--panel)">
          <div v-if="sent" class="py-10 text-center">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style="background: color-mix(in srgb, var(--accent) 14%, transparent)">
              <CheckCheck :size="26" style="color: var(--accent)" />
            </div>
            <h2 class="mt-4 font-disp text-[22px] font-bold tracking-tight">Message received</h2>
            <p class="mx-auto mt-2 max-w-[38ch] text-[13px] leading-relaxed text-[var(--sub)]">
              Thanks {{ form.name.split(' ')[0] }}. We'll reply to {{ form.email }} within one business day.
            </p>
            <button
              class="press-key mt-5 rounded-xl border px-5 py-2.5 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]"
              style="border-color: var(--line)"
              @click="resetForm"
            >
              Send another
            </button>
          </div>

          <template v-else>
            <ML>What's this about?</ML>
            <div class="mt-2.5 grid grid-cols-2 gap-2">
              <button
                v-for="t in TOPICS"
                :key="t.id"
                type="button"
                class="press-key flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left"
                :style="{
                  borderColor: topic === t.id ? 'var(--accent)' : 'var(--line)',
                  background: topic === t.id ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'transparent',
                }"
                @click="topic = t.id"
              >
                <component :is="t.icon" :size="14" :style="{ color: topic === t.id ? 'var(--accent)' : 'var(--sub)' }" />
                <span class="font-disp text-[12.5px] font-semibold" :style="{ color: topic === t.id ? 'var(--accent)' : 'var(--ink)' }">{{ t.label }}</span>
              </button>
            </div>

            <div class="mt-5 space-y-3.5">
              <label v-for="f in fields" :key="f.k" class="block">
                <ML>{{ f.label }}</ML>
                <input
                  :type="f.type"
                  :value="form[f.k]"
                  :placeholder="f.ph"
                  class="mt-1.5 w-full rounded-xl border bg-transparent px-3.5 py-3 text-[14px] outline-none transition-colors focus:border-[var(--accent)] placeholder:text-[var(--sub)] placeholder:opacity-60"
                  style="border-color: var(--line)"
                  @input="form[f.k] = ($event.target as HTMLInputElement).value"
                />
              </label>
              <label class="block">
                <ML>Message</ML>
                <textarea
                  v-model="form.message"
                  rows="5"
                  placeholder="Tell us about the job, quantity and deadline…"
                  class="mt-1.5 w-full resize-none rounded-xl border bg-transparent px-3.5 py-3 text-[14px] outline-none transition-colors focus:border-[var(--accent)] placeholder:text-[var(--sub)] placeholder:opacity-60"
                  style="border-color: var(--line)"
                />
              </label>
            </div>

            <button
              type="button"
              :disabled="busy"
              class="press-key mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] disabled:opacity-50"
              style="background: var(--accent); color: var(--accentInk)"
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
          <div class="rounded-3xl border p-6" style="border-color: var(--line); background: var(--panel)">
            <ML>Reach us directly</ML>
            <div class="mt-4 space-y-3.5">
              <div v-for="[Icon, a, b] in reach" :key="a" class="flex items-start gap-3">
                <component :is="Icon" :size="15" class="mt-0.5 shrink-0" style="color: var(--accent)" />
                <div>
                  <div class="font-disp text-[13.5px] font-semibold">{{ a }}</div>
                  <div class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ b }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-3xl border p-6" style="border-color: var(--line); background: var(--panel)">
            <div class="flex items-center gap-2">
              <Clock :size="15" style="color: var(--accent)" />
              <span class="font-disp text-[14px] font-bold">Faster than emailing us</span>
            </div>
            <p class="mt-2 text-[12.5px] leading-relaxed text-[var(--sub)]">
              Most questions are about price or progress — and both are self-serve.
            </p>
            <div class="mt-3 flex flex-col gap-2">
              <NuxtLink to="/" class="press-key rounded-xl px-4 py-2.5 text-center font-mono2 text-[10.5px] font-bold uppercase tracking-[0.14em]" style="background: var(--accent); color: var(--accentInk)">
                Get an instant quote
              </NuxtLink>
              <NuxtLink to="/track" class="press-key rounded-xl border px-4 py-2.5 text-center font-mono2 text-[10.5px] font-bold uppercase tracking-[0.14em]" style="border-color: var(--line)">
                Track an existing job
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </Section>

    <div class="pb-20" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  CheckCheck, Clock, Factory, LoaderCircle, Mail, MapPin, MessageSquare, Phone, Radar, Send, ShoppingBag,
} from 'lucide-vue-next'
import type { Component } from 'vue'
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
</script>