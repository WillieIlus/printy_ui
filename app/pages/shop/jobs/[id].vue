<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
await navigateTo(`/dashboard/production/jobs/${route.params.id}`, { replace: true })
</script>
