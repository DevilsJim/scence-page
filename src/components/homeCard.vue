<!--
  /**
   * homeCard 组件用于引入场景号主页卡片
   * 
   */
-->
<template>
  <div class='cardBox' @click="$emit('goDetail',cardData)">
    <!-- 图文模版 -->
    <image-text v-if="datumJson.templateType === 'imageText'" :cardData="cardData"></image-text>
    <!-- 视频模板 -->
    <video-card v-if="datumJson.templateType === 'video'" :cardData="cardData"></video-card>
    <!-- 地图模板 -->
    <map-card v-if="datumJson.templateType === 'map'" :cardData="cardData"></map-card>
    <!-- 投票模板 -->
    <vote-card v-if="datumJson.templateType === 'vote'" :cardData="cardData"></vote-card>
  </div>
</template>

<script>
  import imageText from './indexCard/imageText'
  import videoCard from './indexCard/videoCard'
  import mapCard from './indexCard/mapCard'
  import voteCard from './indexCard/voteCard'
  export default {
    name: 'homeCard',
    props: [
      'cardData'
    ],
    data () {
      return {
        datumJson: {}
      }
    },
    created () {
      this.getCardData()
    },
    methods: {
      getCardData () {
        // console.log(this.cardData)
        this.datumJson = JSON.parse(this.cardData.datum)
      }
    },
    components: {
      imageText,
      videoCard,
      mapCard,
      voteCard
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">

</style>
