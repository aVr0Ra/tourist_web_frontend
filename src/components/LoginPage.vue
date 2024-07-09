<template>
  <div class="auth-page">
    <h2>登录</h2>
    <form @submit.prevent="login">
      <div>
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div>
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">登录</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async login() {
      const payload = {
        username: this.username,
        password: this.password
      };

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/login/', payload, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('登录成功:', response.data);
        // 保存 token 到本地存储，或者 Vuex 状态管理
        localStorage.setItem('token', response.data.token);
        // 跳转到主页或其他受保护的页面
        this.$router.push('/');
      } catch (error) {
        if (error.response) {
          console.error('登录失败:', error.response.data);
          // 显示错误消息
          alert(`登录失败: ${JSON.stringify(error.response.data)}`);
        } else {
          console.error('登录失败:', error.message);
          alert(`登录失败: ${error.message}`);
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
}
button:hover {
  background-color: #42b983;
  color: white;
}
</style>
