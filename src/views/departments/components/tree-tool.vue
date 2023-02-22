<template>

  <el-row align="middle" justify="space-between" style="height: 40px;width: 100%;" type="flex">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row justify="space-between" type="flex">
        <el-col>
          <span>{{ treeNode.manager }}</span>
        </el-col>
        <el-col>
          <el-dropdown @command="handleCommand">
            <span>操作<i class="el-icon-arrow-down" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除子部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
    <!--  弹层  -->
    <el-dialog :before-close="dialogClose" :visible.sync="showDiaolg" style="z-index: 99" title="添加/编辑部门">
      <el-form ref="dialogForm" :model="formData" :rules="formRules" label-width="100px">
        <el-row align="middle" justify="center" style="flex-direction: column;" type="flex">
          <el-col :span="20">
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="formData.name" placeholder="1-50个字符" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="部门编码" prop="code">
              <el-input v-model="formData.code" placeholder="1-50个字符" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="部门负责人" prop="manager">
              <el-select v-model="formData.manager" placeholder="请选择负责人" style="width: 100%;">
                <el-option v-for="item in simpleList" :key="item.id" :label="item.username" :value="item.username" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="部门介绍" prop="introduce">
              <el-input
                v-model="formData.introduce"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="1-300个字符"
                type="textarea"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose ">取 消</el-button>
        <el-button type="primary" @click="validateForm">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>

</template>
<script>
import { addDepartment, delDepartment, editDepartment, getAllDepartment } from '@/api/department'
import { getSimple } from '@/api/employees'

export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    //   校验编码
    const validateCode = async(rule, value, callback) => {
      let isHas = false
      // 新增时的校验
      if (this.currentAction === 'add' && this.treeNode.children && this.treeNode.children.length) {
        isHas = this.treeNode.children.some(item => item.code === value)
      } else if (this.currentAction === 'edit') {
        // 编辑时的校验
        const { depts } = await getAllDepartment()
        isHas = depts.filter(item => item.pid === this.treeNode.pid).some(item => item.code === value)
      }
      if (isHas) {
        callback(new Error(`同级部门下已经有${value}编码了，请换一个`))
      } else {
        callback()
      }
    }
    // 校验部门名称
    const validateName = async(rule, value, callback) => {
      let isHas = false
      // 新增时的校验
      if (this.currentAction === 'add' && this.treeNode.children && this.treeNode.children.length) {
        isHas = this.treeNode.children.some(item => item.name === value)
      } else if (this.currentAction === 'edit') {
        // 编辑时的校验
        const { depts } = await getAllDepartment()
        isHas = depts.filter(item => item.pid === this.treeNode.pid).some(item => item.name === value)
      }
      if (isHas) {
        callback(new Error(`同级部门下已经有${value}部门了，请换一个`))
      } else {
        callback()
      }
    }
    return {
      // 弹层开启/关闭
      showDiaolg: false,
      // 弹层表单数据
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      // 弹层表单校验
      formRules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入部门编码', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { validator: validateCode, trigger: 'blur' }
        ],
        manager: [{ required: true, message: '请选择部门负责人', trigger: 'blur' }],
        introduce: [
          { required: true, message: '请输入部门介绍', trigger: 'blur' },
          { min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' }
        ]
      },
      //   弹层负责人列表
      simpleList: [],
      // 当前状态：add 新增， edit 编辑
      currentAction: ''
    }
  },
  methods: {
    // 点击操作项
    handleCommand(command) {
      // 点击删除
      if (command === 'del') {
        this.$confirm('确定要删除该部门吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delDepartment(this.treeNode.id)
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$emit('upDepartment')
        })
      } else if (command === 'add') {
        this.currentAction = 'add'
        this.dialogOpen()
      } else if (command === 'edit') {
        this.formData = { ...this.treeNode }
        this.currentAction = 'edit'
        this.dialogOpen()
      }
    },
    //   获取弹层负责人列表
    async getSimpleList() {
      this.simpleList = await getSimple()
    },
    //   弹层关闭
    dialogClose() {
      this.showDiaolg = false
      this.currentAction = ''
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$refs['dialogForm'].resetFields()
    },
    //   弹层开启
    dialogOpen() {
      this.showDiaolg = true
      this.getSimpleList()
    },
    // 弹层表单校验
    async validateForm() {
      try {
        await this.$refs['dialogForm'].validate()
        this.currentAction === 'add' ? this.addDepartment() : this.editDepartment()
      } catch (e) {
        console.log(e)
      }
    },
    //   添加部门
    async addDepartment() {
      const body = { ...this.formData, pid: this.treeNode.id }
      await addDepartment(body)
      await this.$emit('upDepartment')
      this.dialogClose()
      this.$message({
        type: 'success',
        message: '新增部门成功'
      })
    },
    // 编辑部门
    async editDepartment() {
      await editDepartment(this.formData)
      await this.$emit('upDepartment')
      this.dialogClose()
      this.$message({
        type: 'success',
        message: '编辑部门成功'
      })
    }

  }
}
</script>
<style lang="">

</style>
