<template>
  <div class="search-results">
    <h1>搜索结果</h1>
    <ul>
      <li v-for="attraction in paginatedAttractions" :key="attraction.id" class="attraction-card">
        <router-link :to="`/attractions/${attraction.id}`" class="attraction-link">
          <div class="attraction-info">
            <h3>{{ attraction.name }}</h3>
            <p>{{ truncateDescription(attraction.description) }}</p>
            <p><strong>地址:</strong> {{ attraction.address }}</p>
          </div>
          <div class="attraction-thumbnail">
            <img :src="attraction.images.length ? attraction.images[0].image : ''" :alt="attraction.name" />
          </div>
        </router-link>
      </li>
    </ul>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
      <span>第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SearchResults',
  data() {
    return {
      attractions: [],
      searchQuery: this.$route.query.q || '',
      currentPage: 1,
      itemsPerPage: 5
    };
  },
  created() {
    this.fetchAttractions();
  },
  methods: {
    async fetchAttractions() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/attractions');
        this.attractions = response.data;
      } catch (error) {
        console.error('获取景点失败:', error);
      }
    },
    truncateDescription(description) {
      return description.length > 100 ? description.substring(0, 100) + '...' : description;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
  computed: {
    filteredAttractions() {
      return this.attractions.filter(attraction =>
        attraction.name.includes(this.searchQuery) || attraction.address.includes(this.searchQuery)
      );
    },
    paginatedAttractions() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredAttractions.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredAttractions.length / this.itemsPerPage);
    }
  },
  watch: {
    '$route.query.q': function(newQuery) {
      this.searchQuery = newQuery;
      this.currentPage = 1; // Reset to the first page for new search
    }
  }
}
</script>

<style scoped>
.search-results {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: left;
}

.search-results ul {
  list-style: none;
  padding: 0;
}

.search-results li {
  background: #f9f9f9;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  height: 150px; /* Ensure equal height for all cards */
}

.attraction-link {
  display: flex;
  align-items: center;
  width: 100%;
  text-decoration: none;
  color: inherit;
}

.attraction-info {
  flex: 1;
}

.attraction-thumbnail {
  width: 150px;
  height: 150px;
  margin-left: 10px;
  overflow: hidden;
}

.attraction-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  padding: 5px 10px;
  font-size: 1em;
}
</style>
