<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

await navigateTo('/quotes', { redirectCode: 301 })
</script>
