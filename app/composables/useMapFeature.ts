export function useMapFeature() {
  const config = useRuntimeConfig()

  // Temporary global kill switch for all Google Maps UI and logic.
  // Re-enable by removing the hard `false` and relying on the API key check.
  const enableMap = computed(() => false && Boolean(config.public.googleMapsApiKey))

  return {
    enableMap,
  }
}
