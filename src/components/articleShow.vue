<template>
  <div class='articleShowBox'>
    <!-- 文章详情页 -->
    <article-detail v-if="contentShowType === 'article' && noDataFlag === false" :pageShow="pageShow" :datumJson="datumJson" :lsUser="lsUser" :headFlag="headFlag" @goAppHomePage="toAppHomePage" :contTitle="contTitle" :likesObj="likesObj" :getLikesData="getLikesData" :commentCountData="commentCountData" :sceneAccountId="sceneAccountId" :followType="followType" :followAction="followAction" @sendFollowMsg= "sendFollowMsg" :isEditFlag="isEditFlag" :isEditCont="isEditCont"></article-detail>
    <!-- 图集详情 -->
    <atlas-detail v-if="contentShowType === 'gallery' && noDataFlag === false" :pageShow="pageShow" :datumJson="datumJson" :mainLen="mainLen" :lsUser="lsUser" :headFlag="headFlag" :headContFlag="headContFlag" @goAppscence="toAppScen" :likesObj="likesObj" :getLikesData="getLikesData" :commentCountData="commentCountData" :sceneAccountId="sceneAccountId" :followType="followType" :followAction="followAction" @sendFollowMsg= "sendFollowMsg"></atlas-detail>
    <!-- 投票详情 -->
    <vote-detail v-if="contentShowType === 'vote' && noDataFlag === false" :pageShow="pageShow" :datumJson="datumJson" :additionProps="additionProps" :lsUser="lsUser" :headFlag="headFlag" :headContFlag="headContFlag" @goAppHomePage="toAppHomePage" @getList="getList" :sceneAccountId="sceneAccountId" :followType="followType" :followAction="followAction" @sendFollowMsg= "sendFollowMsg"></vote-detail>

    <div v-if="keywordFlag === false && noDataFlag === false" class="keywordBox">
      <visit-password :sceneAccountId="sceneAccountId" @clickKeyword="clickKeyword"></visit-password>
    </div>
    <div v-if="noDataFlag" class="no-data-box">
      <img src="data:image/png;base64,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" class="no-data-img" alt="">
      <p class="no-data-txt">内容已被删除</p>
    </div>
  </div>
</template>

<script>
  import visitPassword from '@/components/visitPassword'
  const atlasDetail = () => import('@/components/article/atlasDetail')
  const articleDetail = () => import('@/components/article/articleDetail')
  const voteDetail = () => import('@/components/article/voteDetail')

  export default {
    name: 'articleShow',
    data () {
      return {
        'curUsrId': '', // 获取用户guid
        'sharInfo': '/gateway/delegate/share/sign?url={url}&channel=wechat&targetType={targetType}&targetId={targetId}', // 微信分享用
        'headFlag': true,
        'headContFlag': 88,
        'contentShowType': '',
        'pageShow': {},
        'datumJson': {},
        'additionProps': {}, // 投票详情状态信息
        'isEditFlag': true, // 判断复文本编辑器版本
        'isEditCont': '',
        'lsUser': {},
        'mainLen': '',
        'contTitle': '',
        'sceneAccountId': this.$route.query.sceneAccountId,
        'requestType': this.$route.query.requestType,
        'keywordFlag': true, // 判断是否调用密码
        'keyData': {}, // 用于暂时存储获取到的数据
        'noDataFlag': false,
        'likesObj': {
          'likesFlag': '',
          'likesId': this.$route.query.contentId
        }, // 用于存储点赞信息
        'getLikesData': {
          'count': 0,
          'flag': false,
          'canShow': false
        },
        'commentCountData': {
          'commentCount': 0
        },
        'followAction': '',
        'followType': '',
        'userTitleMsg': {}
      }
    },
    components: {
      articleDetail,
      atlasDetail,
      visitPassword,
      voteDetail
    },
    created () {
      this.contentShowType = this.$route.query.contentShowType
      this.sceneAccountId = this.$route.query.sceneAccountId ? this.$route.query.sceneAccountId : this.sceneAccountId
      // 判断打开是否为LSapp
      let _self = this
      if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
        this.getJsBridge()
        this.headFlag = false
        this.headContFlag = 0
        window.sessionStorage.setItem('ls-keyword', this.sceneAccountId)

        // 获取用户登录信息
        var u = navigator.userAgent.toLowerCase()
        if (/(iphone|ipad|ipod|ios)/i.test(u)) {
          window.setupWebJsBridge(function (bridge) {
            bridge.callHandler('getUserStatus', null, function (response) {
              if (response.login) {
                _self.curUsrId = response.memberId
              }
              _self.getList()
            })
          })
        }
        window.connWebJsBridge(function (bridge) {
          bridge.callHandler('getUserStatus', null, function (response) {
            var resObj = JSON.parse(response)
            if (resObj.login) {
              _self.curUsrId = resObj.memberId
            }
            _self.getList()
          })
        })
      } else {
        let userGuidH5 = _self.$getCookie('guid')
        if (userGuidH5) {  // 判断是否登录
          _self.curUsrId = userGuidH5
        }
        _self.getList()
      }
      window.addEventListener('scroll', this.onScrollTitle)
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
      getListUrl () {
        var _self = this
        let curUsrId = _self.curUsrId || 'f14807da-56dc-4546-8378-61a1a9eb4266'

        let memberVoteResult = _self.$route.query.memberVoteResult
        // memberVoteResultUrl 接口访问入口: '我的' - '我的主页' - '投票' - '查看投票结果'
        let memberVoteResultUrl = _self.$host + '/gateway/members/' + curUsrId + '/sceneaccounts/' + _self.$route.query.sceneAccountId + '/contents/' + _self.$route.query.contentId + '/voteResult'
        let memberUrl = _self.$host + '/gateway/members/' + curUsrId + '/sceneaccounts/' + _self.$route.query.sceneAccountId + '/contents/' + _self.$route.query.contentId
        let delegateUrl = _self.$host + '/gateway/delegate/sceneaccounts/' + _self.$route.query.sceneAccountId + '/contents/' + _self.$route.query.contentId
        let url = ''

        if (memberVoteResult && memberVoteResult === '1') {
          url = memberVoteResultUrl
        } else {
          _self.$route.query.requestType === 'members' ? url = memberUrl : url = delegateUrl
        }
        return url
      },
      getList () {
        var _self = this
        let curUsrId = this.curUsrId || 'f14807da-56dc-4546-8378-61a1a9eb4266'
        _self.$http.get(_self.getListUrl(), {
          headers: {
            guid: curUsrId
          }
        })
        .then(function (response) {
          _self.$data.keyData = response.data
          // 存储点赞信息
          _self.getLikesData.count = response.data.likeCount
          _self.getLikesData.canShow = true
          // 存储评论数量
          _self.commentCountData.commentCount = response.data.commentCount
          if (Number(response.data.isLiked)) {
            _self.getLikesData.flag = true
          } else {
            _self.getLikesData.flag = false
          }
          // 存储评论数量
          _self.commentCountData.commentCount = response.data.commentCount
          const lsKeyWord = window.sessionStorage.getItem('ls-keyword')
          if (response.data.visitType === 'keyword' && (!lsKeyWord || lsKeyWord !== _self.$route.query.sceneAccountId)) {
            _self.keywordFlag = false
          } else {
            _self.keywordFlag = true
            _self.$data.pageShow = response.data
            _self.$data.datumJson = JSON.parse(_self.$data.pageShow.datum)
            // 投票详情状态信息
            if (_self.$data.datumJson.additionProps) {
              _self.$data.additionProps = _self.$data.datumJson.additionProps
            }
            // 新版富文本
            if (!_self.$data.datumJson.detailContent) {
              _self.$data.mainLen = _self.$data.datumJson.mainContent.length
              for (var i = 0; i < _self.$data.datumJson.mainContent.length; i++) {
                if (_self.$data.datumJson.mainContent[i].type === 'map') {
                  _self.$data.datumJson.mainContent[i].matter = JSON.parse(_self.$data.datumJson.mainContent[i].matter)
                }
              }
            }
            _self.$data.lsUser = response.data.publisher
            // 场景是否为随笔
            _self.isDefaultSceneAccount = response.data.isDefaultSceneAccount
            // 存储关注状态
            _self.$data.followAction = response.data.isSceneAccountFollowed
            _self.$data.followAction === '1' ? _self.$data.followType = 'followed' : _self.$data.followType = 'notFollowed'
            // 存储title信息    userTitleMsg
            _self.userTitleMsg.isDefaultSceneAccount = _self.pageShow.isDefaultSceneAccount   // 是否为随笔
            _self.userTitleMsg.isSceneAccountFollowed = _self.followAction    // 是否关注
            _self.userTitleMsg.sceneAccountId = _self.pageShow.sceneAccountId  // 场景号ID
            _self.userTitleMsg.sceneAccountTitle = _self.pageShow.sceneAccountTitle   // 场景名称
            _self.userTitleMsg.nickname = _self.pageShow.publisher.nickname   // 创建用户
            _self.userTitleMsg.headImg = _self.pageShow.publisher.headImg || ''   // 创建用户的头像
            _self.userTitleMsg.displayTime = _self.pageShow.displayTime   // 创建时间
            _self.sendTitleMsgToApp(_self.userTitleMsg)
            // 存储详情内容
            _self.$data.pageShow.datum = _self.$data.datumJson
          }
          // 测试 新版本复文本编辑器
          if (_self.$data.datumJson.detailContent && _self.keywordFlag) {
            _self.isEditFlag = false
            _self.isEditCont = _self.$data.datumJson.detailContent.replace(/>\s{0,2}\n{0,2}\s{0,2}\n{0,2}\s{0,2}<br>/g, '>').replace(/>\s{0,2}\n{0,2}\s{0,2}\n{0,2}\s{0,2}<br>/g, '>')
            // .replace(/&lrm;/g, '').replace(/‎/g, '') // 筛选掉ios编辑器文章是产生的意外字符
            // .replace(/>\s{0,2}\n{0,2}\s{0,2}<br>/g, '>')
          } else {
            // console.log(_self.$data.datumJson.detailContent)
          }
        })
        .catch(function (error) {
          console.log(error)
          _self.$data.noDataFlag = true
        })
        this.wechatEvn()
      },
      toAppScen () { // 跳到app中场景号主页 20180403
        var _self = this
        // console.log(_self.$route.query.sceneAccountId)
        window.connWebJsBridge(function (bridge) {
          bridge.callHandler('push', {
            router: 'LSSceneAccountHomePage',
            options: {'sceneAccountId': _self.$route.query.sceneAccountId}
          })
        })
      },
      toAppHomePage (memberid) { // 跳到app中的个人主页 20180620
        // console.log(memberid)
        window.connWebJsBridge(function (bridge) {
          bridge.callHandler('push', {
            router: 'LSUserHomePage',
            options: {'memberId': memberid}
          })
        })
      },
      clickKeyword (msg) {
        var _self = this
        this.keywordFlag = msg.verify
        if (msg.verify) {
          // localStorage 存储数据
          window.sessionStorage.setItem('ls-keyword', msg.sceneAccountId)
          this.$data.pageShow = this.$data.keyData
          this.$data.datumJson = JSON.parse(this.$data.pageShow.datum)
          // this.$data.mainLen = this.$data.datumJson.mainContent.length
          this.$data.lsUser = this.$data.pageShow.publisher
          // for (var i = 0; i < this.$data.mainLen; i++) {
          //   // console.log(this.$data.datumJson.mainContent[i])
          //   if (this.$data.datumJson.mainContent[i].type === 'map') {
          //     this.$data.datumJson.mainContent[i].matter = JSON.parse(this.$data.datumJson.mainContent[i].matter)
          //   }
          // }
          // /* BEGIN 新内容 */
          if (!_self.$data.datumJson.detailContent) { // 新版富文本
            _self.$data.mainLen = _self.$data.datumJson.mainContent.length
            for (var i = 0; i < _self.$data.datumJson.mainContent.length; i++) {
              if (_self.$data.datumJson.mainContent[i].type === 'map') {
                _self.$data.datumJson.mainContent[i].matter = JSON.parse(_self.$data.datumJson.mainContent[i].matter)
              }
            }
          }
          // 场景是否为随笔
          _self.isDefaultSceneAccount = _self.$data.keyData.isSceneAccountFollowed
          // 存储关注状态
          _self.$data.followAction = _self.$data.keyData.isSceneAccountFollowed
          _self.$data.followAction === '1' ? _self.$data.followType = 'followed' : _self.$data.followType = 'notFollowed'
          // 存储title信息
          _self.userTitleMsg.sceneAccountId = _self.pageShow.sceneAccountId
          _self.userTitleMsg.displayTime = _self.pageShow.displayTime
          if (_self.$data.followAction === '1') {
            _self.userTitleMsg.isSceneAccountFollowed = _self.followAction
            _self.userTitleMsg.nickname = _self.pageShow.publisher.nickname
            _self.userTitleMsg.headImg = _self.pageShow.publisher.headImg || ''
          } else {
            _self.userTitleMsg.isSceneAccountFollowed = _self.followAction
            _self.userTitleMsg.sceneAccountTitle = _self.pageShow.sceneAccountTitle
          }
          _self.$data.pageShow.datum = _self.$data.datumJson
          _self.sendTitleMsgToApp(_self.userTitleMsg)
          // /* END 新内容 */
          // this.$data.pageShow.datum = this.$data.datumJson
          // 新版本复文本编辑器
          if (_self.$data.datumJson.detailContent) {
            _self.isEditFlag = false
            _self.isEditCont = _self.$data.datumJson.detailContent
          }
        }
        this.wechatEvn()
      },
      // 修改title信息
      sendFollowMsg (data) {
        let _self = this
        let userTitleMsg = _self.userTitleMsg

        if (data.followAction === '1') {
          _self.followAction = '0'
          _self.followType = 'notFollowed'
          userTitleMsg.isSceneAccountFollowed = _self.followAction
        } else {
          _self.followAction = '1'
          _self.followType = 'followed'
          userTitleMsg.isSceneAccountFollowed = _self.followAction
        }
      },
      // 与app交互title信息
      sendTitleMsgToApp (data) {
        // 判断是否在app中
        if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
          // 获取用户登录信息
          var u = navigator.userAgent.toLowerCase()
          if (/(iphone|ipad|ipod|ios)/i.test(u)) {
            window.setupWebJsBridge(function (bridge) {
              bridge.callHandler('setTitle', data, function (response) {})
            })
          }
          window.connWebJsBridge(function (bridge) {
            bridge.callHandler('setTitle', data, function (response) {})
          })
        }
      },
      wechatEvn () {
        var _self = this
        var curUsrId = _self.curUsrId || 'f14807da-56dc-4546-8378-61a1a9eb4266'
        var sharInfoUrl = _self.sharInfo.replace('{url}', window.encodeURIComponent(window.location.href)).replace('{targetType}', 'content').replace('{targetId}', _self.$route.query.contentId)
        _self.$http.get(_self.$host + sharInfoUrl, {
          headers: {
            guid: curUsrId
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
      }
    },
    updated () {
      // var articleBoxObj = document.getElementsByClassName('articleContentBox')[0]
      // // console.log(articleBoxObj.clientHeight)
      // if (articleBoxObj.clientHeight < 100) {
      //   this.$router.go(0)
      // }
    }
  }
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="sass">
  .articleShowBox {
    width: 100%;
    /*height: 100%;*/
    /*overflow: scroll;*/
    background-color:#fff;
    word-break: normal;
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
