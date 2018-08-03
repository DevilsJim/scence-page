<template>
  <div class="discuss-list-box">
    <ls-header :opaque = 'true' title='评论详情' fixed v-if="headFlag">
      <div slot='left'>
        <mt-button icon='back' @click='goBack'></mt-button>
      </div>
      <mt-button slot = 'right'></mt-button>
    </ls-header>

    <div class="discuss-cont-box">
      <div v-if="headFlag" class="head-fixed"></div>
      <!-- import引入用户信息组件 -->
      <div class="user-bot">
        <ls-user v-if="pageShow.publisher" type="comment-detail" :createDate="pageShow.displayTime" :nickName="pageShow.publisher.nickname" :avatar="pageShow.publisher.headImg" @goAppHomePage="goAppHomePageEvn(pageShow.publisher.id)"></ls-user>
        <p class="content">{{pageShow.content}}</p>
      </div>
      <div class="cont-list-div" v-if="!(noDataFlag)">
        <div class="cont-list">
          <span class="all-comment">全部回复</span><span class="all-comment-count">共 {{pageShow.replyTotalCount}} 条</span>
          <div class="discuss-article-list-box" v-for="(item, index) in replies">
            <ls-user v-if="item.publisher" type="comment-replay" :createDate="item.displayTime" :nickName="item.publisher.nickname" :avatar="item.publisher.headImg" @goAppHomePage="goAppHomePageEvn(item.publisher.id)"></ls-user>
            <discuss-user-likes class="discuss-user-likes-box" :userSpeakObj="{'userGuid': item.publisher.id}" :userLikesObj="{'likesFlag': curUsrId, 'likesId': item.id}" :userGetLikesData="{'count': item.likeCount, 'flag': Number(item.isLiked) ? true : false, 'canShow': true}" :userSpeakCount="item.replyTotalCount" @userListSpeak="userListSpeakEvn(index)" :isDiscussArticle="isDiscussArticle"></discuss-user-likes>
            <p class="content" @click.stop = "showActionSheet(index)"><em v-if="item.replyId && item.replyId != pageShow.publisher.id">回复@{{item.replyName}}：</em>{{item.content}}</p>
          </div>
        </div>
        <div class="more" v-if="dataContFlag" ref="clickGetMoreData" @click="getDiscussBottomSpace()">点击加载更多</div>
        <div class="more" ref="clickGetData" @click="getNoData" v-else>没有更多评论啦</div>
      </div>
      <!-- 缺省页面 -->
      <div v-if="noDataFlag" class="no-data-box">
        <img src="data:image/png;base64,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" class="no-data-img" alt="">
        <p class="no-data-txt" v-if="noDataFlag">暂时没人回复，快抢沙发吧</p>
      </div>
    </div>
    <!-- import引入input组件 -->
    <input-comment-mask :inputCommentSize="inputCommentSize" :likesObj="likesObj" :getLikesData="getLikesData" :commentCountData="commentCountData" :commentCount="pageShow.commentCount" :userSpeakClick="userSpeakClickData" v-bind:userToSpeak="userToSpeak" :userSpeakInfo="userSpeakInfo" @speakSuccessData="speakSuccessDataEvn" :discussArticleUser="discussArticleUser" :discussArticleUserInfo="discussArticleUserInfo" @userListSpeakInputBlur="userListSpeakInputBlurEvent()"></input-comment-mask>
    <!-- import引入actionSheet组件 -->
    <action-sheet ref="sheetBoxs" :menuInfo="menuInfo" @speakSuccessData="speakSuccessDataEvn" @userListSpeak="userListSpeakMenuEvn()"></action-sheet>
  </div>
</template>

<script>
  import inputCommentMask from '@/components/input/inputCommentMask'
  import actionSheet from '@/components/actionSheet/actionSheet'
  import discussUserLikes from '@/components/input/discussUserLikes'

  export default {
    name: 'discussArticle',
    data () {
      return {
        'headFlag': true,
        'headContFlag': 88,
        'speakScrollTop': 0, // 记录滚动高度
        'contentShowType': '',
        'pageShow': {},
        'replies': [],
        'curUsrId': '', // 获取app登录的用户ID
        'mainLen': '',
        'contTitle': '',
        'comments': [],
        'commentId': this.$route.query.commentId,
        'inputCommentSize': {
          'isTwoIcon': false
        },
        'likesObj': {
          'likesFlag': '',
          'likesId': ''
        }, // 用于存储点赞信息
        'getLikesData': {
          'count': 0,
          'flag': false,
          'canShow': false
        },
        'commentCountData': {
          'commentCount': 0
        },
        'discussArticleUser': true, // 是否是评论详情页
        'discussArticleUserInfo': {}, // 评论详情用户信息
        'userSpeakClickData': false,
        'userToSpeak': false,
        'userSpeakInfo': {}, // 回复的用户名及id
        'userLikesObj': {},
        'userGetLikesData': {},
        'userSpeakObj': {},
        'dataCont': 1,
        'dataContFlag': true,
        'dataContInt': true, // 该变量判断是点击 产看更多还是 发布评论成功回调
        'isDiscussArticle': true, // 评论详情页
        'menuInfo': {},
        'noDataFlag': false
      }
    },
    components: {
      inputCommentMask,
      actionSheet,
      discussUserLikes
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
      getArticleData () {
        var _self = this
        _self.curUsrId = _self.curUsrId ? _self.curUsrId : 'f14807da-56dc-4546-8378-61a1a9eb4266'
        // /gateway/delegate/comments/{comment_id}
        _self.$http.get(_self.$host + '/gateway/delegate/comments/' + _self.commentId, {
          headers: {
            guid: _self.curUsrId
          }
        }).then(function (response) {
          // alert(JSON.stringify(response.data))
          // console.log(response.data)
          _self.discussArticleUserInfo.name = response.data.publisher.nickname
          _self.discussArticleUserInfo.guid = response.data.publisher.id
          _self.discussArticleUserInfo.id = response.data.id
          // _self.discussArticleUserInfo.userId = _self.curUsrId
          _self.getLikesData.count = response.data.likeCount
          _self.getLikesData.canShow = true
          _self.commentCountData.commentCount = response.data.commentCount ? response.data.commentCount : 0
          _self.likesObj.likesId = response.data.id
          _self.comments = response.data.replies
          if (Number(response.data.isLiked)) {
            _self.getLikesData.flag = true
          } else {
            _self.getLikesData.flag = false
          }
          // 获取评论详情数据
          _self.$data.pageShow = response.data
          _self.$data.replies = response.data.replies
          // 判断时候查看更多
          if (response.data.replyTotalCount > 20 && response.data.replies.length === 20) {
            _self.dataCont ++
          } else {
            _self.dataContFlag = false
          }
          if (response.data.replies.length) {
            _self.noDataFlag = false
          } else {
            _self.noDataFlag = true
          }
          document.body.scrollTop = _self.speakScrollTop
        }).catch(function (error) {
          // alert(JSON.stringify(error.response.data))
          console.log(error)
          if (error.response.data.errorCode === 999) {
            _self.noDataFlag = true
          }
        })
      },
      userListSpeakEvn (index) {
        // console.log(document.getElementById('inputFocusSpeak'))
        // console.log(this.comments[index].publisher.nickname)
        this.speakScrollTop = document.body.scrollTop
        this.userSpeakInfo.name = this.comments[index].publisher.nickname
        this.userSpeakInfo.guid = this.comments[index].publisher.id
        this.userSpeakInfo.id = this.comments[index].id
        this.userToSpeak = true
        // this.userSpeakClickData = 'userToUser'
        if (this.userSpeakClickData) {
          this.userSpeakClickData = false
        } else {
          this.userSpeakClickData = true
        }
      },
      userListSpeakMenuEvn () {
        this.userListSpeakEvn(this.menuInfo.index)
      },
      userListSpeakInputBlurEvent () {
        this.userToSpeak = false
      },
      speakSuccessDataEvn () {
        this.dataCont = 1
        this.userToSpeak = false
        this.dataContFlag = true
        this.getArticleData()
      },
      getDiscussBottomSpace () {
        this.dataContInt = false
        this.getMoreData()
      },
      getMoreData () {
        var _self = this
        _self.$http.get(_self.$host + '/gateway/delegate/comments?targetId=' + _self.commentId + '&targetType=comment&count=20&start=' + _self.dataCont, {
          headers: {
            guid: _self.curUsrId
          }
        }).then(function (response) {
          // 判断时候查看更多
          if (response.data.totalCount > 20 && response.data.comments.length === 20) {
            _self.dataCont ++
          } else {
            _self.dataContFlag = false
          }
          _self.$data.replies = _self.$data.replies.concat(response.data.comments)
          _self.comments = _self.$data.replies
        }).catch(function (error) {
          console.log(error)
        })
      },
      getNoData () {
        var _self = this
        _self.$refs.clickGetData.innerHTML = '正在加载...'
        setTimeout(function () {
          _self.$refs.clickGetData.innerHTML = '没有更多评论啦'
          // _self.dataContInt = false
          // _self.getArticleData()
        }, 1000)
      },
      linkToIndex () {
        // 判断打开是否为LSapp
        if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
          this.$parent.$emit('goAppscence', '111')
        } else {
          this.$router.push({ path: '/', query: { 'sceneAccountId': this.pageShow.sceneAccountId } })
        }
      },
      goAppHomePageEvn (memberid) { // 跳到app中的个人主页 20180620
        // console.log(memberid)
        // 判断打开是否为LSapp
        if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
          window.connWebJsBridge(function (bridge) {
            bridge.callHandler('push', {
              router: 'LSUserHomePage',
              options: {'memberId': memberid}
            })
          })
        } else {
          window.localStorage.setItem('toUserPageUrl', window.location.href)
          // this.$router.push({ path: '/', query: { 'sceneAccountId': this.pageShow.sceneAccountId } })
          this.$router.push({ path: '/userPage', query: { 'memberid': memberid } })
        }
      },
      goBack () {
        document.getElementById('inputFocusSpeak').blur()
        this.$router.go(-1)
        // this.$router.isBack = true
        // this.$router.push({path: '/', query: {sceneAccountId: this.pageShow.sceneAccountId}})
      },
      // 点击显示上拉菜单
      showActionSheet (index) {
        let _self = this
        // console.log(index)
        _self.$refs.sheetBoxs.$el.style.display = 'block'
        _self.menuInfo.index = index
        _self.menuInfo.id = _self.comments[index].id
        _self.menuInfo.publisherGuid = _self.comments[index].publisher.id
        _self.menuInfo.userId = _self.curUsrId
        _self.menuInfo.targetType = _self.comments[index].targetType

        if (_self.menuInfo.publisherGuid === _self.menuInfo.userId) {
          document.getElementById('reply').style.display = 'none'
          document.getElementById('delete').style.display = 'block'
          _self.menuInfo.userFlag = true // 记录登录用户和点击评论用户id是否相等
        } else {
          document.getElementById('delete').style.display = 'none'
          document.getElementById('reply').style.display = 'block'
          _self.menuInfo.userFlag = false
        }
      }
    },
    created () {
      // 更新数据
      var _self = this
      // document.title = '评价详情'
      if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
        _self.getJsBridge()
        _self.headFlag = false
        // 获取用户登录信息
        var u = navigator.userAgent.toLowerCase()
        if (/(iphone|ipad|ipod|ios)/i.test(u)) {
          window.setupWebJsBridge(function (bridge) {
            bridge.callHandler('getUserStatus', null, function (response) {
              if (response.login) {
                _self.curUsrId = response.memberId
              }
              _self.getArticleData()
            })
          })
        }
        window.connWebJsBridge(function (bridge) {
          bridge.callHandler('getUserStatus', null, function (response) {
            var resObj = JSON.parse(response)
            if (resObj.login) {
              _self.curUsrId = resObj.memberId
            }
            _self.getArticleData()
          })
        })
      } else {
        let userGuidH5 = _self.$getCookie('guid')
        if (userGuidH5) {  // 判断是否登录
          _self.curUsrId = userGuidH5
        }
        _self.getArticleData()
      }
    }
  }
</script>

<style scoped lang="sass" type="text/css">
  .discuss-list-box.Router {
    width: 100%;
    height: auto;
    background-color:#fff;
  }
  .discuss-cont-box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    padding:0 30px 130px 30px;
    background-color: #fff;
    .head-fixed {
      height:88px;
      background: #fff;
    }
    .user-bot {
      padding-bottom: 60px;
      border-bottom:1px solid #ebebeb;/*no*/
    }
    .content{
      font-size:28px;
      color:#222;
      margin-left: 100px;
    }
    .cont-list{
      padding-top: 29px;
      .all-comment{
        color: #3C3C3C;
        font-size: 30px;
        font-family:PingFangSC-Medium;
        color:rgba(60,60,60,1);
      }
      .all-comment-count{
        font-size:24px;
        font-family:PingFangSC-Regular;
        color:rgba(102,102,102,1);
        margin-left: 20px;
      }
      .discuss-article-list-box {
        position:relative;
        .user-wrap{
          padding: 40px 0 20px;
        }
        .discuss-user-likes-box {
          position:absolute;
          right:40px;
          top:40px;
        }
        .content{
          padding-bottom: 40px;
          word-break: break-all;
          border-bottom: 1px solid #ebebeb; /*no*/
          em{
            font-size:28px;
            color: #2e2e2e;
          }
        }
        &:last-child{
          .content{
            border-bottom: none;
          }
        }
      }
    }
    .more{
      height: 80px;
      width: 100%;
      text-align: center;
      color: #666;
      line-height: 80px;
      font-size: 24px;
    }
  }
  /* 无内容 */
  .no-data-box {
    padding-top:50px;
    text-align:center;
    .no-data-img {
      width:420px;
      height:310px;
      margin-top:-30px;
      margin-bottom:89px;
    }
    .no-data-txt {
      font-size:30px;
      color:#999;
    }
  }
</style>
