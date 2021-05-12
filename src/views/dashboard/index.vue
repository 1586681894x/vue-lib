<template>
  <div class="dashboard-editor-container">
    <el-row>
      <el-col :span="12">
        <h6></h6>
        <ul class="list-unstyled">
          <li class="link-type">
            <router-link to="/business_finance/insurePolicy">
              保单管理
            </router-link>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  export default {
    name: 'Index',
    data() {
      return {
        //
      }
    },
    methods: {
      //
    }
  }
</script>
