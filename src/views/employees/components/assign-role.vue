<template>
  <el-dialog :visible="showRoleDialog" title="分配角色" @close="close">
    <el-checkbox-group v-model="userRoleList">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <template v-slot:footer>
      <el-row justify="center" type="flex">
        <el-col :span="6">
          <el-button size="small" @click="close">取消</el-button>
          <el-button size="small" type="primary" @click="submit">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getAllRole } from '@/api/setting'
import { assignRoles, getUserBaseInfo } from '@/api/user'

export default {
  name: 'AssignRole',
  props: {
    // 显示弹层
    showRoleDialog: {
      type: Boolean,
      required: true
    },
    // 当前用户id
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      userRoleList: [], // 用户角色列表
      roleList: [] // 角色列表
    }
  },
  // 这样写数据还是有延迟，在父组件中调用把
  // watch: {
  //   userId() {
  //     this.getUserRole()
  //   }
  // },
  created() {
    this.getRoleAll()
    // userid变化查询
    // this.$watch('userId', (newVal, oldVal) => {
    //   this.getUserRole()
    // })
  },
  methods: {
    // 获取所有角色
    async getRoleAll() {
      const { rows } = await getAllRole({ page: 1, pagesize: 50 }) // 没有获取全部的接口，所以只能获取50个
      this.roleList = rows
    },
    //   获取当前用户拥有的角色
    async getUserRole(id) {
      const { roleIds } = await getUserBaseInfo(id)
      this.userRoleList = roleIds
    },
    //   提交
    async submit() {
      await assignRoles({ id: this.userId, roleIds: this.userRoleList })
      this.close()
      this.$message.success('分配角色成功')
    },
    //   关闭弹层
    close() {
      this.$emit('update:showRoleDialog', false)
      this.userRoleList = []
    }
  }
}
</script>

<style scoped>

</style>
