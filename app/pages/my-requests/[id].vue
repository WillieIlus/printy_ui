<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
await navigateTo(`/quotes/${route.params.id}`, { redirectCode: 301 })
</script>
