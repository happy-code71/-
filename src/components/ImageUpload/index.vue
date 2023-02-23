<template>
  <div>
    <el-upload
      :before-upload="beforeUpload"
      :class="{disabled:isDisabled}"
      :file-list="fileList"
      :http-request="upload"
      :limit="1"
      :on-change="changeFile"
      :on-preview="onPreview"
      :on-remove="onRemove"
      action=""
      list-type="picture-card"
    >
      <i class="el-icon-plus"/>
    </el-upload>
    <!-- 预览遮罩 -->
    <!--  .sync 的作用是什么  -->
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgSrc" width="100%">
    </el-dialog>
    <el-progress v-if="showPercent" :percentage="percent" style="width: 180px"/>
  </div>
</template>
<script>
/*
* 功能需求： 1.最多只能上传一张，有一张时，隐藏上传组件,一张都没有是显示上传组件
*           2.可以对上传到网页上的图片进行预览
*           3.限制上传的类型和大小
* */
import COS from 'cos-js-sdk-v5'

export default {
  name: 'Index',
  data() {
    return {
      showPercent: false, // 进度条显示
      percent: 0, // 当前进度
      currentFileUid: null, // 当前上传的图片id
      showDialog: false, // 预览遮罩
      imgSrc: '', // 预览图片地址
      fileList: []
    }
  },
  computed: {
    isDisabled() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击已上传到网页图片时的钩子,做预览功能
    onPreview(file) {
      this.showDialog = true
      this.imgSrc = file.url
    },
    // 删除图片的钩子
    onRemove(file, fileList) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    //   上传之前的检查
    beforeUpload(file) {
      // 图片类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('只支持jpeg，gif，bmp，png类型的图片')
        return false
      }
      // 最大为5M =》 1m=>1024kb  1kb=> 1024b
      if (5 * 1024 * 1024 < file.size) {
        this.$message.error('只支持不超过5M的图片')
        return false
      }
      //   已经确定当前上传的就是当前的这个file了
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
    },
    // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
    changeFile(file, fileList) {
      console.log('changeFile', file, fileList)
      this.fileList = fileList.map(item => item)
    },
    // 上传
    upload(params) {
      // api 地址：https://cloud.tencent.com/document/product/436/64960
      const cos = new COS({
        SecretId: 'AKIDPecLnysWtzpOhjUyC9pEM3TcU6RVHn1z', // 身份识别 ID
        SecretKey: 'iALFrCH5crra2D8m9G6h02nJYWDepkNj' // 身份密钥
      })
      cos.putObject({
          Bucket: 'aijiejie-1307158471', // 存储通名称
          Region: 'ap-guangzhou', // 存储通所在地域
          Key: params.file.name, // 存储名字
          Body: params.file, // 上传文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        },
        (err, data) => {
          // 这里使用箭头函数，this 指向vm
          if (err) {
            this.$message.warning(err)
          } else if (data && data.statusCode === 200) {
            //   此时说明文件上传成功  要获取成功的返回地址
            // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
            // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
            // 需要知道当前上传成功的是哪一张图片
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
                // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
              }
              return item
            })

            setTimeout(() => {
              this.showPercent = false // 隐藏进度条
              this.percent = 0 // 进度归0
            }, 2000)
            // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图
          }
        })
    }

  }
}
</script>

<!--不加scoped 反而生效，我还有？-->
<style>
.disabled .el-upload--picture-card {
  display: none;
}

</style>
