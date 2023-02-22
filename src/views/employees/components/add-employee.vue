<template>
  <el-dialog :visible="showDialog" title="新增员工" @close="cancel">
    <!-- 表单 -->
    <el-form ref="form" :model="formData" :rules="rules" label-width="200px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入姓名" style="width:50%"/>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="请输入手机号" style="width:50%"/>
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" placeholder="请选择日期" style="width:50%"/>
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" placeholder="请选择" style="width:50%">
          <!-- 遍历只能遍历组件的数据 -->
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" placeholder="请输入工号" style="width:50%"/>
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          placeholder="请选择部门"
          style="width:50%"
          @focus="getAllDepartment"
        />
        <el-tree
          v-show="showTree"
          v-loading="loading"
          :data="treeData"
          :default-expand-all="true"
          :props="{ label: 'name' }"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" placeholder="请选择日期" style="width:50%"/>
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row justify="center" type="flex">
        <el-col :span="6">
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button size="small" type="primary" @click="submit">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import { getAllDepartment } from '@/api/department'
import { tranListToTreeData } from '@/utils'
import { addUser } from '@/api/employees'

export default {
  name: 'AddEmployee',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum,
      // 表单数据
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      // 表单校验
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }],
        correctionTime: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      treeData: [], // 部门树形数据
      loading: false, // 树形结构加载
      showTree: false// 树形结构的显示
    }
  },
  methods: {
    // 获取部门数据
    async getAllDepartment() {
      this.loading = true
      const { depts } = await getAllDepartment()
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
      this.showTree = true
    },
    // 选择部门
    selectNode(data) {
      this.formData.departmentName = data.name
      this.showTree = false
    },
    // 确定提交
    async submit() {
      try {
        await this.$refs['form'].validate() // 表单校验
        await addUser(this.formData) // 添加用户
        await this.getAllDepartment() // 重新获取数据
        this.$message.success('添加成功')
        this.cancel()
      } catch (e) {
        console.log(e)
      }
    },
    // 取消
    cancel() {
      // this.$parent.showDialog = false // 关闭父组件的变量
      this.$emit('update:showDialog', false)
      this.formData = { // 重置表单
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs['form'].resetFields() // 重置校验
      this.showTree = false
    }
  }
}
</script>

<style scoped>

</style>
