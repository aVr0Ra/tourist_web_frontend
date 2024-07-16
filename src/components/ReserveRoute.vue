<template>
  <div class="reserve-route">
    <h1>确认预约</h1>
    <div v-if="user">
      <p><strong>用户名:</strong> {{ user.username }}</p>
      <p><strong>线路名称:</strong> {{ route.rt_name }}</p>
      <p><strong>线路简介:</strong> {{ route.rt_brief }}</p>
      <p><strong>价格:</strong> {{ route.price }}</p>
      <p><strong>开始日期:</strong> {{ schedule.rq }}</p>
      <button @click="confirmReservation">确认预约</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ReserveRoute',
  data() {
    return {
      user: null,
      route: null,
      schedule: null
    };
  },
  created() {
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        this.user = response.data.user;
        if (response.data.user_type !== 'regular') {
          alert('只有普通用户可以预约路线');
          this.$router.push('/');
        } else {
          this.fetchRouteDetails();
          this.fetchScheduleDetails();
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        this.$router.push('/login');
      }
    },
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
    async fetchScheduleDetails() {
      const scheduleId = this.$route.params.scheduleId;
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/rt_rq/${scheduleId}/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        this.schedule = response.data;
      } catch (error) {
        console.error('获取线路时间详情失败:', error);
      }
    },
    async confirmReservation() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('请先登录');
        return;
      }

      const reservationData = {
        rv_date: new Date().toISOString().split('T')[0],
        tr_id: this.user.id,
        rt_rq_id: this.schedule.id,
        status: true
      };

      try {
        await axios.post('http://127.0.0.1:8000/api/reservations/', reservationData, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        alert('预约成功');
        this.$router.push('/');
      } catch (error) {
        console.error('预约失败:', error);
        alert('预约失败');
      }
    }
  }
}
</script>

<style scoped>
.reserve-route {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.reserve-route p {
  text-align: left;
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
</style>
