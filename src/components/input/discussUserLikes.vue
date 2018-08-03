<template>
  <div class="user-likes-box" ref="userLikesBox">
    <!--
      userSpeakObj.userGuid: 当前评论用户
      userLikesObj.likesFlag: 当前回复用户
      isDiscussArticle: 判断当前是否为评论详情页
    -->
    <span class="user-get-speak" ref="userGetSpeakSpan" @click="userGetSpeak" v-if="userSpeakObj.userGuid !== userLikesObj.likesFlag">&nbsp;</span>
    <span class="user-get-likes" :class="[userGetLikeObj.userListFlag ? 'user-get-lik' : '']" @click="getLikes(userGetLikeObj.userListCount)" ref="userGetLikesSpan"><em>{{ userGetLikeObj.userListCount | getLikesNum }}</em></span>
  </div>
</template>

<script>
  export default {
    name: 'discussUserLikes',
    props: [
      'userLikesObj',
      'userGetLikesData',
      'userSpeakCount',
      'userSpeakObj',
      'isDiscussArticle'
    ],
    data () {
      return {
        'userGetLikeObj': {
          'userListCount': 2, // 点赞数量
          'userListFlag': false // 点赞状态
        }
      }
    },
    filters: {
      getLikesNum (val) {
        if (val === 0) {
          return ' '
        } else {
          return val
        }
      }
    },
    methods: {
      getLikes (countNum) {
        var _self = this
        if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
          var u = navigator.userAgent.toLowerCase()
          if (/(iphone|ipad|ipod|ios)/i.test(u)) {
            window.setupWebJsBridge(function (bridge) {
              bridge.callHandler('getUserStatus', null, function (response) {
                if (response.login) {
                  _self.userLikesObj.likesFlag = response.memberId
                  _self.getInitLikes(countNum)
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
                _self.userLikesObj.likesFlag = resObj.memberId
                _self.getInitLikes(countNum)
              } else {
                bridge.callHandler('login', null, function (response) { })
              }
            })
          })
        } else { // 判断是否在浏览器中
          _self.userLikesObj.likesFlag = _self.$getCookie('guid')
          if (_self.userLikesObj.likesFlag) {  // 判断是否登录
            _self.getInitLikes(countNum)
          } else {
            let curUrl = encodeURIComponent(window.location.href)
            window.location.href = 'http://www.api.tianxialashou.com.cn/static/QuickLogin.html?fromurl=' + curUrl
          }
        }
      },
      getInitLikes (countNum) {
        var _self = this
        var tGuid = _self.userLikesObj.likesFlag || 'f14807da-56dc-4546-8378-61a1a9eb4266'
        _self.$http.post(_self.$host + '/gateway/members/' + _self.userLikesObj.likesFlag + '/likes', {
          'targetId': _self.userLikesObj.likesId,
          'targetType': 'comment'
        }, {
          headers: {
            'guid': tGuid,
            'Content-Type': 'application/json'
          }
        })
        .then(function (response) {
          if (Number(response.data.status)) {
            _self.userGetLikeObj.userListCount = countNum + 1
            _self.userGetLikeObj.userListFlag = true
          } else {
            _self.userGetLikeObj.userListFlag = false
            if (_self.userGetLikeObj.userListCount > 0) {
              _self.userGetLikeObj.userListCount = countNum - 1
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      userGetSpeak () {
        // alert(this.userGetLikesData.flag)
        this.$emit('userListSpeak')
      }
    },
    mounted () {
      this.userGetLikeObj.userListCount = this.userGetLikesData.count
      this.userGetLikeObj.userListFlag = this.userGetLikesData.flag
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass" type="text/css">
  .user-likes-box {
    height: 34px;
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    flex-direction: row;
    .user-get-speak, .user-get-likes{
      position:relative;
      display:block;
      width: 32px;
      height: 32px;
      background:no-repeat center;
      background-size:100%;
    }
    .user-get-speak{
      margin-right:32px;
      background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAcBAMAAADy7KARAAAAMFBMVEUAAACampqampqampqZmZmbm5uZmZmampqbm5ubm5ubm5ubm5uampqdnZ2ampqZmZn3+sBSAAAAD3RSTlMA40S+9RbLmGQzWm+jJIprGrpYAAAAo0lEQVQY02Ng4Ej5DwduDQwMrPb/kcDnAAbmj0sZ4CBK3oChX5QBCQT+YMhfgCzA9Y3BPwBZgPULw38GFPCfTAFFIRiGCsh/hGEMAVxaEIBaAvITkPmc3xjqDyALsH9nCPmOLPDel4HJ/5uxsbkCAwPvY2PjlP/A8LsMCm2gshYQnQlSFqmkpO1/gON/kZISwgKVP/t/o1jP5P9/A6qDpklAGQA/N2Icwc+yDgAAAABJRU5ErkJggg==");
    }
    .user-get-likes{
      background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAfCAMAAACxiD++AAAAM1BMVEUAAACZmZmampqampqbm5ubm5ulpaWampqZmZmampqampqdnZ2ZmZmdnZ2ZmZmampqampqGruoaAAAAEXRSTlMA/uxtRzAK0aiOWx+0FMGef9tyeC8AAADxSURBVCjPfVPbsoQwCGvA3rRW//9rT9qt0zm7xbw4kAhB0HVsKYoUDZ8oaBGJaXMPfMUHoi3cZYTRD17I+NNrBFJwF5keMt0Vh7R0B3MlUT06XZCDzwtlNgMxexckFgAoe7BNnjgbdzfVhKqbYPXsKl8xsaE6gbcFHuKAYAsCwAqnLThZIcK/eYguQW2BcsSdRk1E7M2HtzsIJ8golkWBdqfWp0qju0KWk96QsaW6bLLPyocgLwxCl8FM5f/l1OSHUdwGP2vkr+BXUZ7bXfH9+mOfO8PY3xEh3E0CN7RE564K2d72j/472fCRPl4Rvk/4D2m+BUysVG8FAAAAAElFTkSuQmCC");
      em{
        position: absolute;
        top: -18px;
        right: -15px;
        display: block;
        color: #818181;
        font-size: 24px;
      }
    }
    .user-get-lik{
      background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAkCAMAAADM4ogkAAAAOVBMVEUAAAD+Z4X/dJT+Z4X+Z4T+Z4X/aYX/bIr+Z4T/aob/aYf+aIX9Z4X9aIb+aIX/aYX/aYX/aob+Z4TgwUaKAAAAEnRSTlMA7gngtdBlGsI4K6mdkoJ3UUP6m+ufAAAA1klEQVQ4y43U3Y6EIAyG4a9U/gR15P4vdtdsdzqO0fY5JG9IgAb8qT0S8ZQC3kJqTMR9h5rLELT9p4mHiDNEpaFixq9chqJd9js6xTMw82mJ6tEF6bTMWTotM4BtfIvxsrTKhiYKSMMlofnCBvaFDPKFhOEE9u5YfGHE4gsX7L7wBZDvdoDV9zC+xy44bGZHGYcQ7ZPoiD9ZIYxR61D9oZvwabrvwikMxeq0NDotJ6PTsl26pt3JchmtO4k+uw33Kuv7vvAkF/2XDKt+fobKci2m0Bdc/QB4r0QBwf+/vwAAAABJRU5ErkJggg==") no-repeat center;
      background-size:100%;
    }
  }
</style>
