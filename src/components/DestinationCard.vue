<template>
  <div class="card">
    <img :src="image" alt="Destination Image" class="card-img">
    <div class="card-content">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DestinationCard',
  props: {
    image: String,
    title: String,
    description: String
  }
}
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 16px;
  max-width: 300px;
}
.card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.card-content {
  padding: 16px;
}
h2 {
  margin: 0 0 8px;
  font-size: 1.5em;
}
p {
  margin: 0;
  color: #555;
}
</style>
