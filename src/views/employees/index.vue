<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template v-slot:left>
          <span>共{{ userList.total }}条记录</span>
        </template>
        <template v-slot:right>
          <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger" @click="exportExcel">导出</el-button>
          <el-button v-if="checkPermission('aa')" size="small" type="primary" @click="showDialog = true">新增员工
          </el-button>
        </template>
      </page-tools>
      <el-card v-loading="loading">
        <el-table :data="userList.list" style="width: 100%">
          <el-table-column label="序号" type="index"/>
          <el-table-column label="姓名" prop="username" sortable="true"/>
          <el-table-column label="头像" prop="staffPhoto">
            <template v-slot="{row}">
              <img
                slot="reference"
                v-imagerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto "
                alt=""
                style="border-radius: 50%; width: 50px; height: 50px; padding: 10px"
                @click="showQr(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile"/>
          <el-table-column label="工号" prop="workNumber" sortable="true"/>
          <el-table-column :formatter="formOfEmployment" label="招聘形式" prop="formOfEmployment" sortable="true"/>
          <el-table-column label="部门" prop="departmentName" sortable="true"/>
          <el-table-column label="入职时间" prop="timeOfEntry" sortable="true">
            <template v-slot="{row}">
              {{ row.timeOfEntry |formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" prop="enableState" sortable="true">
            <template v-slot="{row}">
              <el-switch :value="parseInt(row.enableState)=== 1"/>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="280">
            <template v-slot="{row}">
              <el-button size="small" type="text" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button size="small" type="text">转正</el-button>
              <el-button size="small" type="text">调岗</el-button>
              <el-button size="small" type="text">离职</el-button>
              <el-button size="small" type="text" @click="openShowRoleDialog(row.id)">角色</el-button>
              <el-button size="small" type="text" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row justify="center" style="margin-top: 20px" type="flex">
          <el-pagination
            :total="userList.total"
            background
            layout="prev, pager, next"
            @current-change="changePage"
            @prev-click="changePage"
            @next-click="changePage"
          />
        </el-row>

      </el-card>
      <!--   新增弹层   -->
      <add-employee :show-dialog.sync="showDialog"/>
      <!--    二维码弹层  -->
      <el-dialog :visible.sync="showQrDialog" title="二维码">
        <el-row justify="center" type="flex">
          <canvas ref="qrDom"/>
        </el-row>
      </el-dialog>
      <!--   分配角色弹层   -->
      <assign-role ref="roleDom" :show-role-dialog.sync="showRoleDialog" :user-id="userRoleId"></assign-role>
    </div>
  </div>
</template>

<script>
import { getUsers, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from '@/views/employees/components/add-employee.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
import AssignRole from '@/views/employees/components/assign-role.vue'

export default {
  components: { AssignRole, AddEmployee },
  data() {
    return {
      loading: false, // 加载
      // 表格数据
      userList: {
        list: [], // 表格数组
        total: 0// 总数
      },
      // 分页
      pagination: {
        page: 1, // 页数
        size: 10// 条数
      },
      showDialog: false, // 展示弹层
      showQrDialog: false, // 二维码弹层
      showRoleDialog: false, // 分配角色弹层
      userRoleId: '' // 分配角色弹层用户ID
    }
  },
  computed: {},
  created() {
    this.getUser()
  },
  methods: {
    async getUser() {
      this.loading = true
      const { rows, total } = await getUsers({ size: this.pagination.size, page: this.pagination.page })
      this.userList.list = [...rows]
      this.userList.total = total
      this.loading = false
    },
    changePage(page) {
      this.pagination.page = page
      this.getUser()
    },
    // 格式化聘用形式
    formOfEmployment(row, column, cellValue, index) {
      const res = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return res ? res.value : '未知'
    },
    //   删除员工
    delEmployee(id) {
      this.$confirm('确定删除吗?').then(async() => {
        await delEmployee(id)
        this.$message.success('删除成功')
        this.getUser()
      })
    },
    // 导出为excel
    async exportExcel() {
      // 表头中英文关系
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const { rows } = await getUsers({ page: 1, size: this.userList.total })
      const data = this.formatJson(rows, headers)
      // 懒加载引入
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel(
          // 参数要求
          // {
          //   header: ['姓名', '手机号'], // 表头
          //   data: [['hcj', 123], ['hhh', 5456]], // 导出数据,一个数组表示一行数据
          //   filename: '员工数据表', // 文件名
          //   bookType: 'xlsx' // 文件类型
          // }

          // 基本使用
          // {
          //   header: Object.keys(headers), // 表头
          //   data, // 导出数据,一个数组表示一行数据
          //   filename: '员工数据表', // 文件名
          //   bookType: 'xlsx' // 文件类型
          // }

          // 复杂表头
          {
            multiHeader: [['姓名', '主要信息', '', '', '', '', '部门']], // 一个数组表示一行表头 复杂表头
            merges: ['A1:A2', 'B1:F1', 'G1:G2'], // 单元格合并
            header: Object.keys(headers), // 表头
            data, // 导出数据,一个数组表示一行数据
            filename: '员工数据表', // 文件名
            bookType: 'xlsx' // 文件类型
          }
        )
      })
    },
    // 把js 格式转换成 [{}] => [[]]
    // row : [], header :[]
    formatJson(row, header) {
      return row.map(item => {
        return Object.keys(header).map(i => {
          // 格式化时间
          if (header[i] === 'timeOfEntry' || header[i] === 'correctionTime') {
            return formatDate(item[header[i]])
          }
          // 转换聘用形式
          if (header[i] === 'formOfEmployment') {
            const res = EmployeeEnum.hireType.find(t => parseInt(t.id) === parseInt(item[header[i]]))
            return res ? res.value : '未知'
          }
          return item[header[i]]
        })
      })
    },
    // 点击图片，展示二维码
    showQr(url) {
      if (url.trim()) { // 判断是否有图片url
        this.showQrDialog = true // 展示弹层 => 页面更新 (页面更新是异步的)  => 此时还没有弹层
        this.$nextTick(() => { // 本次页面更新后立即执行
          QrCode.toCanvas(this.$refs.qrDom, url)
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    //   开始分配角色弹层
    async openShowRoleDialog(id) {
      await this.$refs.roleDom.getUserRole(id)
      this.showRoleDialog = true
      this.userRoleId = id
    }

  }

}
</script>

<style></style>
