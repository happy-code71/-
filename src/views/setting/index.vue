<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >新增角色
              </el-button>
            </el-row>
            <!-- 表格 -->
            <el-table v-loading="loading" :data="tableList" border="">
              <el-table-column label="序号" type="index" width="120"/>
              <el-table-column label="角色名称" prop="name" width="240"/>
              <el-table-column label="描述" prop="description"/>
              <el-table-column label="操作">
                <template v-slot="{row}">
                  <el-button size="small" type="success" @click="openAssignPermissionDialog(row.id)">分配权限
                  </el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row align="middle" justify="center" style="height: 60px" type="flex">
              <!-- 分页组件 -->
              <el-pagination
                :page-size="this.page.pagesize"
                :total="page.total"
                layout="prev,pager,next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <!--     新增 / 编辑弹层     -->
          <el-dialog :visible="showDialog" title="新增 / 编辑" @close="cancel">
            <el-form
              ref="tableForm"
              :model="formData"
              :rules="rules"
              label-width="150px"
            >
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="formData.name" style="width: 70%;"/>
              </el-form-item>
              <el-form-item label="角色描述" prop="description">
                <el-input v-model="formData.description" style="width: 70%;"/>
              </el-form-item>
            </el-form>
            <template v-slot:footer>
              <el-row align="middle" justify="center" type="flex">
                <el-col :span="6">
                  <el-button size="small" type="primary" @click="cancel">取消</el-button>
                  <el-button size="small" type="primary" @click="submit">确定</el-button>
                </el-col>
              </el-row>
            </template>
          </el-dialog>
          <!--      分配权限弹层    -->
          <el-dialog :visible="showAssignPermission" title="分配权限" @close="cancelPermission">
            <el-tree
              ref="permissionTree"
              :check-strictly="true"
              :data="permissionList"
              :default-checked-keys="rolePermissionList"
              :default-expand-all="true"
              :props="defaultProps"
              node-key="id"
              show-checkbox
            />
            <template v-slot:footer>
              <el-row justify="center" type="flex">
                <el-col :span="6">
                  <el-button size="small" @click="cancelPermission">取消</el-button>
                  <el-button size="small" type="primary" @click="assignPermission">确定</el-button>
                </el-col>
              </el-row>
            </template>
          </el-dialog>
          <!--      公司信息    -->
          <el-tab-pane label="公司信息">
            <el-alert
              :closable="false"
              show-icon
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input disabled style="width:400px"/>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input disabled style="width:400px"/>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input disabled style="width:400px"/>
              </el-form-item>
              <el-form-item label="备注">
                <el-input :rows="3" disabled style="width:400px" type="textarea"/>
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { addRole, assignPerm, delRole, getAllRole, getRoleDetailById, UpdateRole } from '@/api/setting'
import { getPermissionList } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'

export default {
  data() {
    return {
      loading: false, // 表格加载
      tableList: [], // 列表数据
      page: { // 分页信息
        page: 1,
        pagesize: 10,
        total: 0
      },
      showDialog: false, // 弹层显示
      formData: { // 弹层表单数据
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入 角色描述', trigger: 'blur' }]
      },
      showAssignPermission: false, // 权限分配弹层
      permissionList: [], // 权限点列表
      defaultProps: { // 权限树的配置项
        label: 'name',
        children: 'children'
      },
      rolePermissionList: [], // 角色拥有的权限列表
      currentRoleId: null // 当前角色的id
    }
  },
  created() {
    this.getAllRole()
  },
  methods: {
    // 获取角色列表
    async getAllRole() {
      this.loading = true
      const { rows, total } = await getAllRole(this.page)
      this.tableList = rows
      this.page.total = total
      this.loading = false
    },
    // 页数变化的时候
    changePage(page) {
      this.page.page = page
      this.getAllRole()
    },
    //   删除角色
    async delRole(id) {
      try {
        await this.$confirm('确定要删除该角色吗？')
        await delRole(id)
        await this.getAllRole()
        this.$message.success('删除成功')
      } catch (e) {
        console.log(e)
      }
    },
    // 编辑角色
    async editRole(id) {
      this.formData = await getRoleDetailById(id)
      this.showDialog = true
    },
    //   提交数据
    async submit() {
      try {
        await this.$refs.tableForm.validate()
        if (this.formData.id) {
          await UpdateRole(this.formData)
          console.log('s')
        } else {
          await addRole(this.formData)
        }
        this.showDialog = false // 弹层依赖项为false 的时候会自动触发 close 绑定的事件
        this.$message.success('新增 / 编辑 角色成功')
        await this.getAllRole()
      } catch (e) {
        console.log(e)
      }
    },
    cancel() {
      this.showDialog = false
      this.formData = {
        name: '',
        description: ''
      }
      this.$refs.tableForm.resetFields()
    },
    //   开启分配权限弹层
    async openAssignPermissionDialog(roleId) {
      this.permissionList = tranListToTreeData(await getPermissionList(), '0')
      const { permIds, id } = await getRoleDetailById(roleId)
      this.rolePermissionList = permIds
      this.currentRoleId = id
      this.showAssignPermission = true
    },
    //   分配权限
    async assignPermission() {
      // 当前选中的节点
      const list = this.$refs.permissionTree['getCheckedKeys']()
      await assignPerm({ id: this.currentRoleId, permIds: list })
      this.$message.success('操作成功')
      this.showAssignPermission = false
    },
    // 关闭分配权限弹层
    cancelPermission() {
      this.showAssignPermission = false
      this.rolePermissionList = []
    }
  }
}
</script>

<style>

</style>
