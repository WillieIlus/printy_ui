interface SeoRoute {
  loc: string
  lastmod: string
}

export default defineEventHandler(async (): Promise<SeoRoute[]> => {
  const today = new Date().toISOString().slice(0, 10)

  return [
    { loc: '/', lastmod: today },
    { loc: '/about', lastmod: today },
  ]
})
