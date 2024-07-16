<template>
  <div class="set-route-attractions">
    <h1>设置线路景点</h1>
    <div class="route-plan">
      <div class="route-step">
        <span>线路开始</span>
      </div>
      <div v-for="(step, index) in routeSteps" :key="index" class="route-step">
        <span>{{ step.name }}</span>
        <button @click="removeStep(index)">删除</button>
      </div>
      <div class="route-step">
        <button @click="addStep">添加景点</button>
      </div>
    </div>

    <div v-if="showSearch" class="search-section">
      <h2>搜索景点</h2>
      <input v-model="searchQuery" @keyup.enter="searchAttractions" placeholder="搜索景点...">
      <button @click="searchAttractions">搜索</button>
      <button @click="cancelSearch">取消搜索</button>
      <ul v-if="searchResults.length">
        <li v-for="attraction in searchResults" :key="attraction.id">
          <span>{{ attraction.name }}</span>
          <button @click="addAttractionToRoute(attraction)">添加到线路</button>
        </li>
      </ul>
    </div>
    <button @click="submitAttractions" class="submit-button">提交线路景点</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SetRouteAttractions',
  data() {
    return {
      routeSteps: [],
      showSearch: false,
      searchQuery: '',
      searchResults: []
    };
  },
  methods: {
    addStep() {
      this.showSearch = true;
    },
    async searchAttractions() {
      if (!this.searchQuery) return;

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/attractions/', {
          params: {
            search: this.searchQuery
          }
        });
        const filteredResults = response.data.filter(attraction => 
          attraction.name.includes(this.searchQuery) || attraction.address.includes(this.searchQuery)
        );
        this.searchResults = filteredResults;
      } catch (error) {
        console.error('搜索景点失败:', error);
      }
    },
    cancelSearch() {
      this.showSearch = false;
      this.searchQuery = '';
      this.searchResults = [];
    },
    addAttractionToRoute(attraction) {
      this.routeSteps.push(attraction);
      this.cancelSearch();
    },
    removeStep(index) {
      this.routeSteps.splice(index, 1);
    },
    async submitAttractions() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('请先登录');
        return;
      }

      const routeId = this.$route.params.routeId;

      try {
        for (const attraction of this.routeSteps) {
          await axios.post('http://127.0.0.1:8000/api/rt_at/', { rt_id: routeId, at_id: attraction.id }, {
            headers: {
              'Authorization': `Token ${token}`
            }
          });
        }
        alert('线路景点设置成功!');
        this.$router.push({ name: 'SetRouteDates', params: { routeId } });
      } catch (error) {
        console.error('提交线路景点失败:', error);
        alert('设置线路景点失败.');
      }
    }
  }
}
</script>

<style scoped>
.set-route-attractions {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.route-plan {
  margin-top: 30px;
}

.route-step {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.route-step span {
  margin-right: 10px;
}

.search-section {
  max-width: 600px;
  margin: 30px auto 0;
}

.search-section input {
  width: 300px;
  padding: 10px;
  margin-right: 10px;
}

.search-section button {
  margin-left: 10px;
}

.search-section ul {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
}

.search-section li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.search-section li span {
  margin-right: 10px;
}

button {
  background-color: #42b983;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #368f6a;
}

.submit-button {
  margin-top: 20px;
  width: 100%;
}
</style>
