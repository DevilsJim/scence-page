<template>
  <div class="scene-count-box" :style="{'background':'url(' + sceneCountData.cover + ') no-repeat rgba(60, 60, 60, 0.4) 100% top / 100% auto'}" @click="gotoDown">
    <div class="scene-key">
      <img v-if="sceneCountData.visitType !== 'public'" class="scene-key-img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAOVBMVEUMAAAAAAAMAADz8vLMyMj+/v78/Px1bW39/f35+fn+/v719fXu7Ozw7+/T0NC3s7Ocl5fl5eX////rgvWfAAAAEnRSTlMUAAqhSe/aIubE+LSKl1Q6LndmlEIWAAABG0lEQVRIx6WWW66DMAxEBzdvAqXe/2Iv6kVQ2VbSlPMViTkafmIHk4IIB0T6K2QaAulAx9sKZLynQMS7CkS+a0DkuwZEvmtA5LsGrnzfOAUIYg2lhBoh+Bd0wer5jV+NCugCVzi8nHsFLk5XQBcEzhE7MXPQFVAFK5cNb7bCq6qAKqiccZC5qgpMEDz4oY4XPwg0JtC4INlmnt3BftzQ5plZkJ/NvGeFbxkzG8wNwVuCbwhs8o2Qncsjgo9A9LZAlhCwEyyBbIEd4NgWJlNIQDKF6QeBLMED3hJIXFE+qZUtQQ6BxAbpo0COmcUSFpyoQRYDK0K8CvSojEsS/7NceQwP49Fxf2OhfGPQraXYN+jWYu8pdO9xMvz8+QNSIB092Ey0ggAAAABJRU5ErkJggg==" alt="">
    </div>
    <h3 class="scene-count-title">{{ sceneCountData.title }}</h3>
    <h4 class="scene-count-des">{{ sceneCountData.description }}</h4>
    <div class="scene-count-bot">
      <div class="scene-count-bot-top">
        <div class="scene-flag">
          <span class="scene-flag-title" v-if="sceneCountData.sceneStatus == 1">{{ sceneCountData.sceneTitle }}</span>
          <span class="scene-flag-warn" v-else-if="sceneCountData.sceneStatus == 2">场景已被删除</span>
          <span class="scene-flag-warn" v-else>场景已关闭</span>
        </div>
        <div class="scene-tag">
          <span v-if="sceneCountData.tags.length" class="scene-tag-li" v-for="(item, index) in sceneCountData.tags" :key="index">{{ item.name }}</span>
        </div>
      </div>
      <p class="scene-count-bot-bot" v-if="sceneCountData.displayTime">{{ sceneCountData.displayTime }}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import Toast from '@/components/toast'
  export default {
    name: 'SceneCount',
    props: [
      'sceneCountData'
    ],
    data () {
      return {
        'actIndex': -1,
        'imagessFlagMore': true
      }
    },
    methods: {
      gotoDown () {
        this.$router.push({ path: '/downloadApp' })
      }
    },
    created () {
      if (this.sceneCountData.tags) {
        this.sceneCountData.tags = JSON.parse(this.sceneCountData.tags)
      }
    },
    updated () {
      // console.log(typeof(this.sceneCountData.tags))
      if (this.sceneCountData.tags && typeof (this.sceneCountData.tags) === 'string') {
        this.sceneCountData.tags = JSON.parse(this.sceneCountData.tags)
      }
    }
  }
</script>

<style lang="sass" scoped>
.scene-count-box {
  /*width: 100%;*/
  height: 340px;
  margin: 30px 30px;
  border-radius: 18px;
  background-color:#fff;
  overflow: hidden;
  position: relative;
  .scene-key {
    padding-top: 20px;
    padding-left: 20px;
    height: 48px;
    .scene-key-img {
      width:48px;
      height:48px;
    }
  }
  .scene-count-title {
    font-size: 46px;
    line-height: 65px;
    color: #fff;
    padding-left:30px;
    margin-top: 10px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .scene-count-des {
    padding-left: 30px;
    font-size: 26px;
    line-height: 37px;
    color: #fff;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .scene-count-bot {
    position: absolute;
    bottom:0;
    left:0;
    right:0;
    height: 120px;
    padding: 0 30px;
    background-color: #fff;
    .scene-count-bot-top {
      display: flex;
      -webkit-display: flex;
      justify-content: space-between;
      height: 42px;
      padding-top: 20px;
      .scene-flag {
        height: 42px;
        max-width: 50%;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        .scene-flag-title {
          font-size: 30px;
          line-height: 42px;
          color: #666;
        }
        .scene-flag-warn {
          padding-left: 36px;
          background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAOVBMVEUAAAD+bYj/Z4T+Z4X+aIT9Z4X/aIb/ZoX/aof/dIv9Z4X/+NT+gZT/WYL/w7f/7s/+5cn+rKr+oKOvvCTlAAAAC3RSTlMA+mfCtnlMQTULiovtLoUAAACuSURBVCjPfZNZEoQgDERZBzFtEO5/2KlRyxZHeV9ar0LIgiE5uRhdyuafT7BotTbY8LmpyUOLbBSFn67OWZULah3djFU6VsxnHIrsAMdHgTvy2TNuWc5Yu+f1KpTM67caIE9S8Kso6LPUYEy25VkWm02CdJIgGdfeZHMm1jdZ41AOj+0vhO4nsRTCUtiEGxpu7QP69rHxvVTPkRGOjMMmHPZgTYYLNl7N8VIPn8MXVlgZZemWXYcAAAAASUVORK5CYII=') no-repeat left center;
          background-size: 26px;
          font-size: 26px;
          line-height: 42px;
          color: #FE7089;
        }
      }
      .scene-tag {
        height: 42px;
        .scene-tag-li {
          display: inline-block;
          font-size: 26px;
          line-height: 42px;
          color: #C2C3C4;
          padding: 0 15px;
          border-right: 1px solid #C2C3C4;
        }
        .scene-tag-li:last-child {
          border-right: none;
        }
      }
    }
    .scene-count-bot-bot {
      font-size: 22px;
      line-height: 30px;
      color: #999;
      margin-top: 6px;
    }
  }
}
</style>
