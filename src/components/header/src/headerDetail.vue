<template>
  <header
    class="lashou-header"
    :class="[{ 'is-fixed': fixed, 'is-opaque': opaque,'is-negative': negative, 'is-atlas': atlas}]" >
    <div class="lashou-header-button is-left">
      <slot name="left"></slot>
    </div>

    <div v-if="isDisplayFollow" class="lashou-header-title">
      <!--import引入用户信息组件-->
      <ls-user-detail v-if="lsUser.nickname" :type="followType" :sceneAccountTitle="pageShow.sceneAccountTitle" :createDate="pageShow.displayTime" :nickName="lsUser.nickname" :avatar="lsUser.headImg" :updateFlag="true" :isDefaultSceneAccount="pageShow.isDefaultSceneAccount" @linkToIndex="linkToIndex"></ls-user-detail>
      <!--import关注按钮-->
      <mt-button ref="btn" v-if="followType && !pageShow.isDefaultSceneAccount" :type="followType" @click="$emit('followedScene')"></mt-button>
    </div>

    <div class="lashou-header-button is-right">
      <slot name="right"></slot>
    </div>
  </header>
</template>

<script>
/**
 * mt-header
 * @module components/header
 * @desc 顶部导航
 * @param {boolean} [fixed=false] - 固定顶部
 * @param {string} [title] - 标题
 * @param {slot} [left] - 显示在左侧区域
 * @param {slot} [right] - 显示在右侧区域
 *
 * @example
 * <mt-header title="我是标题" fixed>
 *   <mt-button slot="left" icon="back" @click="handleBack">返回</mt-button>
 *   <mt-button slot="right" icon="more"></mt-button>
 * </mt-header>
 */
import lsUserDetail from '@/components/userInfo/src/userInfoDetail'
export default {
  name: 'ls-header-detail',
  props: {
    fixed: Boolean,
    opaque: Boolean,
    negative: Boolean,
    atlas: Boolean,
    title: String,
    lsUser: Object,
    pageShow: Object,
    followType: String,
    isDisplayFollow: {
      type: Boolean,
      default: true
    },
    isDefaultSceneAccount: Boolean
  },
  components: {
    lsUserDetail
  },
  methods: {
    linkToIndex () {
      // 判断打开是否为LSapp
      if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
        this.$parent.$emit('goAppscence', '111')
      } else {
        this.$router.push({ path: '/', query: { 'sceneAccountId': this.pageShow.sceneAccountId } })
      }
    }
  }
}
</script>

<style lang="sass" scoped type="text/css">
  .lashou-header {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background-color: transparent;
    box-sizing: border-box;
    color: #fff;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-size: 14px;
    height: 88px;
    line-height: 1;
    /*max-width: 750px;*/
    overflow: hidden;
    position: relative;
    text-align: center;
    white-space: nowrap;
    /*padding: 0 25px;*/
    &.is-fixed {
       top: 0;
       right: 0;
       left: 0;
       position: fixed;
       z-index: 999;
       margin: 0 auto;
     }
    &.is-opaque{
       background-color: #fff;
    }
    &.is-negative{
      margin-bottom: -88px
    }
    &-button{
      width: 100px;
      height: 50px;
      line-height: 50px;
    }
    &-title {
      position: relative;
      width:275px;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
    }
  }
  .lashou-header .lashou-header-title .lashou-button {
    height: 52px;
  }
  .lashou-header.is-atlas .lashou-header-title .lashou-button {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
  }
</style>
