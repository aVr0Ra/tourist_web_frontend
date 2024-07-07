<template>
  <div id="app">
    <header>
      <h1>旅游网站</h1>
      <div class="auth-buttons" v-if="showAuthButtons">
        <router-link to="/login">
          <button>登录</button>
        </router-link>
        <router-link to="/register">
          <button>注册</button>
        </router-link>
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
  computed: {
    showAuthButtons() {
      return this.$route.path === '/';
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
