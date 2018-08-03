<template>
  <div class="actionSheetBox" ref="sheetBox">
    <div class="content" ref="sheetDiv">
      <span id="reply" class="reply" @click="replyDiscuss">回复</span>
      <!-- <span class="copy">复制</span> -->
      <span class="inform" @click="reportDiscuss">举报</span>
      <span id="delete" class="delete" @click="deleteDiscuss">删除</span>
      <span class="cancel" @click="sheetBoxHide">取消</span>
    </div>
    <div class="mask" @click.stop="sheetBoxHide" ref="sheetHide"></div>
  </div>
</template>

<script>
  import Toast from '@/components/toast'
  export default {
    name: 'actionSheet',
    props: [
      'menuInfo'
    ],
    methods: {
      replyDiscuss () {
        var _self = this
        _self.$refs.sheetBox.style.display = 'none'
        if (!_self.menuInfo.userFlag) {
          _self.$emit('userListSpeak')
        } else {
          Toast({
            message: '不能直接回复自己的评论哦！',
            position: 'bottom',
            duration: 2000
          })
        }
      },
      deleteDiscuss () {
        var _self = this
        // _self.menuInfo.userFlag 记录登录用户和点击评论用户id是否相同，相同为 true
        if (_self.menuInfo.userFlag) {
          _self.$http.delete(_self.$host + '/gateway/delegate/comments/' + _self.menuInfo.id, {
            headers: {
              guid: _self.menuInfo.userId
            }
          }).then(function (response) {
            _self.$refs.sheetBox.style.display = 'none'
            Toast({
              message: '删除成功！',
              position: 'bottom',
              duration: 2000
            })
            _self.$emit('speakSuccessData', '1111111')
          }).catch(function (error) {
            console.log(error)
          })
        } else {
          Toast({
            message: '非本人不能删除！',
            position: 'bottom',
            duration: 2000
          })
        }
      },
      reportDiscuss () {
        let _self = this
        if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
          var u = navigator.userAgent.toLowerCase()
          if (/(iphone|ipad|ipod|ios)/i.test(u)) {
            window.setupWebJsBridge(function (bridge) {
              bridge.callHandler('getUserStatus', null, function (response) {
                if (response.login) {
                  _self.$router.push({path: 'reportReasons', query: {curUsrId: _self.menuInfo.userId, targetId: _self.menuInfo.publisherGuid, targetType: _self.menuInfo.targetType}})
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
                _self.$router.push({path: 'reportReasons', query: {curUsrId: _self.menuInfo.userId, targetId: _self.menuInfo.publisherGuid, targetType: _self.menuInfo.targetType}})
              } else {
                bridge.callHandler('login', null, function (response) { })
              }
            })
          })
        } else { // 判断是否在浏览器中
          let userGuidH5 = _self.$getCookie('guid')
          if (userGuidH5) {  // 判断是否登录
            _self.$router.push({path: 'reportReasons', query: {curUsrId: _self.menuInfo.userId, targetId: _self.menuInfo.publisherGuid, targetType: _self.menuInfo.targetType}})
            // _self.reportDiscussEvt()
          } else {
            let curUrl = encodeURIComponent(window.location.href)
            window.location.href = 'http://www.api.tianxialashou.com.cn/static/QuickLogin.html?fromurl=' + curUrl
          }
        }
      },
      reportDiscussEvt () {
        let _self = this
        let curUsrId = _self.menuInfo.userId || 'f14807da-56dc-4546-8378-61a1a9eb4266'
        // /members/{member_id}/reports
        _self.$http.post(_self.$host + '/gateway/members/' + curUsrId + '/reports', {
          // 'content': _self.menuInfo.content,  // 举报内容
          'targetId': _self.menuInfo.publisherGuid,   // 举报对象id
          'targetType': _self.menuInfo.targetType    // 举报对象类型 block-内容块，sceneAccount-场景号，comment-评论
        }, {
          headers: {'guid': curUsrId}
        })
          .then(function (response) {
            console.log('To report success')
            _self.$refs.sheetBox.style.display = 'none'
            Toast({
              message: '举报成功！',
              position: 'bottom',
              duration: 2000
            })
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      sheetBoxHide () {
        let _self = this
        _self.$refs.sheetBox.style.display = 'none'
      }
    }
  }
</script>

<style scoped lang="sass" type="text/css">
  .actionSheetBox{
    display: none;
    .content{
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 1001;
      width: 100%;
      background: #fff;
      transform: translateY(0);
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      span{
        display: block;
        width: 100%;
        height: 110px;
        line-height: 110px;
        text-align: center;
        font-size: 30px;
        color: #666;
        border-bottom: 1px solid #e0e0e0; /*no*/
        &:last-child{
          border-top: 12px solid #e0e0e0;
          border-bottom: none;
        }
      }
    }
    .mask{
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0, .5);
    }
  }
</style>
