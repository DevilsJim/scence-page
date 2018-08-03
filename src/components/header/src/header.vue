<template>
  <header
    class="lashou-header"
    :class="[{ 'is-fixed': fixed, 'is-opaque': opaque,'is-negative': negative}, 'icon--' + icon]" >
    <div class="lashou-header-button is-left">
      <slot name="left"></slot>
    </div>
    <h1 class="lashou-header-title" :class="{'is-opaque': opaque === false}" v-text="title"></h1>
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
export default {
  name: 'ls-header',

  props: {
    fixed: Boolean,
    opaque: Boolean,
    negative: Boolean,
    title: String,
    icon: {
      type: String,
      default: 'default',
      validator (value) {
        return [
          'default',
          'logo'
        ].indexOf(value) > -1
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
    &.icon--logo{
      .lashou-header-title{
        font-size: 30px;
        &:before{
          display: inline-block;
          content: '';
          width: 52px;
          height: 52px;
          background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAMAAADypuvZAAAAw1BMVEUAAAAAAAAAAAAICAj6+vrZ2dn+/v7y8vLs7OxDQ0P////lH2YzuL+aE3MZcrrnKm7/+vz96vHwfKZgvM48u8KfH3r++vz+9fji9vf26fL84er83un4wdVWwcv2sMlJv8cvhcAgeLz0mbnyjbHEda68YKHuapnuZ5fsWI3rUYioMobpQX3oOHecGHb2/Pz79Pny3+zw3Ou35un72OSi3+Ljvtl30NV0z9TcrM5Po8o3usHRk7/Mh7i0T5exR5Lt1eY/k8UoRZD2AAAACnRSTlMBDwYM32H0rpUTV0ThaAAAAdRJREFUSMel1tl2gjAQBuBKQCuoLO77DijWtVq12vb9n6onGQrIBI6k/y3nO/+QXGRe/hNJIiSXGkIkKWaKSkHOqynJywWlKEUJUWT1icgKkULzqj6Z10Ahk6r8IkXNEEWCM5CzILko+UWZq0ghGyoQivB0jePsvqzrnmv1DDwfRbn4nbZn9TKNRqNbZvyWcxTFWm6UAAI2jbVh1P4CAQiyMNPR97KMkbY6pKE2mCgCZSajxt9sb/PzbtPsDuxgQiMR3Xwz36p+Oo6vpkmoXYeaTzWSCSDdTEAz6KEGK4uPGlA0V2NxoMrgoiMMt42jDlT1uGiGiyA2zMdFd4bOGA0YcrkILnaHUZchj4vgHDYYNeEkuEhn35oYrUs0NS7yGOpi1GJoyEUuQwOM9gz1uchiyMboxFCVi3oaSwdNd2XowkUGnIQTRx9wDmOMYD6WyaN5L8F0FT4y9UAhUxthBJlqEKcT/A+dDYqSkLHQ/NiDbnPd2p+uvumPEQpirrQwpTDDUQWhMIeIipifCkbRrgVGfdqThlRjqj+iWnVcQQg9AKYFzCdQE6J8jv/UGD3L9fTasF+9QEsUyUToURN6PoUeapGVQGT5EFpzRBYqgdVNbEkUzy9w12uULsvJKAAAAABJRU5ErkJggg==') no-repeat center;
          background-size: 100%;
          vertical-align: top;
          margin:15px 10px 0 0;
        }
      }
    }
    &-button{
      width: 100px;
      height: 50px;
      line-height: 50px;
    }
    &-title {
      position: relative;
      width:275px;
      color: #3C3C3C;
      font-size: 36px;
      line-height: 88px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 400;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
    }
    &-title.is-opaque {
      color: #eef;
    }
  }
</style>
