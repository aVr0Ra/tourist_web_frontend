<template>
  <div class="route-details">
    <h1>{{ route.rt_name }}</h1>
    <p><strong>价格:</strong> {{ route.price }}</p>
    <p><strong>简介:</strong> {{ route.rt_brief }}</p>
    <h2>经过景点</h2>
    <div class="attractions-list">
      <span v-for="(attraction, index) in attractions" :key="attraction.id">
        {{ attraction.name }}
        <span v-if="index < attractions.length - 1"> -> </span>
      </span>
    </div>
    <h2>已安排的时间表</h2>
    <ul class="schedule-list">
      <li v-for="schedule in schedules" :key="schedule.id">
        {{ schedule.rq }} - {{ schedule.days }} 天 - 上限 {{ schedule.limit }} 人
        <p><strong>预约用户数:</strong> {{ schedule.reservationCount }}</p>
        <ul v-if="schedule.reservationUsers && schedule.reservationUsers.length">
          <li v-for="user in schedule.reservationUsers" :key="user.id">
            用户ID: {{ user.tr_id }}
          </li>
        </ul>
      </li>
    </ul>
    <button @click="toggleAddDateForm" v-if="!showAddDateForm">添加新日期</button>
    <form @submit.prevent="addRouteDate" v-if="showAddDateForm">
      <div class="form-group">
        <label for="date">开始日期:</label>
        <input type="date" id="date" v-model="date" required>
      </div>
      <div class="form-group">
        <label for="days">持续天数:</label>
        <input type="number" id="days" v-model="days" required>
      </div>
      <div class="form-group">
        <label for="limit">人数上限:</label>
        <input type="number" id="limit" v-model="limit" required>
      </div>
      <button type="submit" class="add-button">提交日期</button>
      <button type="button" @click="toggleAddDateForm" class="cancel-button">取消</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RouteDetails',
  data() {
    return {
      route: null,
      attractions: [],
      schedules: [],
      showAddDateForm: false,
      date: '',
      days: 1,
      limit: 1
    };
  },
  created() {
    this.fetchRouteDetails();
    this.fetchAttractions();
    this.fetchSchedules();
  },
  methods: {
    async fetchRouteDetails() {
      const routeId = this.$route.params.routeId;
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/routes/${routeId}/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        this.route = response.data;
      } catch (error) {
        console.error('获取线路详情失败:', error);
      }
    },
    async fetchAttractions() {
      const routeId = this.$route.params.routeId;
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/rt_at/route/${routeId}/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        this.attractions = response.data;
      } catch (error) {
        console.error('获取线路经过景点失败:', error);
      }
    },
    async fetchSchedules() {
      const routeId = this.$route.params.routeId;
      const token = localStorage.getItem('token');
      try {
        const schedulesResponse = await axios.get(`http://127.0.0.1:8000/api/rt_rq/route/${routeId}/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        const schedules = schedulesResponse.data;

        // Fetch all reservations for all routes
        const reservationsResponse = await axios.get(`http://127.0.0.1:8000/api/reservations/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        const reservations = reservationsResponse.data;

        // Map reservation counts and user information to schedules
        schedules.forEach(schedule => {
          const scheduleReservations = reservations.filter(
            reservation => reservation.rt_rq_id === schedule.id
          );
          schedule.reservationCount = scheduleReservations.length;
          schedule.reservationUsers = scheduleReservations.map(reservation => ({
            tr_id: reservation.tr_id
          }));
        });

        this.schedules = schedules;
      } catch (error) {
        console.error('获取线路时间表失败:', error);
      }
    },
    toggleAddDateForm() {
      this.showAddDateForm = !this.showAddDateForm;
    },
    async addRouteDate() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('请先登录');
        return;
      }

      const routeDate = {
        rt_id: this.route.id,
        rq: this.date,
        days: this.days,
        limit: this.limit
      };

      try {
        await axios.post('http://127.0.0.1:8000/api/rt_rq/', routeDate, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        this.date = '';
        this.days = 1;
        this.limit = 1;
        this.fetchSchedules(); // Refresh schedules after adding
        this.toggleAddDateForm(); // Hide the form after adding
      } catch (error) {
        console.error('添加线路日期失败:', error);
      }
    }
  }
}
</script>

<style scoped>
.route-details {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.attractions-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 5px;
  margin: 20px 0;
}

.schedule-list {
  list-style-type: none;
  padding: 0;
}

.schedule-list li {
  margin: 10px 0;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}

button {
  background-color: #42b983;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
}

button:hover {
  background-color: #368f6a;
}

.add-button {
  margin-bottom: 20px;
}

.cancel-button {
  background-color: #d9534f;
}

.cancel-button:hover {
  background-color: #c9302c;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  background: #f9f9f9;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
}
</style>
