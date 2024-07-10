<template>
  <div id="app">
    <nav>
      <div class="logo" @click="goHome">
        旅游网站
      </div>
      <div class="auth">
        <div v-if="!isLoggedIn">
          <router-link to="/login">登录</router-link>
          <router-link to="/register">注册</router-link>
        </div>
        <div v-else>
          <button @click="logout">注销</button>
        </div>
      </div>
    </nav>
    <div v-if="showSearchBar" class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="搜索景点..." @keyup.enter="searchAttractions">
    </div>
    <router-view @login="updateAuthStatus"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      isLoggedIn: !!localStorage.getItem('token')
    };
  },
  computed: {
    showSearchBar() {
      return this.$route.path !== '/login' && this.$route.path !== '/register';
    }
  },
  methods: {
    goHome() {
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.$router.push('/').catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    },
    searchAttractions() {
      this.$router.push({ name: 'SearchResults', query: { q: this.searchQuery } });
    },
    updateAuthStatus() {
      this.isLoggedIn = !!localStorage.getItem('token');
    }
  }
}
</script>

<style>
#app nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px; /* 增加纵向长度 */
  background-color: #42b983;
  color: white;
}

#app nav .logo {
  flex: 1;
  font-size: 2em; /* 增加字号 */
  cursor: pointer;
}

#app nav .auth {
  display: flex;
  gap: 10px;
}

#app nav a, #app nav button {
  color: white;
  text-decoration: none;
  margin-left: 10px;
  padding: 5px 10px;
  border: 1px solid white;
  border-radius: 5px;
  background-color: #42b983;
  cursor: pointer;
}

#app nav a:hover, #app nav button:hover {
  background-color: white;
  color: #42b983;
}

.search-bar {
  display: flex;
  justify-content: center;
  padding: 10px;
  background-color: #f5f5f5;
}

.search-bar input {
  width: 50%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
