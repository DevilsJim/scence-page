
<template>
  <div class="download-wrap">
    <!--header-->
    <ls-header :opaque = 'true' fixed icon="logo" title = "天下拉手APP">
      <div to="/" slot="left">
        <mt-button icon="back"goBack @click="goBack"></mt-button>
      </div>
      <div slot="right"></div>
    </ls-header>
    <!--轮播-->
    <atlas-slide :atlasSlideSize="atlasSlideSize" :datumJson="datumJson" :pageShow="pageShow"></atlas-slide>
    <!--描述文字-->
    <div class="disc-app">
      天下拉手是以场景为中心的数据化商业运营平台。天下拉手通过将实体和虚拟场景数据化，形成线 上线下一体化通路，将多种类型的业务打通，挖 掘多元场景下的客户资源价值。
    </div>
    <!--button-->
    <mt-button type="download" @click="goDownload">打开天下拉手APP</mt-button>
  </div>
</template>

<script>
  import atlasSlide from '@/components/slider/atlasSlide'
  export default {
    name: 'downloadApp',
    data () {
      return {
        atlasSlideSize: {
          'width': 444,
          'height': 500,
          'slidesOffset': 40,
          'spaceBetween': 20,
          'slidesPerView': 'auto',
          'autoplay': false,
          'borderRadius': 8,
          'floatLayer': 'none',
          'downPaddingTop': 30
        },
        datumJson: {
          mainContent: [
            {'matter': require('../assets/share/download_img5.jpg')},
            {'matter': require('../assets/share/download_img6.jpg')},
            {'matter': require('../assets/share/download_img7.jpg')},
            {'matter': require('../assets/share/download_img8.jpg')},
            {'matter': require('../assets/share/download_img9.jpg')}
          ]
        },
        pageShow: {
          sceneAccountTitle: ''
        }
      }
    },
    components: {atlasSlide},
    methods: {
      goDownload: function () {
        window.location.href = 'http://www.tianxialashou.com.cn/download_app'
      },
      goBack () {
        this.$router.isBack = true
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped lang="sass" type="text/css">
  .download-wrap{
    padding: 88px 0 50px;
    background-color: #fff;
    box-sizing: border-box;
    min-height: 100%;
    height: 38%;
  }
  .swiper-container{
    padding-top: 20px;
  }
  .disc-app{
    padding: 20px 20px 50px 40px;
    font-size: 28px;
    color: #787878;
  }
</style>
