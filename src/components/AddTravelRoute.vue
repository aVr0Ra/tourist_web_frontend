<template>
  <div class="add-travel-route">
    <h1>添加旅游线路</h1>
    <form @submit.prevent="submitRoute">
      <div class="form-group">
        <label for="routeName">线路名称:</label>
        <input id="routeName" v-model="routeName" required>
      </div>
      <div class="form-group">
        <label for="agency">选择旅行公司:</label>
        <select id="agency" v-model="selectedAgencyId" required>
          <option v-for="agency in agencies" :value="agency.id" :key="agency.id">
            {{ agency.ag_name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="price">价格:</label>
        <input type="number" id="price" v-model="price" required>
      </div>
      <div class="form-group">
        <label for="description">线路简介:</label>
        <textarea id="description" v-model="routeDescription" required></textarea>
      </div>
      <button type="submit" class="submit-button">提交线路</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AddTravelRoute',
  data() {
    return {
      routeName: '',
      selectedAgencyId: null,
      price: 0,
      routeDescription: '',
      agencies: []
    };
  },
  created() {
    this.fetchAgencies();
  },
  methods: {
    async fetchAgencies() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('请先登录');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/agencies/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        this.agencies = response.data;
      } catch (error) {
        console.error('获取旅行公司信息失败:', error);
      }
    },
    async submitRoute() {
      console.log('提交线路方法被调用');
      const token = localStorage.getItem('token');
      if (!token) {
        alert('请先登录');
        return;
      }

      const routeData = {
        rt_name: this.routeName,
        ag_id: this.selectedAgencyId,
        price: this.price,
        rt_brief: this.routeDescription
      };

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/routes/', routeData, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        console.log('线路提交成功:', response.data);
        const routeId = response.data.id;
        this.$router.push({ name: 'SetRouteAttractions', params: { routeId } });
      } catch (error) {
        console.error('提交线路失败:', error);
        alert('添加线路失败.');
      }
    }
  }
}
</script>

<style scoped>
.add-travel-route {
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

.form-group input,
.form-group select,
.form-group textarea {
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

.submit-button {
  margin-top: 20px;
  width: 100%;
}
</style>
