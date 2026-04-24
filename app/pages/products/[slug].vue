<template>
  <!-- Your Vue template here -->
</template>

<script>
export default {
  computed: {
    productOptions() {
      const options = categoryFromApi.value.options || products[slug.value]?.options ?? [];
      return options;
    }
  }
};
</script>
