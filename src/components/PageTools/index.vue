<template>
  <el-card class="page-tools">
    <el-row align="middle" justify="space-between" type="flex">
      <el-col>
        <div v-if="showBefore" class="before">
          <i class="el-icon-info"/>
          <!-- 定义前面得插槽 -->
          <slot name="left"/>
        </div>
      </el-col>
      <el-col>
        <el-row justify="end" type="flex">
          <slot name="right"/>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  props: {
    showBefore: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style lang="scss">
.page-tools {
  margin: 10px 0;

  .before {
    line-height: 34px;

    i {
      margin-right: 5px;
      color: #409eff;
    }

    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
}</style>
