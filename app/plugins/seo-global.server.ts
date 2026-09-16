export default defineNuxtPlugin(() => {
  useSeoMeta({
    titleTemplate: (titleChunk) => titleChunk ? `${titleChunk} | Printy` : 'Printy',
    ogSiteName: 'Printy',
    twitterCard: 'summary_large_image',
  })
})
