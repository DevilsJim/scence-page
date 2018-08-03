<template>
  <div class="articleDetailBox">
    <!-- import引入headDetail组件 -->
    <ls-header-detail v-if='headFlag' fixed atlas :lsUser='lsUser' :pageShow='pageShow' :followType='followType' @followedScene="followedScene">
      <div slot='left'>
        <mt-button icon='back' @click='goBack'></mt-button>
      </div>
      <mt-button slot = 'right'></mt-button>
    </ls-header-detail>
    <!-- import引入slide组件 -->
    <atlas-slide :atlasSlideSize="atlasSlideSize" :datumJson="datumJson" :mainLen="mainLen" :headContFlag="headContFlag" :pageShow="pageShow"></atlas-slide>
    <!-- import引入input组件 -->
    <input-comment-mask :black="'true'" :inputCommentSize="inputCommentSize" :likesObj="likesObj" :getLikesData="getLikesData" :sceneAccountId="sceneAccountId" :commentCountData="commentCountData"></input-comment-mask>
    <div id="downloadImg"></div>
    <!-- bigImg -->
    <div class="big-img-box" ref="bigImgBox" @click="hideBigImgCont">
      <img :src="bigImgUrl" id="bigImgScale" alt="">
    </div>
  </div>
</template>

<script>
  import lsHeaderDetail from '@/components/header/src/headerDetail'
  import atlasSlide from '@/components/slider/atlasSlide'
  import inputCommentMask from '@/components/input/inputCommentMask'
  export default {
    name: 'articleDetail',
    props: [
      'headFlag',
      'headContFlag',
      'pageShow',
      'datumJson',
      'lsUser',
      'mainLen',
      'likesObj',
      'getLikesData',
      'sceneAccountId',
      'followType',
      'followAction',
      'commentCountData'
    ],
    data () {
      return {
        'bigImgUrl': '', // 需放大图片的url
        'lsInpt': '', // 获取input DOM元素
        'downloadImg': false, // 用于下载图片（判断是否隐藏文字）
        'downloadImgCur': 0, // 用于下载图片（记录当前是第几张图片）
        'slideImgFlag': true,
        'datas': {},
        'fixed': false,
        'transprant': false,
        'title': '文章详情',
        'atlasSlideSize': {
          'width': window.innerWidth,
          'height': 1060,
          'slidesOffset': 0,
          'spaceBetween': 0,
          'slidesPerView': 1,
          'autoplay': false,
          'borderRadius': 0,
          'floatLayer': 'block',
          'followedUserGuid': ''
        },
        'mainContent': [
          {'type': 'image', 'matter': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1516092473&di=ec26fb71a24837d5dd6def19821b3412&imgtype=jpg&er=1&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fd788d43f8794a4c273cb6b0804f41bd5ad6e392c.jpg', 'title': '望京SOHO', 'description': '望京SOHO位于北京市朝阳区望京街与阜安西路交叉路口,哈迪德Zaha...'}
        ],
        'inputCommentSize': {
          'isTwoIcon': true
        }
      }
    },
    updated () {
      var _self = this
      // this.downloadImgEv()
      // 点击查看大图
      var bigImg = document.getElementsByClassName('img-url')
      _self.lsInpt = document.getElementsByClassName('input-cont-box')[0]
      for (var ii = 0, len = bigImg.length; ii < len; ii++) {
        bigImg[ii].addEventListener('click', function () {
          // console.log(this.src)
          _self.bigImgCont(this.src)
        })
      }

      // 点击查看大图
      // var slideImg = document.getElementsByClassName('slideImgShadow')
      // var lsHeader = document.getElementsByClassName('lashou-header')[0]
      // var lsInput = document.getElementsByClassName('input-cont-box')[0]
      // var lsTitle = document.getElementsByClassName('slide-txt-layer')
      // for (var ii = 0, len = slideImg.length; ii < len; ii++) {
      //   slideImg[ii].index = ii
      //   slideImg[ii].addEventListener('click', function (index) {
      //     console.log(lsHeader)
      //     if (_self.slideImgFlag) {
      //       _self.slideImgFlag = false
      //       lsHeader.style.display = 'none'
      //       lsInput.style.display = 'none'
      //       for (var jj = 0, lsTitleLen = lsTitle.length; jj < lsTitleLen; jj++) {
      //         lsTitle[jj].style.display = 'none'
      //       }
      //     } else {
      //       _self.slideImgFlag = true
      //       lsHeader.style.display = 'flex'
      //       lsInput.style.display = 'block'
      //       for (var kk = 0, lsTitleLenK = lsTitle.length; kk < lsTitleLenK; kk++) {
      //         lsTitle[kk].style.display = 'block'
      //       }
      //     }
      //     // console.log(_self.slideImgFlag)
      //   })
      // }
    },
    // mounted () {
    //   this.downloadImgEv()
    // },
    components: {
      lsHeaderDetail,
      atlasSlide,
      inputCommentMask
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
      bigImgCont (url) {
        // console.log(this.$refs.bigImgBox)
        this.$refs.bigImgBox.style.display = 'flex'
        this.lsInpt.style.display = 'none'
        this.bigImgUrl = url
        // console.log(event.toElement.offsetHeight)
        if (event.toElement.offsetHeight > document.body.offsetHeight) {
          this.$refs.bigImgBox.style.display = 'block'
        }
      },
      hideBigImgCont () {
        this.$refs.bigImgBox.style.display = 'none'
        this.lsInpt.style.display = 'block'
      },
      downloadImgEv () {
//        document.getElementsByClassName('articleDetailBox')[0].removeEventListener('click')
//        Array.prototype.slice.call(document.getElementsByClassName('slideImgShadow')).forEach(function (item, index) {
//          item.removeEventListener('click')
//        })
        // 用于下载图片
        // var _self = this
        // document.getElementsByClassName('articleDetailBox')[0].addEventListener('click', function (e) {
        //   // console.log(document.getElementsByClassName('articleDetailBox')[0])
        //   e.preventDefault()
        //   // document.getElementsByTagName('header')[0].style.display = ''
        //   // Array.prototype.slice.call(document.getElementsByClassName('slide-txt-layer')).forEach(function (item, index) {
        //   //   item.style.display = ''
        //   // })
        //   // document.getElementById('inputContBox').style.display = ''
        //   // document.getElementById('downloadImg').style.display = ''
        //   _self.downloadImg = false
        // })

//         Array.prototype.slice.call(document.getElementsByClassName('slideImgShadow')).forEach(function (item, index) {
//           item.addEventListener('click', function (e) {
//             e.preventDefault()
//             e.cancelBubble = true
//             e.stopPropagation()
//             if (_self.downloadImg === false) {
//               document.getElementsByTagName('header')[0].style.display = 'none'
//               Array.prototype.slice.call(document.getElementsByClassName('slide-txt-layer')).forEach(function (item, index) {
//                 item.style.display = 'none'
//               })
//               document.getElementById('inputContBox').style.display = 'none'
//               Array.prototype.slice.call(document.getElementsByClassName('slide-download-show')).forEach(function (item, index) {
//                 item.style.display = 'block'
//               })
// //              document.querySelector('.slide-download-show').style.display = 'block'
// //              document.getElementById('downloadImg').style.display = 'block'
//               _self.downloadImg = true
//             } else {
//               document.getElementsByTagName('header')[0].style.display = ''
//               Array.prototype.slice.call(document.getElementsByClassName('slide-txt-layer')).forEach(function (item, index) {
//                 item.style.display = ''
//               })
//               document.getElementById('inputContBox').style.display = ''
//               Array.prototype.slice.call(document.getElementsByClassName('slide-download-show')).forEach(function (item, index) {
//                 item.style.display = 'none'
//               })
// //              document.querySelector('.slide-download-show').style.display = 'none'
// //              document.getElementById('downloadImg').style.display = ''
//               _self.downloadImg = false
//             }
//           })
//         })

        // document.getElementById('downloadImg').addEventListener('click', function (e) {
        //   e.preventDefault()
        //   e.stopPropagation()
        //   const imgUrl = document.getElementsByClassName('swiper-slide-active')[0].childNodes[0].getAttribute('src') // 获得需要下载图片的路径

        //   var a = document.createElement('a')
        //   var event = new MouseEvent('click')

        //   a.download = 'download_img' + (new Date()).valueOf()
        //   a.href = imgUrl

        //   a.dispatchEvent(event)
        // })
        // 用于下载图片end
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
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
.articleDetailBox{
  width: 100%;
  height: 100%;
  background-color: #000;
}
#downloadImg{
  position: absolute;
  display: none;
  right: 30px;
  width: 40px;
  height: 40px;
  background-image: url("/src/assets/downloadImg/download.png");
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  -webkit-background-size: 100% 100%;
}
.articleDetailBox .input-cont-box{
  background-color: #000;
  box-shadow: none;
}
/* 大图浮层样式 */
.big-img-box {
  display:none;
  position:fixed;
  z-index:1000;
  left:0;
  right:0;
  top:0;
  bottom:0;
  width:100%;
  height:100%;
  background-color:#000;
  /* display:flex; */
  justify-content:center;
  align-items:center;
  overflow-y:scroll;
  img {
    width:100%;
    height:auto;
  }
}
</style>
