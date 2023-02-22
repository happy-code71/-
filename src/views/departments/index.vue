<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <tree-tool :is-root="true" :tree-node="company" />
        <el-tree :data="departs" :default-expand-all="true" :props="defaultProps">
          <tree-tool slot-scope="{data}" :tree-node="data" @upDepartment="getAllDepartment" />
        </el-tree>
        <!-- </el-row> -->
      </el-card>
    </div>
  </div>
</template>

<script>

import TreeTool from '@/views/departments/components/tree-tool.vue'
import { getAllDepartment } from '@/api/department'
import { tranListToTreeData } from '@/utils'

export default {
  components: { TreeTool },
  data() {
    return {
      company: {},
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
      { name: '行政部', manager: '刘备' },
      { name: '人事部', manager: '孙权' }],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getAllDepartment()
  },
  methods: {
    async getAllDepartment() {
      const departmentInfo = await getAllDepartment()
      this.company = { name: departmentInfo.companyName, manager: '负责人' }
      this.departs = tranListToTreeData(departmentInfo.depts, '')
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
