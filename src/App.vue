<template>
  <div id="app">
      <router-view class="Router"></router-view>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'app',

    computed: {...mapGetters(['gettersMsg'])},
    data () {
      return {
        transitionName: 'slide-right'  // 默认动态路由变化为slide-right
      }
    },
    watch: {
      $route (to, from) {
        // to表示的是你要去的那个组件，from 表示的是你从哪个组件过来的，它们是两个对象，你可以把它打印出来，它们也有一个param 属性
        if (to.name === '评论列表') {
          document.title = to.name
          this.sendAppDetailTitle(to.name)
        } else if (to.name === '评论详情') {
          document.title = to.name
          this.sendAppDetailTitle(to.name)
        } else if (to.name === '投票明细') {
          document.title = to.name
        } else {
          document.title = '\u200E'
        }
        /* eslint-disable */
        TDAPP.onEvent(to.name,to.query.contentShowType)
        /* eslint-enable */
      }
    },
    methods: {
      sendAppDetailTitle (name) {  // 评论页与app交互 jinlijing
        if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {  // 判断是否在app中
          var u = navigator.userAgent.toLowerCase()
          if (/(iphone|ipad|ipod|ios)/i.test(u)) {
            window.setupWebJsBridge(function (bridge) {
              bridge.callHandler('getDetailTitle', {'title': name}, function (response) {})  // 判断是否登录
            })
          }
          window.connWebJsBridge(function (bridge) {
            bridge.callHandler('getDetailTitle', {'title': name}, function (response) {})  // 判断是否登录
          })
        }
      }
    }
  }
</script>


<style lang="sass">
  @charset "utf-8";html{color:#000;background:#f8f9fc;overflow-y:scroll;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}html *{outline:0;-webkit-text-size-adjust:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}html,body{font-family:sans-serif;height:100%;}body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td,hr,button,article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{margin:0;padding:0}input,select,textarea{font-size:100%}table{border-collapse:collapse;border-spacing:0}fieldset,img{border:0}abbr,acronym{border:0;font-variant:normal}del{text-decoration:line-through}address,caption,cite,code,dfn,em,th,var{font-style:normal;font-weight:500}ol,ul{list-style:none}caption,th{text-align:left}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:500}q:before,q:after{content:''}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}a:hover{text-decoration:underline}ins,a{text-decoration:none}
  #app {
    font-family: "\5FAE\8F6F\96C5\9ED1", Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
    margin: 0 auto;
    /*max-width: 750px;*/
    background-color: #f8f9fc;
    height: 100%;
    box-sizing: border-box;
  }
  .Router{
    height: 100%;
  }
  .shadow{  /*全部阴影*/
    box-shadow: 0 0 5px 3px rgba(148, 148, 148, .12);
  }
  .shadow-bottom{   /*下阴影*/
    box-shadow: 0 1px 3px 3px rgba(148, 148, 148, .12);
  }
</style>
