<template>
  <div id="app">
    <nav>
      <div class="navbar">
        <router-link to="/" class="site-title">旅游网站</router-link>
        <div v-if="isLoggedIn" class="user-menu" @mouseleave="showDropdown = false">
          <img :src="fullAvatarUrl" alt="Avatar" class="avatar" @mouseover="showDropdown = true" @click="toggleDropdown">
          <div v-if="showDropdown" class="dropdown">
            <router-link to="/profile" @click.native="hideDropdown">编辑个人资料</router-link>
            <router-link to="/frequent-travelers" @click.native="hideDropdown">添加/修改常用联系人</router-link>
            <router-link to="/favorites" @click.native="hideDropdown">收藏夹</router-link>
            <button @click="logout">注销</button>
          </div>
        </div>
        <div v-else class="auth-buttons">
          <router-link to="/login" class="btn">登录</router-link>
          <router-link to="/register" class="btn">注册</router-link>
        </div>
      </div>
      <div v-if="showSearchBar" class="search-bar">
        <input v-model="searchQuery" @keyup.enter="searchAttractions" placeholder="搜索景点...">
        <button @click="searchAttractions">搜索</button>
      </div>
    </nav>
    <router-view @login="handleLogin"/>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isLoggedIn: false,
      showDropdown: false,
      avatar: '',
      searchQuery: ''
    };
  },
  computed: {
    fullAvatarUrl() {
      return this.avatar ? `http://127.0.0.1:8000${this.avatar}` : '';
    },
    showSearchBar() {
      const hidePaths = ['/login', '/register', '/profile', '/frequent-travelers'];
      return !hidePaths.includes(this.$route.path);
    }
  },
  created() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn = true;
        this.fetchProfile();
      }
    },
    async fetchProfile() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        this.avatar = response.data.avatar;
      } catch (error) {
        console.error('获取个人资料失败:', error);
      }
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    hideDropdown() {
      this.showDropdown = false;
    },
    handleLogin() {
      this.isLoggedIn = true;
      this.fetchProfile();
    },
    logout() {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
    },
    searchAttractions() {
      const query = this.searchQuery;
      this.$router.push({ name: 'SearchResults', query: { q: query } }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #42b983; /* 绿色背景 */
}

.site-title {
  font-size: 2em;
  color: white; /* 白色字体 */
  text-decoration: none;
}

.user-menu {
  position: relative;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  padding: 10px;
  white-space: nowrap; /* 保持选项在一行 */
}

.dropdown a,
.dropdown button {
  display: block;
  padding: 10px;
  text-decoration: none;
  color: black;
}

.dropdown button {
  border: none;
  background: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.dropdown a:hover,
.dropdown button:hover {
  background-color: #f0f0f0;
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.auth-buttons .btn {
  padding: 10px 20px;
  background-color: white;
  color: #42b983;
  border: 1px solid #42b983;
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
}

.auth-buttons .btn:hover {
  background-color: #42b983;
  color: white;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.search-bar input {
  width: 300px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px 0 0 5px;
}

.search-bar button {
  padding: 10px;
  border: none;
  background-color: #42b983;
  color: white;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
}

.search-bar button:hover {
  background-color: #359a6d;
}
</style>
