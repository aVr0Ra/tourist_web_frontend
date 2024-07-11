<template>
  <div class="favorites-page">
    <h1>收藏夹</h1>
    <div class="favorites-list">
      <div v-for="favorite in favorites" :key="favorite.attraction.id" class="favorite-item">
        <router-link :to="{ name: 'AttractionDetail', params: { id: favorite.attraction.id } }" class="favorite-link">
          <img :src="favorite.attraction.images.length > 0 ? favorite.attraction.images[0].image : ''" :alt="favorite.attraction.name" class="favorite-image">
          <div class="favorite-details">
            <h2>{{ favorite.attraction.name }}</h2>
            <p>{{ truncateDescription(favorite.attraction.description) }}</p>
          </div>
        </router-link>
        <button @click="removeFavorite(favorite.attraction.id)" class="remove-button">取消收藏</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FavoritesPage',
  data() {
    return {
      favorites: []
    };
  },
  created() {
    this.fetchFavorites();
  },
  methods: {
    async fetchFavorites() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('请先登录');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/favorites/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        const favoriteIds = response.data.map(favorite => favorite.attraction);

        const attractionsResponse = await axios.get('http://127.0.0.1:8000/api/attractions/');
        const attractions = attractionsResponse.data.filter(attraction => favoriteIds.includes(attraction.id));

        this.favorites = attractions.map(attraction => ({ attraction }));
      } catch (error) {
        console.error('获取收藏夹失败:', error);
      }
    },
    async removeFavorite(attractionId) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('请先登录');
        return;
      }

      try {
        await axios.delete(`http://127.0.0.1:8000/api/favorites/${attractionId}/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        this.favorites = this.favorites.filter(favorite => favorite.attraction.id !== attractionId);
      } catch (error) {
        console.error('删除收藏失败:', error);
      }
    },
    truncateDescription(description) {
      const maxLength = 100; // 设置描述的最大长度
      if (description.length > maxLength) {
        return description.slice(0, maxLength) + '...';
      }
      return description;
    }
  }
}
</script>

<style scoped>
.favorites-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.favorite-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
}
.favorite-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}
.favorite-image {
  width: 150px;
  height: auto;
  margin-right: 20px;
}
.favorite-details {
  flex: 1;
}
.favorite-details h2 {
  margin: 0;
  font-size: 1.2em;
}
.favorite-details p {
  margin: 10px 0 0;
}
.remove-button {
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  height: 100%;
}
.remove-button:hover {
  background-color: #c9302c;
}
</style>
