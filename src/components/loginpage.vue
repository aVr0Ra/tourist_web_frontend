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
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    login() {
      // 登录逻辑
      console.log('Logging in with', this.username, this.password);
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
