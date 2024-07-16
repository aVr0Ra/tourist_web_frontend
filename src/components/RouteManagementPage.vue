<template>
  <div class="route-management-page">
    <h1>线路管理</h1>
    <div class="route-list">
      <div v-for="route in paginatedRoutes" :key="route.id" class="route-item" @click="goToRouteDetails(route.id)">
        <h2>{{ route.rt_name }}</h2>
        <p>{{ route.rt_brief }}</p>
        <div v-if="route.attractions && route.attractions.length">
          <div class="attractions-list">
            <strong>经过景点:</strong>
            <span v-for="(attraction, index) in route.attractions" :key="attraction.id">
              {{ attraction.name }}
              <span v-if="index < route.attractions.length - 1"> -> </span>
            </span>
          </div>
        </div>
      </div>
    </div>
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
  name: 'RouteManagementPage',
  data() {
    return {
      routes: [],
      currentPage: 1,
      routesPerPage: 5
    };
  },
  created() {
    this.fetchRoutes();
  },
  methods: {
    async fetchRoutes() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/routes/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        const routes = response.data;

        // Fetch attractions for each route
        for (const route of routes) {
          const attractionsResponse = await axios.get(`http://127.0.0.1:8000/api/rt_at/route/${route.id}/`, {
            headers: {
              'Authorization': `Token ${token}`
            }
          });
          route.attractions = attractionsResponse.data;
        }

        this.routes = routes;
      } catch (error) {
        console.error('获取线路信息失败:', error);
      }
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
    },
    goToRouteDetails(routeId) {
      this.$router.push({ name: 'RouteDetails', params: { routeId } });
    }
  },
  computed: {
    paginatedRoutes() {
      const start = (this.currentPage - 1) * this.routesPerPage;
      const end = start + this.routesPerPage;
      return this.routes.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.routes.length / this.routesPerPage);
    }
  }
}
</script>

<style scoped>
.route-management-page {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.route-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.route-item {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  cursor: pointer;
}

.attractions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.pagination button:hover {
  background-color: #368f6a;
}

.pagination span {
  font-size: 16px;
}
</style>
