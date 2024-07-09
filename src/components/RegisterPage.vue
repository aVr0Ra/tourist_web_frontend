<template>
  <div class="auth-page">
    <h2>注册</h2>
    <form @submit.prevent="register">
      <div>
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div>
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div>
        <label for="confirmPassword">确认密码:</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required>
      </div>
      <div>
        <label for="firstName">名字:</label>
        <input type="text" id="firstName" v-model="firstName" required>
      </div>
      <div>
        <label for="lastName">姓氏:</label>
        <input type="text" id="lastName" v-model="lastName" required>
      </div>
      <div>
        <label for="email">电子邮箱:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="userType">用户类型:</label>
        <select id="userType" v-model="userType" required>
          <option value="regular">普通旅客</option>
          <option value="agent">旅行社人员</option>
        </select>
      </div>
      <button type="submit">注册</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegisterPage',
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      email: '',
      userType: 'regular' // 默认选中普通旅客
    };
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        alert('密码不匹配');
        return;
      }

      const payload = {
        user: {
          username: this.username,
          password: this.password,
          password2: this.confirmPassword,
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email
        },
        avatar: null,
        user_type: this.userType
      };

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/register/', payload, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('注册成功:', response.data);
        alert('注册成功，请重新登录');
        this.$router.push('/login');
      } catch (error) {
        if (error.response) {
          console.error('注册失败:', error.response.data);
          alert(`注册失败: ${JSON.stringify(error.response.data)}`);
        } else {
          console.error('注册失败:', error.message);
          alert(`注册失败: ${error.message}`);
        }
      }
    }
  }
}
</script>

<style scoped>
.auth-page {
  max-width: 400px;
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
form input, form select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #42b983;
  color: white;
}
</style>
