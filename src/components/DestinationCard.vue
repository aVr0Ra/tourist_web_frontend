<template>
  <div class="destination-card">
    <img :src="image" :alt="title" class="destination-image">
    <div class="destination-info">
      <h3>{{ title }}</h3>
      <p class="description"> {{ shortDescription }} </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DestinationCard',
  props: {
    image: String, // 直接使用传入的图片URL
    title: String,
    description: String
  },
  computed: {
    shortDescription() {
      if (this.description.length > 150) {
        return this.description.substr(0, 150);
      }
      else {
        return this.description;
      }
    }
  }
}
</script>

<style scoped>
.destination-card {
  width: 30%; /* Adjusted for 3 columns layout */
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
.destination-image {
  width: 100%;
  height: 200px; /* Adjusted height */
  object-fit: cover;
}
.destination-info {
  padding: 10px;
  text-align: center;
}
h3 {
  margin: 10px 0;
}
.description {
  height: 60px; /* Adjusted height */
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* Increased line clamp */
}
</style>
