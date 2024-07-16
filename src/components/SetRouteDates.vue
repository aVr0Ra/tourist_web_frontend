<template>
  <div class="set-route-dates">
    <h1>设置线路时间</h1>
    <form @submit.prevent="addOrUpdateRouteDate">
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
      <button type="submit" class="add-button">{{ isEditing ? '修改时间' : '添加时间' }}</button>
      <button v-if="isEditing" @click="cancelEdit" class="cancel-button">取消修改</button>
    </form>
    <ul class="route-dates-list">
      <li v-for="(routeDate, index) in routeDates" :key="index">
        {{ routeDate.rq }} - {{ routeDate.days }} 天 - 上限 {{ routeDate.limit }} 人
        <button @click="editRouteDate(index)">修改</button>
        <button @click="deleteRouteDate(index)">删除</button>
      </li>
    </ul>
    <button @click="submitRouteDates" class="submit-button">提交线路时间</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SetRouteDates',
  data() {
    return {
      routeId: null,
      date: '',
      days: 1,
      limit: 1,
      routeDates: [],
      isEditing: false,
      editingIndex: null
    };
  },
  created() {
    this.routeId = this.$route.params.routeId;
  },
  methods: {
    addOrUpdateRouteDate() {
      if (this.date && this.days > 0 && this.limit > 0) {
        const routeDate = { rq: this.date, days: this.days, limit: this.limit };
        if (this.isEditing) {
          this.routeDates.splice(this.editingIndex, 1, routeDate);
          this.isEditing = false;
          this.editingIndex = null;
        } else {
          this.routeDates.push(routeDate);
        }
        this.date = '';
        this.days = 1;
        this.limit = 1;
      } else {
        alert('请填写有效的时间、天数和人数上限');
      }
    },
    editRouteDate(index) {
      const routeDate = this.routeDates[index];
      this.date = routeDate.rq;
      this.days = routeDate.days;
      this.limit = routeDate.limit;
      this.isEditing = true;
      this.editingIndex = index;
    },
    cancelEdit() {
      this.isEditing = false;
      this.editingIndex = null;
      this.date = '';
      this.days = 1;
      this.limit = 1;
    },
    deleteRouteDate(index) {
      this.routeDates.splice(index, 1);
    },
    async submitRouteDates() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('请先登录');
        return;
      }

      try {
        for (const routeDate of this.routeDates) {
          await axios.post('http://127.0.0.1:8000/api/rt_rq/', {
            rt_id: this.routeId,
            rq: routeDate.rq,
            days: routeDate.days,
            limit: routeDate.limit
          }, {
            headers: {
              'Authorization': `Token ${token}`
            }
          });
        }
        alert('线路时间提交成功');
        this.$router.push('/');
      } catch (error) {
        console.error('提交线路时间失败:', error);
        alert('提交线路时间失败');
      }
    }
  }
}
</script>

<style scoped>
.set-route-dates {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
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
}

button:hover {
  background-color: #368f6a;
}

.add-button, .cancel-button {
  margin-bottom: 20px;
  margin-right: 10px;
}

.submit-button {
  margin-top: 20px;
  width: 100%;
}

.route-dates-list {
  list-style: none;
  padding: 0;
}

.route-dates-list li {
  background: #f9f9f9;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.route-dates-list button {
  margin-left: 10px;
}
</style>
