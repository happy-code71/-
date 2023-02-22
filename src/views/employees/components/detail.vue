<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <el-form
              ref="form"
              :model="formData"
              :rules="rules"
              label-width="120px"
              style="margin-left: 120px; margin-top:30px"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="formData.username" style="width:300px"/>
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input v-model="formData.password2" style="width:300px" type="password"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!--            <user-info></user-info>-->
            <!--            component动态组件  可以切换组件-->
            <!--            <el-button @click="userComponent = 'el-button'">切换组件</el-button>-->
            <!--            <el-button @click="userComponent = 'UserInfo'">切换组件</el-button>-->
            <component :is="userComponent"/>
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="'job-info'"></component>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserBaseInfo } from '@/api/user'
import { saveUserInfo } from '@/api/employees'
import UserInfo from '@/views/employees/components/user-info.vue'
import JobInfo from '@/views/employees/components/job-info.vue'

export default {
  name: 'Detail',
  components: { UserInfo, JobInfo },
  data() {
    return {
      userComponent: UserInfo,
      jobComponent: 'job-info',
      userId: this.$route.params.id,
      formData: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    // 获取用户信息
    async getUserInfo() {
      const userInfo = await getUserBaseInfo(this.userId)
      this.formData = { ...this.formData, ...userInfo }
    },
    // 提交
    async submit() {
      try {
        await this.$refs['form'].validate()
        await saveUserInfo({ ...this.formData, password: this.formData.password2 })
        this.$message.success('更新成功')
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>

</style>
