<template>
  <div id="app">
    <header>
      <h1 @click="navigateTo('/')">旅游网站</h1>
      <div class="auth-buttons" v-if="showAuthButtons">
        <button v-if="!isLoggedIn" @click="navigateTo('/login')">登录</button>
        <button v-if="!isLoggedIn" @click="navigateTo('/register')">注册</button>
        <button v-if="isLoggedIn" @click="logout">注销</button>
      </div>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false
    };
  },
  created() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;
    },
    navigateTo(route) {
      if (this.$route.path !== route) {
        this.$router.push(route);
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.$router.push('/login');
    }
  },
  computed: {
    showAuthButtons() {
      return !['/login', '/register'].includes(this.$route.path);
    }
  },
  watch: {
    $route() {
      this.checkLoginStatus();
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
header {
  background-color: #42b983;
  padding: 20px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
header h1 {
  cursor: pointer;
}
.auth-buttons {
  display: flex;
  gap: 10px;
}
.auth-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.auth-buttons button:hover {
  background-color: #2c3e50;
  color: white;
}
</style>
