<template>
  <UploadExcel :on-success="onSuccess"/>
</template>

<script>
import { importEmployee } from '@/api/employees'

export default {
  name: 'Index',
  methods: {
    async onSuccess({ results }) {
      // 中文和英文的映射关系
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // key 转换成英文
      const arr = results.map(item => {
        const obj = {}
        Object.keys(item).forEach(i => {
          if (userRelations[i] === 'timeOfEntry' || userRelations[i] === 'correctionTime') {
            // 后端接口限制了 不能是字符串 要求转换成时间类型

            obj[userRelations[i]] = new Date(this.formatDate(item[i], '/')) // 只有这样才能入数据库
            console.log(this.formatDate(item[i], '/'))
          } else {
            obj[userRelations[i]] = item[i]
          }
        })
        return obj
      })
      // 插入
      await importEmployee(arr)
      this.$message.success('导入成功')
      // 返回上一级
      this.$router.back()
    },
    // excel 日期时间有误，用于转换Excel的日期格式
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style scoped>

</style>
