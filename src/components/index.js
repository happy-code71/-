import PageTools from '@/components/PageTools/index.vue'
import UploadExcel from '@/components/UploadExcel/index.vue'
import ImageUpload from '@/components/ImageUpload/index.vue'

export default {

  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
  }
}
