<template>
  <div v-if="isLoggedIn" class="attraction-detail">
    <h1>{{ attraction.name }}</h1>
    <img :src="attraction.images[0].image" :alt="attraction.name" class="attraction-image">
    <p><strong>星级:</strong> {{ attraction.star_level }}</p>
    <p><strong>评分:</strong> {{ attraction.rating }}</p>
    <p><strong>描述:</strong> {{ attraction.description }}</p>
    <p><strong>开放时间:</strong> {{ attraction.opening_hours }}</p>
    <p><strong>地址:</strong> {{ attraction.address }}</p>
    <p><strong>联系电话:</strong> {{ attraction.official_phone }}</p>
    <p><strong>人气:</strong> {{ attraction.popularity }}</p>
    <p><strong>评论数:</strong> {{ attraction.comment_count }}</p>

    <div class="comments">
      <h2>评论区</h2>
      <div class="new-comment">
        <textarea v-model="newCommentText" placeholder="发表评论"></textarea>
        <div>
          <label for="rating">评分: {{ newRating }}</label>
          <input type="range" id="rating" v-model="newRating" min="0.0" max="9.9" step="0.1">
        </div>
        <input type="file" @change="handleImageUpload" multiple>
        <button @click="confirmSubmitComment">提交评论</button>
      </div>
      <ul>
        <li v-for="comment in paginatedComments" :key="comment.id">
          <p class="comment-rating">{{ comment.rating }}/10分</p>
          <p class="comment-text">{{ comment.comment_text }}</p>
          <img v-if="comment.images.length" :src="comment.images[0].image_url" :alt="comment.comment_text" class="comment-image">
          <p class="comment-date">发表于: {{ new Date(comment.created_at).toLocaleString() }}</p>
        </li>
      </ul>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
        <span>第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
      </div>
    </div>
  </div>
  <div v-else>
    <p>请先登录后查看景点详细信息。</p>
    <router-link to="/login">登录</router-link>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AttractionDetail',
  data() {
    return {
      attraction: null,
      comments: [],
      newCommentText: '',
      newRating: 5.0,
      newImages: [],
      currentPage: 1,
      commentsPerPage: 10,
      isLoggedIn: !!localStorage.getItem('token')
    };
  },
  created() {
    if (this.isLoggedIn) {
      this.fetchAttractionDetails();
      this.fetchComments();
    }
  },
  methods: {
    async fetchAttractionDetails() {
      const attractionId = this.$route.params.id;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/attractions/${attractionId}`);
        this.attraction = response.data;
      } catch (error) {
        console.error('获取景点详情失败:', error);
      }
    },
    async fetchComments() {
      const attractionId = this.$route.params.id;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/attractions/${attractionId}/comments`);
        this.comments = response.data;
      } catch (error) {
        console.error('获取评论失败:', error);
      }
    },
    handleImageUpload(event) {
      this.newImages = Array.from(event.target.files);
    },
    confirmSubmitComment() {
      const confirmed = window.confirm('确认提交吗？提交之后的评论将匿名且不可修改！');
      if (confirmed) {
        this.postComment();
      }
    },
    async postComment() {
      const token = localStorage.getItem('token');
      if (!this.newCommentText || !this.newRating || !token) {
        alert('请填写所有字段并确保已登录');
        return;
      }

      const formData = new FormData();
      formData.append('attraction', this.$route.params.id);
      formData.append('comment_text', this.newCommentText);
      formData.append('rating', this.newRating);
      formData.append('is_featured', false);
      this.newImages.forEach(image => {
        formData.append('images', image);
      });

      try {
        await axios.post('http://127.0.0.1:8000/api/comments', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Token ${token}`
          }
        });
        this.newCommentText = '';
        this.newRating = 5.0;
        this.newImages = [];
        this.$router.go(0);  // 刷新页面
      } catch (error) {
        console.error('发表评论失败:', error.response.data);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
  computed: {
    paginatedComments() {
      const start = (this.currentPage - 1) * this.commentsPerPage;
      const end = start + this.commentsPerPage;
      return this.comments.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.comments.length / this.commentsPerPage);
    }
  }
}
</script>

<style scoped>
.attraction-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: left;
}
.attraction-image {
  width: 100%;
  height: auto;
}
.comments {
  margin-top: 20px;
}
.new-comment {
  margin-bottom: 20px;
}
.new-comment textarea {
  width: 100%;
  height: 100px;
}
.new-comment input[type="range"] {
  width: 100%;
  margin-top: 10px;
}
.new-comment input[type="file"] {
  margin-top: 10px;
}
.new-comment button {
  margin-top: 10px;
}
.comments ul {
  list-style: none;
  padding: 0;
}
.comments li {
  background: #f9f9f9;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}
.comment-rating {
  font-size: 1.2em;
  font-weight: bold;
}
.comment-text {
  font-size: 1em;
}
.comment-image {
  width: 200px; /* 确保图片大小 */
  height: auto;
  margin-top: 10px;
}
.comment-date {
  font-size: 0.8em;
  color: #777;
}
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.pagination button {
  padding: 5px 10px;
  font-size: 1em;
}
</style>