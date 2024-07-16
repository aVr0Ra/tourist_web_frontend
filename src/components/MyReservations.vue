<template>
  <div class="my-reservations">
    <h1>我的预约</h1>
    <div v-for="reservation in paginatedReservations" :key="reservation.id" class="reservation-card">
      <p><strong>预约日期:</strong> {{ reservation.rv_date }}</p>
      <p><strong>线路名称:</strong> {{ reservation.route.rt_name }}</p>
      <p><strong>线路简介:</strong> {{ reservation.route.rt_brief }}</p>
      <p><strong>开始日期:</strong> {{ reservation.schedule.rq }}</p>
      <p><strong>持续天数:</strong> {{ reservation.schedule.days }}</p>
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
  name: 'MyReservations',
  data() {
    return {
      reservations: [],
      currentPage: 1,
      reservationsPerPage: 5
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.reservations.length / this.reservationsPerPage);
    },
    paginatedReservations() {
      const start = (this.currentPage - 1) * this.reservationsPerPage;
      const end = start + this.reservationsPerPage;
      return this.reservations.slice(start, end);
    }
  },
  created() {
    this.fetchReservations();
  },
  methods: {
    async fetchReservations() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('请先登录');
        return;
      }

      try {
        const profileResponse = await axios.get('http://127.0.0.1:8000/api/profile/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        const userId = profileResponse.data.user.id;

        const reservationsResponse = await axios.get(`http://127.0.0.1:8000/api/reservations/tourist/${userId}/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        const routesResponse = await axios.get('http://127.0.0.1:8000/api/routes/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        const schedulesResponse = await axios.get('http://127.0.0.1:8000/api/rt_rq/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        const routes = routesResponse.data.reduce((acc, route) => {
          acc[route.id] = route;
          return acc;
        }, {});

        const schedules = schedulesResponse.data.reduce((acc, schedule) => {
          acc[schedule.id] = schedule;
          return acc;
        }, {});

        const reservations = reservationsResponse.data.map(reservation => {
          const route = routes[schedules[reservation.rt_rq_id].rt_id];
          const schedule = schedules[reservation.rt_rq_id];
          return {
            ...reservation,
            route,
            schedule
          };
        });

        this.reservations = reservations;
      } catch (error) {
        console.error('获取预约信息失败:', error);
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
    }
  }
}
</script>

<style scoped>
.my-reservations {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.reservation-card {
  background: #f9f9f9;
  margin: 20px 0;
  padding: 20px;
  border-radius: 5px;
  text-align: left;
}

.reservation-card p {
  margin: 10px 0;
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
