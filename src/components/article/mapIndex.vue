<template>
  <div class='articleDetailBox'>
    <!-- import引入head组件 -->
    <ls-header :opaque = 'true' fixed title = '' v-if="headFlag" >
      <div slot='left'>
        <mt-button icon='back' @click='goBack'></mt-button>
      </div>
      <mt-button slot = 'right'></mt-button>
    </ls-header>
    <!-- 引用高德地图 -->
    <div class="mapIndexBox">
      <el-amap class='mapShow' :center="center" :zoom="zoom" :events="events">
        <el-amap-marker class="mapShowMarker" :icon="icon"></el-amap-marker>
        <!-- <el-amap-circle :radius="circles.radius"></el-amap-circle> -->
      </el-amap>
      <div class="mapTitle">
        <p>{{ mapTitle }}</p>
        <em>{{ mapAddress }}</em>
      </div>
    </div>
  </div>
</template>

<script>
  import lsHeader from '@/components/header'
  import Vue from 'vue'
  import VueAMap from 'vue-amap' // 引入高德地图

  Vue.use(VueAMap)
  VueAMap.initAMapApiLoader({
    key: 'afacc0c34e39eb8832ddfa867afef8aa',
    plugin: ['AMap.Autocomplete', 'AMap.Scale', 'AMap.Marker']
  })

  export default {
    name: 'articleDetail',
    data () {
      return {
        'fixed': true,
        'transprant': false,
        'headFlag': true,
        'title': '文章详情',
        'mapTitle': '',
        'mapAddress': '',
        'pageShow': {},
        'center': [],
        'zoom': 15,
        'icon': '',
        'circles': {
          'center': [this.$route.query.longitude, this.$route.query.latitude],
          'radius': 200,
          'fillOpacity': 0.5
        },
        'events': {
          init (o) {
            // var marker = new AMap.Marker({
            //   position: this.center
            // })
            // marker.setMap(o)
          }
        }
      }
    },
    components: {
      lsHeader
    },
    created () {
      // console.log(this.$route.query.longitude)
      // 判断打开LSapp
      if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
        this.headFlag = false
      }
      this.mapTitle = this.$route.query.mapTitle
      this.mapAddress = this.$route.query.mapAddress
      this.center = [this.$route.query.longitude, this.$route.query.latitude]
    },
    methods: {
      goBack () {
        this.$router.isBack = true
        this.$router.go(-1)
      }
    }
  }
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="sass">
  .articleDetailBox {
    width: 100%;
    height: 100%;
    /*overflow: scroll;*/
  }
  .mapIndexBox {
    height: 100%;
    .mapShow {
      height:86%;
      .mapShowMarker {
        background-color:#ccc;
      }
    }
    .mapTitle {
      height:auto;
      padding: 30px 30px 0;
      p {
        font-size:38px;
        color:#222;
      }
      em {
        display: block;
        width:100%;
        font-size: 28px;
        color:#666;
        margin-top:12px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
      }
    }
  }
</style>
