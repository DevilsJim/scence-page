<template>
  <div class='articleDetailBox'>
    <ls-header :opaque = 'true' title='投票详情' fixed v-if="headFlag">
      <div slot='left'>
        <mt-button icon='back' @click='goBack'></mt-button>
      </div>
      <mt-button slot = 'right'></mt-button>
    </ls-header>

    <!-- voteContent -->
    <div class="detailContent" ref="detailContBox">
      <h2 class="articleTit" v-if="datumJson.title" ref="header" >
        <em v-if="additionProps.activityStatus === 'active'">进行中</em>
        <em v-else class="ending">已结束</em>
        {{ datumJson.title }}
      </h2>
      <div class="userInfoBox">
        <!-- import引入用户信息组件 -->
        <ls-user-detail v-if="lsUser.nickname" :type="followType" :sceneAccountTitle="pageShow.sceneAccountTitle" :createDate="pageShow.displayTime" :nickName="lsUser.nickname" :avatar="lsUser.headImg" :updateFlag="true" :isDefaultSceneAccount="pageShow.isDefaultSceneAccount" @linkToIndex="linkToIndex(lsUser.id)"></ls-user-detail>
        <!-- import关注按钮 -->
        <mt-button ref="btn" v-if="followType && !pageShow.isDefaultSceneAccount" :type="followType" @click="followedScene"></mt-button>
      </div>

      <div class="voteImg" v-for="item in datumJson.mainContent" v-if="item.type === 'image'">
        <img :src="item.matter" alt="">
      </div>
      <div class="voteTitle">
        <span v-if="additionProps.votingType === 'single'">单选</span>
        <span v-else-if="additionProps.votingType === 'multi'">多选</span>
        <em v-if="additionProps.allOptionPull">共{{additionProps.allOptionPull}}票</em>
      </div>
      <div class="voteCon">
        <!-- 我的-查看投票结果 -->
        <template v-if="memberVoteResult">
          <ul class="voteResult">
            <li v-for="(item, index) in datumJson.mainContent" v-if="item.type === 'option'" :class="{curVoter: JSON.parse(item.matter).ifBeSelected, detailBtn:curUsrId === lsUser.id}" @click="(curUsrId === lsUser.id) && goVoteSubsidiary(index)">
              <p>
                <span class="txt">{{item.title}}</span>
                <span class="progressBar"><em :style="{ width: JSON.parse(item.matter).poll / additionProps.allOptionPull * 100 + '%' }"></em></span>
              </p>
              <span class="amount">{{JSON.parse(item.matter).poll || 0}} 票</span>
            </li>
          </ul>
        </template>
        <template v-else>
          <!-- 投票进行中 -->
          <template v-if="additionProps.activityStatus === 'active'">    <!-- additionProps.activityStatus 表示投票状态，进行中/已结束 -->
            <!-- 用户已投票 -->
            <ul class="voteResult" v-if="additionProps.memberVoted">
              <li v-for="(item, index) in datumJson.mainContent" v-if="item.type === 'option'" :class="{curVoter: JSON.parse(item.matter).ifBeSelected, detailBtn: curUsrId === lsUser.id}" @click="(curUsrId === lsUser.id) && goVoteSubsidiary(index)">
                <p>
                  <span class="txt">{{item.title}}</span>
                  <span class="progressBar"><em :style="{ width: JSON.parse(item.matter).poll / additionProps.allOptionPull * 100 + '%' }"></em></span>
                </p>
                <span class="amount">{{JSON.parse(item.matter).poll || 0}} 票</span>
              </li>
            </ul>
            <!-- 用户未投票 -->
            <ul class="inVoting" v-else>
              <template v-if="additionProps.votingType === 'single'">   <!-- 单选 -->
                <li v-for="(item, index) in datumJson.mainContent" v-if="item.type === 'option'" :class="{active: index === activeIndex}" @click="selectedSingle(index)">{{item.title}}</li>
              </template>
              <template v-else-if="additionProps.votingType === 'multi'">  <!-- 多选 -->
                <li v-for="(item, index) in datumJson.mainContent" v-if="item.type === 'option'" @click="selectedMulti($event, index)">{{item.title}}</li>
              </template>
            </ul>
          </template>
          <!-- 投票已结束 -->
          <template v-if="additionProps.activityStatus === 'expired'">
            <ul class="voteResult">
              <li v-for="(item, index) in datumJson.mainContent" v-if="item.type === 'option'" :class="{curVoter: JSON.parse(item.matter).ifBeSelected, detailBtn:curUsrId === lsUser.id}" @click="(curUsrId === lsUser.id) && goVoteSubsidiary(index)">
                <p>
                  <span class="txt">{{item.title}}</span>
                  <span class="progressBar"><em :style="{ width: JSON.parse(item.matter).poll / additionProps.allOptionPull * 100 + '%' }"></em></span>
                </p>
                <span class="amount">{{JSON.parse(item.matter).poll || 0}} 票</span>
              </li>
            </ul>
          </template>
        </template>
      </div>
      <div class="voters" v-if="additionProps.partake" >
        <img v-for="(item, index) in additionProps.partake.headImages" v-if="index < 3" :src="item ? item : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAMAAABG8BK2AAAAdVBMVEUAAADw8PD4+Pj5+fnw8PDu7u74+Pjv7+/v7+/w8PDz8/P29vb////z8/P+/v7s7Oz19fXv7+/s7Ozv7+/////////5+fnx8fHr6+vw8PD////////v7+/k5OT////////s7Oz+/v7j4+P4+Pjy8vLc3NzV1dUnnfDHAAAAIHRSTlMA9RcN44RC1al1XTQGS8a3KyajloXlZj7Sw7icVe6r2QMhDKYAAAOQSURBVFjDnZeJgqowDEXLJor7Puos2FL+/xNfsU3SNoXnzB1G0aaHm3RBxKTya3NZVItFs96Lv2l1rW5ZS8rq42f+W8hsbhBct0vxPqNYlNCvwwNMHfZvQqrMEqArCGDz3RuUz9J2YW5IWfW/1PKtd3EmdFjOpitbggNSGlVNUBasB/xz+G00sSPPhXvB1zpPU+YU5U6kPeA9ukKZHPpDGCSRQzxw5F7KhJ8K2jlHIijSB6tPg1ciiGRuLJICtxFlnxHBxUNfI6ACn8ZvES7nOkgHT3wBPVC2DApDTsG+OZjAqad65acEDKoF9uyMEOllx9PaIoQK81L3BKkWsACCtHDUl3ycCUIg4kh/+R/RTOAFrahnpNYrELez860QJYYQx2aG5ayCFUkgpKQ5QAFQaedMGeVEdeHy7JBee9i6JVFlnml1ZIdAc8jJ5zAz3I4M5042YOrXKUG4GV6daO7shMjpE2SkZTsCodlDe4+dyZ/+OuAFns6KirMwDIK8gUEO7Rm1EAdeX63VBEZDViRT4xvkKIkzhfH3DCxHLuqUm4mktAZQMFQlL7DWEyOldWLIryJLuZmYN1onirMGDFG0wfQTFdaa3BCmjCffENiPZaV6nbJzxRJLdDNgxuzIvk/ZWYoPzw2a6fuR/ca0pNzs4QcAmAFMMi3VD0q4WYmKmbGYvuMU28DtlHjzjszowWNMGaIsRod2tkLsEuOk3YxUPgVWcDRWsKmXsRktOyO31NCJ1dCg2Vhd3Y8s6ZtpVYccknSUTnUycpOtDKaJzHRKEYfu6UgxAo4b4K0wKjKfItWgpJ8OKIZjMY7eCIFZ4R0XOBGp8yiwI8uXm6wQeKOi/Yo4XMppWKLo5iCsPgzS0Z9q+BsBAUOFd4gdPG04M3abIY4KIahXTAfVmQtQTSkp8INCBHlR/p1miZhZ61KyUkMkVweUgYNlPgrSQQ6yzRgHnUG2kSJe1/7KBSn/8s1YO+iI5+NVuRG+1uYbCnuCL0S5Fj9EDdU5iFCVlACAaDiBdzyA1Er20LDatq9mEJn3jBDEfv215w+8G4bwQcELaCm48h/Xm5Hoq/BKa5FSjn4oEkGcqGYireLu58SkgrczZsR1ivvBlGPcTT75IH5mXZKuTmJaxQOjx3PasIS4lmGlOfJ8EW9pdmccH7IS72p3Oqch32sOmbZ0ipP7eTSF+IOKZXN6fN839+/H6TKbHOF/ru/ldRLgZ3IAAAAASUVORK5CYII='" alt="">
        <span>{{additionProps.partake.totalCount}}人已投</span>
      </div>
      <!-- import引入投票按钮 -->
      <mt-button ref="btn" v-if="additionProps.activityStatus === 'active' && !additionProps.memberVoted && !memberVoteResult" type="save" @click="submitVote">投票</mt-button>
      <p class="voteDeadline">截止时间 {{additionProps.deadlineDateFormat}}</p>
    </div>
  </div>
</template>

<script>
  import lsUserDetail from '@/components/userInfo/src/userInfoDetail'
  import Toast from '@/components/toast'

  export default {
    name: 'voteDetail',
    props: [
      'headFlag',
      'pageShow',
      'datumJson',
      'additionProps',
      'lsUser',
      'sceneAccountId',
      'followType',
      'followAction'
    ],
    components: {
      lsUserDetail
    },
    data () {
      return {
        'curUsrId': '',
        'isCurUsrLogin': false,
        'fixed': false,
        'activeIndex': null,
        'checkIds': [],
        'memberVoteResult': this.$route.query.memberVoteResult,  // 此字段与客户端约定，memberVoteResult 存在，且值为1时，表示从 '我的'-'查看投票接口' 进入
        'isRouterAlive': true
      }
    },
    methods: {
      goBack () {
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
      linkToIndex (memberid) {   // 点击返回卡片
        if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
          // this.$parent.$emit('goAppscence', '111')
          this.$emit('goAppHomePage', memberid)
        } else {
          window.localStorage.setItem('toUserPageUrl', window.location.href)
          // this.$router.push({ path: '/', query: { 'sceneAccountId': this.pageShow.sceneAccountId } })
          this.$router.push({ path: '/userPage', query: { 'memberid': memberid } })
        }
      },
      userLoginStatus (fnName, flag) {  // 判断用户是否登录 (fnName: 登录后执行函数名称, flag: 是否调登录页)
        flag = flag || false
        fnName = fnName || null
        let _self = this
        if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
          var u = navigator.userAgent.toLowerCase()   // 获取用户登录信息
          if (/(iphone|ipad|ipod|ios)/i.test(u)) {
            window.setupWebJsBridge(function (bridge) {
              bridge.callHandler('getUserStatus', null, function (response) {
                if (response.login) {
                  _self.curUsrId = response.memberId
                  if (flag) fnName()
                  _self.isCurUsrLogin = true
                } else {
                  _self.isCurUsrLogin = false
                  if (flag) bridge.callHandler('login', null, function (response) { })
                }
              })
            })
          }
          window.connWebJsBridge(function (bridge) {
            bridge.callHandler('getUserStatus', null, function (response) {
              var resObj = JSON.parse(response)
              if (resObj.login) {
                _self.curUsrId = resObj.memberId
                if (flag) fnName()
                _self.isCurUsrLogin = true
              } else {
                _self.isCurUsrLogin = false
                if (flag) bridge.callHandler('login', null, function (response) { })
              }
            })
          })
        } else {
          _self.curUsrId = _self.$getCookie('guid')
          if (_self.curUsrId) {  // 判断是否登录
            _self.isCurUsrLogin = true
            if (flag) fnName()
          } else {
            _self.isCurUsrLogin = false
            if (flag) window.location.href = 'http://www.api.tianxialashou.com.cn/static/QuickLogin.html?fromurl=' + encodeURIComponent(window.location.href)
          }
        }
      },
      followedScene () {  // 点击关注
        let _self = this
        _self.userLoginStatus(_self.followedSceneEvt, true)
      },
      followedSceneEvt () {
        let _self = this
        _self.$http.post(_self.$host + '/gateway/members/' + _self.curUsrId + '/follows/sceneaccounts', {
          'memberId': _self.curUsrId,
          'targetId': _self.sceneAccountId,
          'targetType': 'sceneAccount',
          'action': _self.followAction === '1' ? '0' : '1'
        }, {
          headers: {'guid': _self.curUsrId}
        })
          .then(function (response) {
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
      selectedSingle (index) {   // 单选投票
        let curId = JSON.parse(this.datumJson.mainContent[index].matter).id
        this.activeIndex = index
        this.checkIds[0] = curId
      },
      selectedMulti (evt, index) {   // 多选投票
        let curItem = evt.target
        let curItemClaName = curItem.getAttribute('class')
        let curId = JSON.parse(this.datumJson.mainContent[index].matter).id
        if (!curItemClaName) {
          curItem.setAttribute('class', 'active')
          this.checkIds.push(curId)
        } else {
          curItem.setAttribute('class', '')
          if (this.checkIds.indexOf(curId) > -1) {
            let curIndex = this.checkIds.indexOf(curId)
            this.checkIds.splice(curIndex, 1)
          }
        }
      },
      goVoteSubsidiary (index) {  // 查看明细
        let _self = this
        let curPoll = JSON.parse(_self.datumJson.mainContent[index].matter).poll
        if (curPoll > 0) {
          let selectedOptionId = JSON.parse(_self.datumJson.mainContent[index].matter).id
          console.log(selectedOptionId)
          this.$router.push({path: '/voteSubsidiary', query: {sceneAccountId: this.$route.query.sceneAccountId, contentId: this.$route.query.contentId, memberId: this.curUsrId, optionId: selectedOptionId, start: 1, count: 10}})
        }
      },
      submitVote () {   // 投票
        let _self = this
        _self.userLoginStatus(_self.submitVoteEvt, true)
      },
      submitVoteEvt () {
        let _self = this
        if (_self.checkIds.length > 0) {
          let request = {}
          request.interactionType = 'postVote'
          request.optionIds = _self.checkIds
          _self.$http.post(_self.$host + '/gateway/delegate/contents/' + _self.$route.query.contentId + '/operate', {
            'sceneAccountId': _self.$route.query.sceneAccountId,
            'contentId': _self.$route.query.contentId,
            'request': JSON.stringify(request)
          }, {
            headers: {'guid': _self.curUsrId}
          }).then(function (response) {
            _self.$emit('getList')
          }).catch(function (error) {
            console.log(error)
          })
        } else {
          Toast({
            message: '请选择投票项',
            position: 'middle',
            duration: 2000
          })
        }
      }
    },
    created () {
      this.userLoginStatus()
      document.title = '投票详情'
    },
    updated () {
      if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
        this.$refs.detailContBox.style.paddingTop = '0.4rem'
      }
    }
  }
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang='sass'>
.articleDetailBox{
  width: 100%;
  background-color: #fff;
}
.detailContent {
  width: 100%;
  box-sizing: border-box;
  padding-top: 88px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 50px;
  background-color: #fff;
  h2 {
    position: relative;
    font-size: 50px;
    color: #222;
    line-height: 70px;
    font-weight: 800;
    word-break: break-all;
    padding-left: 134px;
    em {
      position: absolute;
      left: 0;
      top: 12px;
      display: block;
      width: 100px;
      height: 42px;
      line-height: 42px;
      text-align: center;
      font-size: 22px;
      color: #fff;
      background: #7F7AFE;
      border-radius: 21px;
      &.ending {
        background: #EBEBEB;
        color: #999;
      }
    }
  }
  .userInfoBox {
    position: relative;
    padding-bottom: 20px;
  }
  .voteImg{
    position: relative;
    overflow: hidden;
    width: 690px;
    height: 280px;
    background: linear-gradient(180deg,rgba(255,255,255,0),rgba(0,0,0,0.53));
    border-radius: 18px;
    margin-bottom: 10px;
    img{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: block;
      width: 100%;
      height: auto;
    }
  }
  .voteTitle{
    display: flex;
    padding: 40px 0 20px;
    border-bottom: 1px solid #F1F1F1; /*no*/
    span {
      display: block;
      flex: 1;
      font-size: 34px;
      color: #3c3c3c;
      font-weight: bold;
    }
    em{
      display: block;
      font-size: 28px;
      color: #7F7AFE;
      font-weight: bold;
    }
  }
  .voteCon {
    padding-bottom: 80px;
    .inVoting {
      padding: 50px 0 60px;
      border-bottom: 1px solid #F1F1F1; /*no*/
      li {
        position: relative;
        font-size: 32px;
        color: #3c3c3c;
        line-height: 45px;
        margin-bottom: 38px;
        padding-left: 66px;
        &:last-child {
          margin-bottom: 0;
        }
        &:after {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          display: block;
          content: '';
          width: 42px;
          height: 42px;
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsBAMAAADsqkcyAAAAHlBMVEUAAADc3Nzc3Nzd3d3c3Nzc3Nzd3d3a2trb29vc3Ny3qJKrAAAACnRSTlMAZB9EB11SNSwPUFwXggAAAORJREFUKM91k70KwkAQhJcYNCk350XLpBI7D8Q6IoLtgQ9gsLCNFtYJ+ADBJ5Zo/teZau/j/neGarmrndXXR0IDOYa/UtGApnxbJ+77yWGP+0a/ftXJqrLFsc6b0rNBU854S60OnNWVWVJPhWomD4+vp8dBx7qxz/kQe1xdZqJoJLOp1pzH+FjtkuZj7IVEjiYhG9FkKXGxof1c0IrFF4mnAd0ziWcLMpHEjqK0lNgPySYSu5qY/ogBBpuAI8EFwXPA48FXgY8FbQBNAy0GhgD2AWbD1pRGxraXIQGRQgHEcQXh/gCKOim1/0xgFgAAAABJRU5ErkJggg==) no-repeat center;
          background-size: 100%;
        }
        &.active:after{
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAP1BMVEUAAACAev+BeP19cv9+eP5/e/+Def+Aef9+e/+Od/h6bu+FcvSFcvSPePl7b/CTefl3a+2Tevt3bO59b/KKdfdfPLYpAAAAE3RSTlMAZB0LRjVSKlvy8uS2mprk5La2eDuMJQAAAWBJREFUOMudVQuygyAMlBBSbav9wP3P+lJUEgivTl0YZ4R13UAIQwMPAckxCAP44RsAXQWE/6n0UWRBVvQeQn7t0z2rjsFXQ2Fkdd+RZZmLHb7wsBEPImF/GAxXZK14aLjwZY0qNnS5/XlvPVgne0DosJJ5PVJ6vERMU4A/E+qcCmah+90IKRM0JYWJlBFahccy5FIDV6bGLI2yLpQMSFYX2Y04hsmSJxDXnl2Uj+fUwVx+yz5CcQGpi006E9GBRBe57YjcdYzApqlYvq+TcWu5c7sX0zRIfLdNWXfGTSIcuG/Iqralfd6QGfxc7WxQZG0jT0VByl3Z0AGuVHGwvqsA9dJZ5Q/U0ulNiV2oTdHbvfS4i95unUhXy73qRKpSFC0ZVYq2yd9yq+RvjxVeKw9YHSt7YBcVmz2wthS8nzE+36YU/FJkfilf5wrjcck9X8yPr4nzF9Dx1Xb+0jy+jv8ARRolp7Ler5IAAAAASUVORK5CYII=)
        }
      }
    }
    .voteResult {
      padding: 40px 0;
      border-bottom: 1px solid #F1F1F1; /*no*/
      li {
        display: flex;
        align-items: flex-end;
        font-size: 26px;
        padding-bottom: 24px;
        span {
          display: block;
          line-height: 37px;
          font-weight: bold;
        }
        p {
          flex: 1;
          color: #3c3c3c;
          .txt {

          }
          .progressBar {
            position: relative;
            width: 418px;
            height: 12px;
            background: #F2F3F3;
            border-radius: 20px;
            overflow: hidden;
            margin: 10px 0;
            em {
              position: absolute;
              top: 0;
              left: 0;
              display: block;
              width: 0;
              height: 100%;
              background: #7F7AFE;
              background: linear-gradient(-90deg,rgba(104,125,255,1),rgba(127,122,254,1));
              border-radius: 20px;
            }
          }
        }
        .amount {
          color: #787878;
          font-weight: normal;
        }
        &.detailBtn {
          .amount {
            position: relative;
            padding-right: 32px;
            &:after {
              position: absolute;
              top: 50%;
              right: 0;
              display: block;
              content: '';
              height: 12px;
              width: 12px;
              border: 1px solid transparent; /*no*/
              border-bottom: 1px solid #999; /*no*/
              border-left: 1px solid #999; /*no*/
              transform: translateY(-60%) rotateZ(-135deg);
            }
          }
        }
        &.curVoter {
          .txt, .amount {
            color: #7F7AFE;
          }
        }
        &:last-child {
          padding-bottom: 0;
        }
      }
    }
  }
  .voters {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 74px;
    img{
      display: block;
      width: 50px;
      height: 50px;
      margin-left: -10px;
      background: #f1f1f1;
      border-radius: 50px;
      overflow: hidden;
      border: none;
    }
    span {
      display: block;
      margin-left: 20px;
      color: #666;
      font-size: 28px;
    }
  }
  .voteDeadline {
    font-size: 22px;
    color: #C5C5C5;
    text-align: center;
  }
  .lashou-button--save{
    width: 320px;
    height: 88px;
    border: none;
    font-size: 32px;
    margin: 0 auto 50px;
    &.gray {
      background: #f1f1f1;
    }
  }
}
.lashou-header .lashou-header-title .user-wrap .avatar.ls-user--followed{
  width: 58px;
  height: 58px;
  padding-top: 3px;
}
</style>
