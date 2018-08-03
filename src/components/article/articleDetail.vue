<template>
  <div class='articleDetailBox' ref="artBox">
    <!-- import引入headDetail组件 -->
    <ls-header-detail v-if='headFlag' :opaque = 'true' fixed :lsUser='lsUser' :pageShow='pageShow' :followType='followType' :isDisplayFollow="isDisplayFollow" @followedScene= "followedScene">
      <div slot='left'>
        <mt-button icon='back' @click='goBack'></mt-button>
      </div>
      <mt-button slot = 'right'></mt-button>
    </ls-header-detail>
    <!-- import引入articleContent组件 -->
    <article-content v-if='pageShow' :articleContentSize='articleContentSize' :pageShow='pageShow' :datumJson="datumJson" :lsUser="lsUser" :followType="followType" @followedScene= "followedScene" @onScrollTitle="onScrollTitle" :isEditFlag="isEditFlag" :isEditCont="isEditCont"></article-content>
    <!-- 引用高德地图 -->
    <!-- <map-content :center="center" :zoom="zoom" :events="events" :scencePage="scencePage"></map-content> -->
    <!-- import引入input组件 -->
    <input-comment-mask :inputCommentSize="inputCommentSize" :likesObj="likesObj" :getLikesData="getLikesData" :sceneAccountId="sceneAccountId" :commentCountData="commentCountData"></input-comment-mask>
  </div>
</template>

<script>
  import lsHeaderDetail from '@/components/header/src/headerDetail'
  import articleContent from '@/components/article/articleContent'
  // import mapContent from '@/components/article/mapContent'
  import inputCommentMask from '@/components/input/inputCommentMask'

  export default {
    name: 'articleDetail',
    props: [
      'headFlag',
      'pageShow',
      'datumJson',
      'lsUser',
      'contTitle',
      'likesObj',
      'getLikesData',
      'sceneAccountId',
      'followType',
      'followAction',
      'isEditFlag', // 判断复文本编辑器版本
      'isEditCont',
      'commentCountData'
    ],
    data () {
      return {
        'datas': {},
        'fixed': false,
        'transprant': false,
        'title': '文章详情',
        'articleContentSize': {
          'type': 'txt'
        },
        'inputCommentSize': {
          'isTwoIcon': true
        },
        'isDisplayFollow': false,
        'followedUserGuid': ''
      }
    },
    components: {
      lsHeaderDetail,
      articleContent,
      // mapContent,
      inputCommentMask
    },
    methods: {
      goBack () {
        // this.$router.isBack = true
        // this.$router.push({path: '/', query: {sceneAccountId: this.pageShow.sceneAccountId}})
        var locationSessionUrl
        if (window.localStorage.getItem('fromArticleShare')) { // 来自文章中链接返回
          locationSessionUrl = window.localStorage.getItem('fromArticleShare')
          window.localStorage.removeItem('fromArticleShare')
          window.location.href = locationSessionUrl
        } else if (window.localStorage.getItem('fromUserInfo')) { // 来自个人主页跳转进来
          locationSessionUrl = window.localStorage.getItem('fromUserInfo')
          window.localStorage.removeItem('fromUserInfo')
          window.location.href = locationSessionUrl
        } else if (this.$getCookie('fromH5App')) { // 来自H5App
          locationSessionUrl = this.$getCookie('fromH5App')
          this.$setCookie('fromH5App', '')
          window.location.href = locationSessionUrl
        } else {
          this.$router.isBack = true
          this.$router.push({path: '/', query: {sceneAccountId: this.pageShow.sceneAccountId}})
          // this.$router.go(-1)
        }
        // this.$router.go(-1)
      },
      followedScene () {
        let _self = this
        if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
          var u = navigator.userAgent.toLowerCase()   // 获取用户登录信息
          if (/(iphone|ipad|ipod|ios)/i.test(u)) {
            window.setupWebJsBridge(function (bridge) {
              bridge.callHandler('getUserStatus', null, function (response) {
                if (response.login) {
                  _self.followedUserGuid = response.memberId
                  _self.followedSceneEvt()
                } else {
                  bridge.callHandler('login', null, function (response) { })
                }
              })
            })
          }
          window.connWebJsBridge(function (bridge) {
            bridge.callHandler('getUserStatus', null, function (response) {
              var resObj = JSON.parse(response)
              if (resObj.login) {
                _self.followedUserGuid = resObj.memberId
                _self.followedSceneEvt()
              } else {
                bridge.callHandler('login', null, function (response) { })
              }
            })
          })
        } else {
          _self.followedUserGuid = _self.$getCookie('guid')
          if (_self.followedUserGuid) {  // 判断是否登录
            _self.followedSceneEvt()
          } else {
            let curUrl = encodeURIComponent(window.location.href)
            window.location.href = 'http://www.api.tianxialashou.com.cn/static/QuickLogin.html?fromurl=' + curUrl
          }
        }
      },
      followedSceneEvt () {
        let _self = this
        _self.$http.post(_self.$host + '/gateway/members/' + _self.followedUserGuid + '/follows/sceneaccounts', {
          'memberId': _self.followedUserGuid,
          'targetId': _self.sceneAccountId,
          'targetType': 'sceneAccount',
          'action': _self.followAction === '1' ? '0' : '1'
        }, {
          headers: {'guid': _self.followedUserGuid}
        })
          .then(function (response) {
            // let data = response.data
            let followMsg = {}
            followMsg.followAction = _self.followAction
            followMsg.followType = _self.followType
            _self.$emit('sendFollowMsg', followMsg)
            // console.log(data.action)
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      onScrollTitle () {
        let _self = this
        let artConBox = document.getElementsByClassName('articleContentBox')[0]
        let artTitH = document.getElementsByClassName('articleTit')[0].offsetHeight
        let userInfoH = document.getElementsByClassName('userInfoBox')[0].offsetHeight
        let scrollHeight = artTitH + userInfoH
        if (artConBox.scrollTop > scrollHeight) {
          _self.isDisplayFollow = true
          _self.showTitleToApp('1')
        } else {
          _self.isDisplayFollow = false
          _self.showTitleToApp('0')
        }
      },
      showTitleToApp (data) {
        // 判断是否在app中
        if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
          // 获取用户登录信息
          var u = navigator.userAgent.toLowerCase()
          if (/(iphone|ipad|ipod|ios)/i.test(u)) {
            window.setupWebJsBridge(function (bridge) {
              bridge.callHandler('showTitle', data, function (response) {}) // 参数1显示，0隐藏
            })
          }
          window.connWebJsBridge(function (bridge) {
            bridge.callHandler('showTitle', data, function (response) {})
          })
        }
      }
      // goAppscenceEvn (memberid) {
      //   // console.log(memberid)
      //   this.$emit('goAppHomePage', memberid)
      // }
    }
  }
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang='sass'>
.articleDetailBox{
  width: 100%;
  background-color: #fff;
  height: 100%;
}
.lashou-header .lashou-header-title .user-wrap .avatar.ls-user--followed{
  width: 58px;
  height: 58px;
  padding-top: 3px;
}
</style>
