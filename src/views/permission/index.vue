<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="false">
        <template v-slot:right>
          <el-button size="small" type="primary" @click="addPermission(1,'0')">添加权限</el-button>
        </template>
      </page-tools>
      <el-table :data="permissionList" border row-key="id">
        <el-table-column align="center" label="名称" prop="name"/>
        <el-table-column align="center" label="标识" prop="code"/>
        <el-table-column align="center" label="描述" prop="description"/>
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <el-button v-if="row.type === 1" type="text" @click="addPermission(2,row.id)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--  新增 / 编辑弹层    -->
      <el-dialog :visible="showDialog" title="新增权限" @close="close">
        <el-form ref="form" :model="dialogData" :rules="rules" label-width="120px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="dialogData.name" style="width:90%"/>
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="dialogData.code" style="width:90%"/>
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="dialogData.description" style="width:90%"/>
          </el-form-item>
          <el-form-item label="开启">
            <el-switch v-model="dialogData.enVisible" active-value="1" inactive-value="0"/>
          </el-form-item>
        </el-form>
        <template v-slot:footer>
          <el-row justify="center" type="flex">
            <el-col :span="6">
              <el-button size="small" @click="close">取消</el-button>
              <el-button size="small" type="primary" @click="submit">确定</el-button>
            </el-col>
          </el-row>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { addPermission, delPermission, getPermissionDetail, getPermissionList, updatePermission } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'

export default {
  data() {
    return {
      permissionList: [], // 权限点列表
      showDialog: false, // 添加权限弹层
      dialogData: { // 弹层数据
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: { // 表单校验
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 获取所有权限点
    async getPermissionList() {
      this.permissionList = tranListToTreeData(await getPermissionList(), '0')
      console.log(this.permissionList)
    },
    // 删除权限
    async delPermission(id) {
      this.$confirm('确定要删除吗？').then(() => {
        return delPermission(id)
      }).then(() => {
        this.$message.success('操作成功')
        this.getPermissionList()
      }).catch(e => {
        console.log(e)
      })
    },

    //   新增权限
    // type: 1 => 页面权限， 2 => 操作权限
    // pid: 0 => 页面权限， 其他 => 操作权限
    addPermission(type, pid) {
      this.showDialog = true
      this.dialogData = { ...this.dialogData, type, pid } // 设置新增的type pid
    },
    // 编辑权限
    async editPermission(id) {
      this.dialogData = await getPermissionDetail(id)
      this.showDialog = true
    },
    //   提交数据
    submit() {
      this.$refs.form.validate().then(() => {
        //   校验成功
        if (this.dialogData.id) { // 有id 就是编辑
          return updatePermission(this.dialogData)
        }
        return addPermission(this.dialogData)
      }).then(async() => {
        this.showDialog = false
        this.$message.success('操作成功')
        this.getPermissionList()
      })
    },
    //   关闭弹层
    close() {
      this.showDialog = false
      this.dialogData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.form.resetFields()
    }

  }
}
</script>

<style>

</style>
