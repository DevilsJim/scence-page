<template>
  <div class="main">
    <ls-header :opaque = 'changeHeader' fixed negative :title = "homePageTitle" >
      <div to="/" slot="left">
        <mt-button ></mt-button>
      </div>
      <mt-button slot = "right"></mt-button>
    </ls-header>
    <div class="header" ref="header" v-if="noDataHead" v-bind:style="{background: 'url(' + sceneaccounts.cover + ')'}">
      <em class="bg-moce"></em>
      <div class="head-cont">
        <span class="title" v-text="sceneaccounts.title"></span>
        <div>
          <img v-if="sceneaccounts.sceneTypeIcon" class="address-img" :src="sceneaccounts.sceneTypeIcon" alt="">
          <span class="address"  v-text="sceneaccounts.sceneTitle"></span>
          <span class="tag">
            <template v-for="(item,key) in sceneaccounts.tags" >{{ item.name }}{{key + 1 !== sceneaccounts.tags.length ? '/':''}}</template></span>
        </div>
        <ls-user v-if="sceneaccounts.publisher" type="home-page" :createDate="sceneaccounts.displayTime" :nickName="sceneaccounts.publisher.nickname" :avatar = "sceneaccounts.publisher.headImg" :updateFlag="true"></ls-user>
      </div>
    </div>
    <div v-if="noDataFlag || (sceneaccounts.contents && !sceneaccounts.contents.contentBlocks.length)" class="no-data-box">
      <img src="data:image/png;base64,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" class="no-data-img" alt="">
      <p class="no-data-txt" v-if="noDataFlag">当前场景号无内容</p>
      <p class="no-data-txt" v-if="sceneaccounts.contents && !sceneaccounts.contents.contentBlocks.length">当前无更多内容</p>
    </div>
    <mt-tab-container v-if="!noDataFlag" v-model = "selected" swipeable ref="wrap">
      <mt-tab-container-item id="tab1" v-if="sceneaccounts.contents">
        <mt-loadmore :top-method="loadTop" :max-distance="0"
                     @top-status-change="handleTopChange"  :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
          <div slot="top" class="mint-loadmore-top">
            <span v-show="topStatus === 'pull'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
            <span v-show="topStatus === 'loading'">Loading...</span>
            <span v-show="topStatus === 'drop'">释放更新</span>
          </div>
          <homeCard v-for="(item,index) in sceneaccounts.contents.contentBlocks" :key="index" :cardData="item" @goDetail="goDetail" title="tab-container 1" class="shadow-bottom margin-bottom"></homeCard>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus === 'pull'" :class="{ 'rotate': bottomStatus === 'drop' }">↓</span>
            <span v-show="bottomStatus === 'loading'">Loading...</span>
            <span v-show="bottomStatus === 'drop'">释放更新</span>
          </div>
        </mt-loadmore>
      </mt-tab-container-item>
    </mt-tab-container>
    <div v-if="keywordFlag === false" class="keywordBox">
      <visit-password :sceneAccountId="sceneAccountId" @clickKeyword="clickKeyword"></visit-password>
    </div>
    <!-- <router-link to="discussList">评价列表</router-link> -->
  </div>
</template>

<script type="text/ecmascript-6">
  import visitPassword from '@/components/visitPassword'
  export default {
    name: 'home-page',
    data () {
      return {
        'curUsrId': '', // 获取用户guid
        'sharInfo': '/gateway/delegate/share/sign?url={url}&channel=wechat&targetType={targetType}&targetId={targetId}', // 微信分享用
        allLoaded: false,
        translate: 0, // 此变量决定当前组件上下移动,
        containerFilled: false, // 当前滚动的内容是否填充完整,不完成会调用 loadmore的回调函数
        topText: '', // 下拉刷新,显示的文本
        topDropped: false, // 记录当前drop状态,用给组件dom添加is-dropped class(添加回到原点的动画)
        bottomText: '', // 上拉加载更多 显示的文本
        bottomDropped: false, // 同topDropped
        bottomReached: false, // 当前滚动是否滚动到了底部
        direction: '', // touch-move过程中, 当前滑动的方向
        startY: 0, // touch-start 起始的y的坐标值
        startScrollTop: 0, // touch-start 起始的滚动dom的 scrollTop
        currentY: 0, // touch-move 过程中的 y的坐标
        topStatus: '', // 下拉刷新的状态: pull(下拉) drop(释放) loading(正在加载数据)
        bottomStatus: '', // 上拉加载更多的状态: 状态同上
        changeHeader: false,
        homePageTitle: ' ',
        selected: 'tab1',
        popupVisible: false,
        sceneaccounts: '',
        sceneAccountId: this.$route.query.sceneAccountId,
        keywordFlag: true, // 判断是否调用密码
        keyData: {}, // 用于暂时存储获取到的数据
        noDataFlag: false, // 缺省
        noDataHead: true // 无内容时隐藏
      }
    },
    methods: {
      getJsBridge () {
        /* eslint-disable */
        function setupWebViewJavascriptBridge (callback) {
          if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge) }
          if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback) }
          window.WVJBCallbacks = [callback]
          var WVJBIframe = document.createElement('iframe')
          WVJBIframe.style.display = 'none'
          WVJBIframe.src = 'https://__bridge_loaded__'
          document.documentElement.appendChild(WVJBIframe)
          setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
        }
        setupWebViewJavascriptBridge(function (bridge) { })
        window.setupWebJsBridge = setupWebViewJavascriptBridge

        function connectWebViewJavascriptBridge (callback) {
          if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
          } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function () {
              callback(WebViewJavascriptBridge)
            }, false)
          }
        }
        window.connWebJsBridge = connectWebViewJavascriptBridge
        /* eslint-enable */
        // this.getMember()
      },
      loadTop: function () {  // 刷新数据的操作
        this.homePageData()
        var self = this
        setTimeout(function () {
          self.$refs.loadmore.onTopLoaded()
        }, 2000)
      },
      loadBottom: function () { // 加载更多数据的操作
        this.homePageLoadMore()
        var self = this
        setTimeout(function () {
          if (!self.allLoaded) {
            self.$refs.loadmore.onBottomLoaded()
          }
        }, 2000)
      },
      handleTopChange: function (status) {
        this.topStatus = status
      },
      handleBottomChange: function (status) {
        this.bottomStatus = status
      },
      goDownload () {
//        this.$Toast({
//          message: '为了您更好的体验，请下载天下拉手App',
//          duration: 2000
//        })
//        setTimeout(() => {
//          this.$router.push({ path: '/downloadApp' })
//        }, 2100)
      },
      goDetail (detail) {
        // contentId=1a822968-ced1-4be7-a6a9-1eb8ff75dbe1&sceneAccountId=1fcabef9-650b-4cb4-b6e1-f82609f6f20b&contentShowType=gallery
        this.$router.push({ path: '/articleShow', query: {'contentId': detail.id, 'sceneAccountId': this.sceneaccounts.id, 'contentShowType': detail.contentShowType} })
      },
      onScroll () {
        let scrollHeight = window.pageYOffset // 滚动的高度
        if (this.$refs.header) {
          let headerHeight = this.$refs.header.offsetHeight // 头高度
          if (scrollHeight >= headerHeight) {
            this.changeHeader = true
            this.homePageTitle = this.sceneaccounts.title
          } else {
            this.changeHeader = false
            this.homePageTitle = ''
          }
        }
      },
      homePageData () {
        // 更新数据
        var _self = this
        _self.sceneAccountId = _self.$route.query.sceneAccountId ? _self.$route.query.sceneAccountId : _self.sceneAccountId
        _self.curUsrId = _self.curUsrId ? _self.curUsrId : 'f14807da-56dc-4546-8378-61a1a9eb4266'
        this.$http.get(_self.$host + '/gateway/delegate/sceneaccounts/' + _self.sceneAccountId, {
          headers: {
            guid: _self.curUsrId
          }
        })
        .then(function (response) {
          // console.log(response.data.visitType === 'keyword')
          if (response.data.tags) {
            response.data.tags = JSON.parse(response.data.tags)
          }
          _self.$data.keyData = response.data
          const lsKeyWord = window.sessionStorage.getItem('ls-keyword')
          if (response.data.visitType === 'keyword' && (!lsKeyWord || lsKeyWord !== _self.sceneAccountId)) {
            _self.keywordFlag = false
          } else {
            _self.keywordFlag = true
            _self.$data.sceneaccounts = response.data
            if (_self.$data.sceneaccounts.contents) {
              _self.$data.noDataFlag = false
            } else {
              _self.$data.noDataFlag = true
            }
            if (response.data.contents.totalCount === response.data.contents.contentBlocks.length) {
              _self.allLoaded = true // 若数据已全部获取完毕
            }
          }
          _self.maidianEvn()
        })
        .catch(function (error) {
          console.log(error)
          _self.$data.noDataHead = false
          _self.$data.noDataFlag = true
        })
        this.wechatEvn()
      },
      homePageLoadMore () {
        // 加载更多数据
        var _self = this
        this.$http.get(_self.$host + '/gateway/delegate/sceneaccounts/' + _self.sceneAccountId + '/contents/?count=10&start=1', {
          headers: {
            guid: 'f14807da-56dc-4546-8378-61a1a9eb4266'
          }
        })
        .then(function (response) {
          if (response.data.totalCount === _self.$data.sceneaccounts.contents.contentBlocks.length) {
            _self.allLoaded = true // 若数据已全部获取完毕
          } else {
            Array.prototype.push.apply(_self.$data.sceneaccounts.contents.contentBlocks, response.data.contentBlocks)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      clickKeyword (msg) {
        this.keywordFlag = msg.verify
        if (msg.verify) {
          // localStorage 存储数据
          window.sessionStorage.setItem('ls-keyword', msg.sceneAccountId)
          this.$data.sceneaccounts = this.$data.keyData
          if (this.$data.sceneaccounts.contents) {
            this.$data.noDataFlag = false
          } else {
            this.$data.noDataFlag = true
          }
        }
        this.wechatEvn()
        this.maidianEvn()
      },
      wechatEvn () {
        // console.log('wechatEvn')
        var _self = this
        var sharInfoUrl = _self.sharInfo.replace('{url}', window.encodeURIComponent(window.location.href)).replace('{targetType}', 'sceneaccount').replace('{targetId}', _self.sceneAccountId)
        _self.$http.get(_self.$host + sharInfoUrl, {
          headers: {
            guid: _self.curUsrId
          }
        }).then(function (response) {
          // console.log(response.data)
          /* eslint-disable */
          wx.config({
            appId: response.data.appId, // 必填，公众号的唯一标识
            timestamp: response.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: response.data.nonceStr, // 必填，生成签名的随机串
            signature: response.data.signature, // 必填，签名，见附录1
            jsApiList: [
              'checkJsApi',
              'onMenuShareTimeline',
              'onMenuShareAppMessage'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })
          wx.ready(function () {
            wx.onMenuShareTimeline({
              title: response.data.title, // 分享标题
              desc: response.data.desc, // 分享描述
              link: response.data.link, // 分享链接
              imgUrl: response.data.imgUrl, // 分享图标
              success: function () {
                // 用户确认分享后执行的回调函数
              },
              cancel: function () {
                // 用户取消分享后执行的回调函数
              }
            })
            wx.onMenuShareAppMessage({
              title: response.data.title, // 分享标题
              desc: response.data.desc, // 分享描述
              link: response.data.link, // 分享链接
              imgUrl: response.data.imgUrl, // 分享图标
              type: 'link', // 分享类型,music、video或link，不填默认为link
              success: function () {
                // 用户确认分享后执行的回调函数
              },
              cancel: function () {
                // 用户取消分享后执行的回调函数
              }
            })
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
          })
          /* eslint-enable */
        }).catch(function (error) {
          console.log(error)
        })
      },
      maidianEvn () {
        var _self = this
        // console.log(_self.$data.sceneaccounts)
        var tagsStr = ''
        if (_self.$data.sceneaccounts.tags) {
          for (var tagsIndex = 0, tagsLen = _self.$data.sceneaccounts.tags.length; tagsIndex < tagsLen; tagsIndex++) {
            tagsStr += _self.$data.sceneaccounts.tags[tagsIndex].name + '/'
          }
          tagsStr = tagsStr.slice(0, tagsStr.length - 1)
        }
        var scencePageMapKv = {'场景号tag': tagsStr, '场景号名称': _self.$data.sceneaccounts.title, '场景号作者': _self.$data.sceneaccounts.publisher.nickname, '场景名称': _self.$data.sceneaccounts.sceneTitle}
        /* eslint-disable */
        TDAPP.onEvent('查看场景号主页', '场景号主页详情', scencePageMapKv)
        /* eslint-enable */
      }
    },
    created () {
      window.addEventListener('scroll', this.onScroll)
      let _self = this
      if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
        _self.getJsBridge()
        // 获取用户登录信息
        var u = navigator.userAgent.toLowerCase()
        if (/(iphone|ipad|ipod|ios)/i.test(u)) {
          window.setupWebJsBridge(function (bridge) {
            bridge.callHandler('getUserStatus', null, function (response) {
              if (response.login) {
                _self.curUsrId = response.memberId
              }
              _self.homePageData()
            })
          })
        }
        window.connWebJsBridge(function (bridge) {
          bridge.callHandler('getUserStatus', null, function (response) {
            var resObj = JSON.parse(response)
            if (resObj.login) {
              _self.curUsrId = resObj.memberId
            }
            _self.homePageData()
          })
        })
      } else {
        let userGuidH5 = _self.$getCookie('guid')
        if (userGuidH5) {  // 判断是否登录
          _self.curUsrId = userGuidH5
        }
        _self.homePageData()
      }
      // this.homePageData()
    },
    components: {
      visitPassword
    }
  }
</script>

<style lang="sass" scoped>
  /* 头部样式 */
  .header {
    overflow: hidden;
    /*background: url(/src/assets/homePage/homeBackImg.png) no-repeat;*/
    /*width: 720px;*/
    background-repeat:no-repeat !important;
    background-size:100% 100% !important;
    -moz-background-size:100% 100% !important;
    color: #fff;
    padding-left: 30px;
    height:360px;
    position:relative;
    .bg-moce {
      position:absolute;
      width:100%;
      height:100%;
      left:0;
      background-color:rgba(0, 0, 0, 0.2);
    }
    .head-cont {
      position:absolute;
      padding-left: 30px;
      left:0;
      top:0;
    }
    .title {
      margin-top: 96px;
      display: block;
      height: 70px;
      font-size: 50px;
      font-family: PingFangSC-Semibold;
      color: rgba(255, 255, 255, 1);
      line-height: 70px;
      margin-bottom: 16px;
      word-break:break-all;
      width:690px;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap
    }

    .address-img {
      display: inline-block;
      width: 26px;
      height: 26px;
      margin-right: 16px;
    }

    .address {
      display: inline-block;
      height: 42px;
      font-size: 30px;
      font-family: PingFangSC-Medium;
      color: rgba(255, 255, 255, 1);
      line-height: 42px;
      margin-right: 30px;
    }

    .tag {
      width: 234px;
      height: 37px;
      font-size: 26px;
      font-family: PingFangSC-Regular;
      color: rgba(255, 255, 255, 1);
      line-height: 37px;
    }
  }
  .margin-bottom{
    margin-bottom: 22px;
  }

  /* 临时添加 */
  .navbar-temp{
    height: 90px;
    display:flex;
    display:-webkit-flex;
    box-sizing: border-box;
    background-color:#fff;
    margin-bottom:22px;
    .nav-temp-item{
      position: relative;
      flex: 1;
      font-size: 34px;
      text-align: center;
      line-height: 90px;
      height: 90px;
      &.nti-active{
        color: #8975F6;
       }
    }
    .bottom-line{
      width: 30%;
      height: 3px;
      background-color: #8975f6;
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      bottom: 1px;
      border-radius: 3px;
    }
  }
  /* 密码框弹层 */
  .keywordBox {
    position:fixed;
    top:0;
    right:0;
    bottom:0;
    left:0;
    z-index:999;
    background-color:rgba(0, 0, 0, 0.6);
  }
  /* 无内容 */
  .no-data-box {
    text-align:center;
    .no-data-img {
      width:340px;
      height:340px;
      margin-top:100px;
      margin-bottom:20px;
    }
    .no-data-txt {
      font-size:30px;
      color:#666;
    }
  }
</style>
