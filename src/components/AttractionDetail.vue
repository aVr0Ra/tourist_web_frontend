<template>
  <div class="attraction-detail">
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
      <textarea v-model="newComment" placeholder="发表评论"></textarea>
      <button @click="postComment">提交评论</button>
      <ul>
        <li v-for="comment in comments" :key="comment.id">{{ comment.text }}</li>
      </ul>
    </div>
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
      newComment: ''
    };
  },
  created() {
    this.fetchAttractionDetails();
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
    async postComment() {
      if (!this.newComment) {
        return;
      }
      // 这里应该添加调用发表评论API的代码
      // 例如：
      // const response = await axios.post(`http://127.0.0.1:8000/api/attractions/${this.$route.params.id}/comments`, { text: this.newComment });
      // this.comments.push(response.data);
      this.comments.push({ id: this.comments.length + 1, text: this.newComment });
      this.newComment = '';
    }
  }
}
</script>

<style scoped>
.attraction-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.attraction-image {
  width: 100%;
  height: auto;
}
.comments {
  margin-top: 20px;
}
.comments textarea {
  width: 100%;
  height: 100px;
}
.comments button {
  margin-top: 10px;
}
.comments ul {
  list-style: none;
  padding: 0;
}
.comments li {
  background: #f9f9f9;
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
}
</style>
