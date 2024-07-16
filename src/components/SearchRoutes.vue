<template>
  <div class="search-routes">
    <h1>搜索路线</h1>
    <div class="search-section">
      <input v-model="searchQuery" @keyup.enter="searchRoutes" placeholder="搜索路线...">
      <div class="date-range">
        <label for="start-date" class="date-label">路线开始日期:</label>
        <input type="date" id="start-date" v-model="startDate">
        <span>~</span>
        <input type="date" id="end-date" v-model="endDate">
      </div>
      <button @click="searchRoutes">搜索</button>
    </div>
    <div class="routes-list">
      <div v-for="route in filteredRoutes" :key="route.id" class="route-card">
        <h2>{{ route.rt_name }}</h2>
        <p>{{ route.rt_brief }}</p>
        <p>价格: {{ route.price }}</p>
        <div class="attractions">
          <p>经过景点:</p>
          <ul>
            <li v-for="attraction in route.attractions" :key="attraction.id">
              {{ attraction.name }} ({{ attraction.address }})
            </li>
          </ul>
        </div>
        <div class="schedules">
          <p>安排时间:</p>
          <ul>
            <li v-for="schedule in route.schedules" :key="schedule.id">
              {{ schedule.rq }} - {{ schedule.days }} 天 - 上限 {{ schedule.limit }} 人
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SearchRoutes',
  data() {
    return {
      searchQuery: '',
      startDate: '',
      endDate: '',
      routes: []
    };
  },
  methods: {
    async searchRoutes() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('请先登录');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/routes/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        const routes = await Promise.all(response.data.map(async (route) => {
          const attractionsResponse = await axios.get(`http://127.0.0.1:8000/api/rt_at/route/${route.id}/`, {
            headers: {
              'Authorization': `Token ${token}`
            }
          });

          const schedulesResponse = await axios.get(`http://127.0.0.1:8000/api/rt_rq/route/${route.id}/`, {
            headers: {
              'Authorization': `Token ${token}`
            }
          });

          return {
            ...route,
            attractions: attractionsResponse.data,
            schedules: schedulesResponse.data
          };
        }));

        this.routes = routes;
      } catch (error) {
        console.error('搜索路线失败:', error);
      }
    }
  },
  computed: {
    filteredRoutes() {
      return this.routes.filter(route => {
        const matchesQuery = route.rt_name.includes(this.searchQuery) || route.rt_brief.includes(this.searchQuery) ||
          route.attractions.some(attraction => attraction.name.includes(this.searchQuery) || attraction.address.includes(this.searchQuery));
        
        const matchesDateRange = route.schedules.some(schedule => {
          const startDate = new Date(this.startDate);
          const endDate = new Date(this.endDate);
          const scheduleDate = new Date(schedule.rq);
          return (!this.startDate || scheduleDate >= startDate) && (!this.endDate || scheduleDate <= endDate);
        });

        return matchesQuery && matchesDateRange;
      });
    }
  }
}
</script>

<style scoped>
.search-routes {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.search-section {
  margin-bottom: 20px;
}

.search-section input {
  width: 300px;
  padding: 10px;
  margin-right: 10px;
}

.date-range {
  margin: 10px 0;
  display: flex;
  align-items: center;
}

.date-range .date-label {
  margin-right: 10px;
  white-space: nowrap;
}

.date-range span {
  margin: 0 10px;
}

button {
  background-color: #42b983;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #368f6a;
}

.routes-list {
  margin-top: 20px;
}

.route-card {
  background: #f9f9f9;
  margin: 20px 0;
  padding: 20px;
  border-radius: 5px;
  text-align: left;
}

.attractions ul,
.schedules ul {
  list-style-type: none;
  padding: 0;
}

.attractions li,
.schedules li {
  margin: 5px 0;
}
</style>
