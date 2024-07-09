<template>
  <section class="destinations">
    <DestinationCard
      v-for="destination in displayedDestinations"
      :key="destination.id"
      :image="destination.images[0].image"
      :title="destination.name"
      :description="destination.description"
      @click.native="handleCardClick(destination.id)"
    />
  </section>
</template>

<script>
import axios from 'axios';
import DestinationCard from './DestinationCard.vue';

export default {
  name: 'HomePage',
  components: {
    DestinationCard
  },
  data() {
    return {
      isLoggedIn: false,
      destinations: [],
      displayedDestinations: []
    };
  },
  created() {
    this.checkLoginStatus();
    this.fetchDestinations();
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;
    },
    async fetchDestinations() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/attractions');
        this.destinations = response.data;
        this.displayedDestinations = this.getRandomDestinations(this.destinations, 6);
      } catch (error) {
        console.error('获取景点数据失败:', error);
      }
    },
    getRandomDestinations(destinations, count) {
      if (destinations.length <= count) {
        return destinations;
      }
      const shuffled = destinations.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    },
    handleCardClick(id) {
      if (this.isLoggedIn) {
        this.$router.push(`/attractions/${id}`);
      } else {
        alert('您还未登录，请登录后再查看景点相关信息');
      }
    }
  }
}
</script>

<style scoped>
.destinations {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>
