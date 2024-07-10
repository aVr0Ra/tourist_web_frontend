<template>
  <div class="profile-page">
    <h2>个人资料</h2>
    <form @submit.prevent="updateProfile">
      <div>
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="profile.user.username" disabled>
      </div>
      <div>
        <label for="first_name">名字:</label>
        <input type="text" id="first_name" v-model="profile.user.first_name">
      </div>
      <div>
        <label for="last_name">姓氏:</label>
        <input type="text" id="last_name" v-model="profile.user.last_name">
      </div>
      <div>
        <label for="email">电子邮箱:</label>
        <input type="email" id="email" v-model="profile.user.email">
      </div>
      <div>
        <label for="avatar">头像:</label>
        <img :src="fullAvatarUrl" alt="Avatar" v-if="profile.avatar" class="avatar-image">
        <input type="file" id="avatar" @change="handleAvatarUpload">
      </div>
      <h3>修改密码</h3>
      <div>
        <label for="old_password">旧密码:</label>
        <input type="password" id="old_password" v-model="oldPassword">
      </div>
      <div>
        <label for="password">新密码:</label>
        <input type="password" id="password" v-model="newPassword">
      </div>
      <div>
        <label for="password1">确认新密码:</label>
        <input type="password" id="password1" v-model="confirmPassword">
      </div>
      <button type="submit">更新资料</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProfilePage',
  data() {
    return {
      profile: {
        user: {
          username: '',
          first_name: '',
          last_name: '',
          email: ''
        },
        avatar: ''
      },
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      newAvatarFile: null
    };
  },
  computed: {
    fullAvatarUrl() {
      return this.profile.avatar ? `http://127.0.0.1:8000${this.profile.avatar}` : '';
    }
  },
  created() {
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        this.profile = response.data;
      } catch (error) {
        console.error('获取个人资料失败:', error);
      }
    },
    handleAvatarUpload(event) {
      const file = event.target.files[0];
      this.newAvatarFile = file;
    },
    async updateProfile() {
      const token = localStorage.getItem('token');

      // Prepare the JSON payload
      const payload = {
        user: {
          first_name: this.profile.user.first_name,
          last_name: this.profile.user.last_name,
          email: this.profile.user.email
        }
      };

      if (this.oldPassword && this.newPassword && this.confirmPassword) {
        if (this.newPassword !== this.confirmPassword) {
          alert('新密码不匹配');
          return;
        }
        payload.user.old_password = this.oldPassword;
        payload.user.password = this.newPassword;
        payload.user.password1 = this.confirmPassword;
      }

      try {
        // Update user information
        await axios.put('http://127.0.0.1:8000/api/profile/', payload, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Update avatar if a new file is uploaded
        if (this.newAvatarFile) {
          const formData = new FormData();
          formData.append('avatar', this.newAvatarFile);

          await axios.put('http://127.0.0.1:8000/api/profile/', formData, {
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        }

        alert('个人资料更新成功');
        this.fetchProfile(); // 重新获取资料
      } catch (error) {
        console.error('更新个人资料失败:', error);
      }
    }
  }
}
</script>

<style scoped>
.profile-page {
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

.avatar-image {
  display: block;
  margin-bottom: 15px;
  max-width: 100px;
  height: auto;
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

h3 {
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 1.5em; /* 确保字体大小一致 */
}
</style>
