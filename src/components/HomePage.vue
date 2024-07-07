<template>
  <section class="destinations">
    <DestinationCard
      v-for="destination in destinations"
      :key="destination.id"
      :image="destination.image"
      :title="destination.title"
      :description="destination.description"
    />
  </section>
</template>

<script>
import DestinationCard from './DestinationCard.vue';

export default {
  name: 'HomePage',
  components: {
    DestinationCard
  },
  data() {
    return {
      destinations: [
        {
          id: 1,
          image: 'https://youimg1.c-ctrip.com/target/1002090000003p7td5E3D.jpg',
          title: '巴黎',
          description: '巴黎是法国的首都，也是世界上最浪漫的城市之一。'
        },
        {
          id: 2,
          image: 'https://example.com/image2.jpg',
          title: '纽约',
          description: '纽约是美国最大的城市，有许多著名的景点和博物馆。'
        },
        {
          id: 3,
          image: 'https://example.com/image3.jpg',
          title: '东京',
          description: '东京是日本的首都，以其现代化和传统文化相结合而闻名。'
        }
      ]
    };
  }
}
</script>

<style scoped>
.destinations {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
