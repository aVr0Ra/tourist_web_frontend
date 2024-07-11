<template>
  <div class="frequent-travelers-page">
    <h2>常用联系人</h2>
    <div v-if="travelers.length === 0">
      <button @click="showAddForm = true">添加联系人</button>
    </div>
    <div v-else>
      <ul>
        <li v-for="traveler in travelers" :key="traveler.id" class="traveler-item">
          {{ traveler.name }}--{{ traveler.gender }}--{{ traveler.nationality }}--{{ traveler.id_type }}
          <button @click="editTraveler(traveler)">修改</button>
          <button @click="deleteTraveler(traveler.id)">删除</button>
        </li>
      </ul>
      <button @click="showAddForm = true">添加联系人</button>
    </div>
    <div v-if="showAddForm || isEditing">
      <h3>{{ isEditing ? '修改联系人' : '添加联系人' }}</h3>
      <form @submit.prevent="saveTraveler">
        <div>
          <label for="name">姓名:</label>
          <input type="text" id="name" v-model="traveler.name" required>
        </div>
        <div>
          <label for="phone_number">电话号码:</label>
          <input type="text" id="phone_number" v-model="traveler.phone_number" required>
        </div>
        <div>
          <label for="id_type">证件类型:</label>
          <input type="text" id="id_type" v-model="traveler.id_type" required>
        </div>
        <div>
          <label for="id_number">证件号码:</label>
          <input type="text" id="id_number" v-model="traveler.id_number" required>
        </div>
        <div>
          <label for="nationality">国籍:</label>
          <input type="text" id="nationality" v-model="traveler.nationality" required>
        </div>
        <div>
          <label for="gender">性别:</label>
          <input type="text" id="gender" v-model="traveler.gender" required>
        </div>
        <button type="submit">{{ isEditing ? '更新联系人' : '添加联系人' }}</button>
        <button type="button" @click="cancelEdit">取消</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FrequentTravelersPage',
  data() {
    return {
      travelers: [],
      traveler: {
        name: '',
        phone_number: '',
        id_type: '',
        id_number: '',
        nationality: '',
        gender: ''
      },
      isEditing: false,
      editingId: null,
      showAddForm: false
    };
  },
  created() {
    this.fetchTravelers();
  },
  methods: {
    async fetchTravelers() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/frequent_travelers/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        this.travelers = response.data;
      } catch (error) {
        console.error('获取常用联系人失败:', error);
      }
    },
    async saveTraveler() {
      const token = localStorage.getItem('token');
      const url = this.isEditing
        ? `http://127.0.0.1:8000/api/frequent_travelers/${this.editingId}/`
        : 'http://127.0.0.1:8000/api/frequent_travelers/';
      const method = this.isEditing ? 'put' : 'post';
      try {
        await axios({
          method,
          url,
          data: this.traveler,
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        this.resetForm();
        this.fetchTravelers();
      } catch (error) {
        console.error(`${this.isEditing ? '更新' : '添加'}联系人失败:`, error);
      }
    },
    editTraveler(traveler) {
      this.traveler = { ...traveler };
      this.isEditing = true;
      this.editingId = traveler.id;
      this.showAddForm = true;
    },
    async deleteTraveler(id) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://127.0.0.1:8000/api/frequent_travelers/${id}/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        this.fetchTravelers();
      } catch (error) {
        console.error('删除联系人失败:', error);
      }
    },
    resetForm() {
      this.traveler = {
        name: '',
        phone_number: '',
        id_type: '',
        id_number: '',
        nationality: '',
        gender: ''
      };
      this.isEditing = false;
      this.editingId = null;
      this.showAddForm = false;
    },
    cancelEdit() {
      this.resetForm();
    }
  }
}
</script>

<style scoped>
.frequent-travelers-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

form div {
  margin-bottom: 15px;
}

form label {
  display: block;
  margin-bottom: 5px;
}

form input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

button:hover {
  background-color: #42b983;
  color: white;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: #f9f9f9;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.traveler-item button {
  margin-left: 10px;
}
</style>
