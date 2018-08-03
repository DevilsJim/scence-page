<!--
	/**
	 * articleContent插件import引入
	 * <article-content :articleContentSize="articleContentSize" :mainContent="mainContent"></article-content>
	 * 通过prop属性进行组件传参，其中articleContentSize暂不做处理，
   	 *             mainContent 为传入的数据
   	 * articleContentSize: {
     *   'type': 'txt'
     * }
	 */
-->
<template>
  <div class="articleContentBox" ref="articleContBox" @scroll="$emit('onScrollTitle')">
    <!-- import引入head组件 -->
    <div class="detailContent">
      <h2 class="articleTit" v-if="datumJson.title" ref="header" >{{ datumJson.title }}</h2>
      <div class="userInfoBox">
        <!-- import引入用户信息组件 -->
        <ls-user-detail v-if="lsUser.nickname" :type="followType" :sceneAccountTitle="pageShow.sceneAccountTitle" :createDate="pageShow.displayTime" :nickName="lsUser.nickname" :avatar="lsUser.headImg" :updateFlag="true" :isDefaultSceneAccount="pageShow.isDefaultSceneAccount" @linkToIndex="linkToIndex(lsUser.id)"></ls-user-detail>
        <!-- import关注按钮 -->
        <mt-button ref="btn" v-if="followType && !pageShow.isDefaultSceneAccount" :type="followType" @click="$emit('followedScene')"></mt-button>
      </div>
      <div style="height:0.267rem; width:100%;"></div>
      <div class="contentBox" v-if="isEditFlag">
        <template v-for="(item, index) in datumJson.mainContent" >
          <p v-if="item.type === 'text'">{{ item.matter }}</p>
          <img v-if="item.type === 'image'" :src="item.matter" alt="" @click="bigImgCont(item.matter)">
          <div v-if="item.type === 'map'" class="mapBox">
            <img :src="item.matter.url" alt="" @click="doAMapIndex">
            <p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAPBAMAAAArJJMAAAAAJ1BMVEUAAAA8PDw8PDw9PT09PT09PT09PT0+Pj4+Pj5BQUE+Pj49PT08PDwPVQ3BAAAADHRSTlMA9ezayl1TRjovJd56IMfEAAAALUlEQVQI12MAA+cFQOKMJog41AAkzoiDiIMJQOLMURBxGsyCiYnD1GlC9EIAAN7SGh5ZtD40AAAAAElFTkSuQmCC" alt=""><em>{{ item.matter.title }}: {{ item.matter.address }}</em></p>
          </div>
        </template>
      </div>
      <div class="content-box-edit" v-else ref="contentBoxEdit" id="contentBoxEdit">
        <div v-html="isEditCont"></div>
        <!-- <edit-content :isEditCont="isEditCont"></edit-content> -->
      </div>
      <!-- APP 分享功能 -->
      <div class="share-box" v-if="shareFlag">
        <div class="shart-title">
          <div class="share-title-lt"></div>
          <div class="share-title-name">分享到</div>
          <div class="share-title-rt"></div>
        </div>
        <ul class="share-ul">
          <li class="share-wechat" @click="shareEvn('WeChat')">微信</li>
          <li class="share-miblog" @click="shareEvn('Weibo')">微博</li>
          <li class="share-circle" @click="shareEvn('Moments')">朋友圈</li>
        </ul>
      </div>
    </div>
    <!-- bigImg -->
    <div class="big-img-box" ref="bigImgBox" @click="hideBigImgCont">
      <img :src="bigImgUrl" id="bigImgScale" alt="">
    </div>
    <!-- video -->
    <!-- <img src="https://examplebloge.files.wordpress.com/2017/02/3def4804-d9b5-11e6-88e6-d7d8864392e0.png" alt="" @click="videoEvn('https://examplebloge.files.wordpress.com/2017/06/d7d88643-88e6-d9b5-11e6-92e03def4804.mp4')"> -->
    <!-- <div class="video-box-posi" ref="videoBox" @click="hideVideo">
      <video :src="videoUrl" controls autoplay class="videoCont" name="media"></video>
    </div> -->
  </div>
</template>

<script>
  // import hammerPic from '../../assets/js/hammer-pic'
  // import hammerMin from '../../assets/js/hammer.min'
  import Toast from '@/components/toast'
  import lsUserDetail from '@/components/userInfo/src/userInfoDetail'
  // import editContent from '@/components/article/editContent'
  export default {
    name: 'articleContent',
    props: [
      'articleContentSize',
      'pageShow',
      'datumJson',
      'lsUser',
      'followType',
      'followAction',
      'isEditFlag', // 判断复文本编辑器版本
      'isEditCont'
    ],
    components: {
      lsUserDetail
      // editContent
    },
    data () {
      return {
        'bigImgUrl': '', // 需放大图片的url
        'lsInpt': '', // 获取input DOM元素
        'videoUrl': '', // video地址
        'lo': '', // 经度
        'la': '', // 纬度
        'mapTitle': '望京SOHO', // 中心建筑名
        'mapAddress': '', // 地图描述
        'serveDatumJson': '',
        'shareFlag': false // 详情页底部分享
      }
    },
    methods: {
      linkToIndex (memberid) {
        // console.log(memberid)
        // 判断打开是否为LSapp
        if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
          // this.$parent.$emit('goAppscence', '111')
          this.$parent.$emit('goAppHomePage', memberid)
        } else {
          window.localStorage.setItem('toUserPageUrl', window.location.href)
          // this.$router.push({ path: '/', query: { 'sceneAccountId': this.pageShow.sceneAccountId } })
          this.$router.push({ path: '/userPage', query: { 'memberid': memberid } })
        }
      },
      doAMapIndex () {
        this.$router.push({ path: '/mapIndex', query: {'longitude': this.lo, 'latitude': this.la, 'mapTitle': this.mapTitle, 'mapAddress': this.mapAddress} })
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
        // this.hammerPic()
      },
      // hammerPic () {
      //   var pic = new Pic('#jbigImgScale')
      //   pic.picInit()
      // },
      hideBigImgCont () {
        this.$refs.bigImgBox.style.display = 'none'
        this.lsInpt.style.display = 'block'
      },
      videoEvn (url) {
        console.log(url)
        this.$refs.videoBox.style.display = 'flex'
        this.videoUrl = url
      },
      hideVideo () {
        this.$refs.videoBox.style.display = 'none'
      },
      serveClickEvn (id, sevGuid) {
        var _self = this
        sevGuid = sevGuid || 'f14807da-56dc-4546-8378-61a1a9eb4266'
        _self.$http.get(_self.$host + '/gateway/delegate/servants/' + id + '/display', {
          headers: {
            guid: sevGuid
          }
        }).then(function (response) {
          // console.log(response.data)
          _self.serveDatumJson = JSON.parse(response.data.contentDatum.datum)
          // alert(_self.serveDatumJson.needLogin)
          if (_self.serveDatumJson.datum.link.route === 'singleNoCall') {
            window.location.href = 'tel:' + _self.serveDatumJson.datum.link.options.urlString
          } else {
            if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
              window.connWebJsBridge(function (bridge) {
                bridge.callHandler('push', {
                  router: _self.serveDatumJson.datum.link.route,
                  options: {urlString: _self.serveDatumJson.datum.link.options.urlString}
                })
              })
            } else {
              if (_self.serveDatumJson.datum.link.route === 'H5' || _self.serveDatumJson.datum.link.route === 'LSMall') {
                window.location.href = _self.serveDatumJson.datum.link.options.urlString
              }
            }
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      loginEvn () {
        if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
          var u = navigator.userAgent.toLowerCase()
          if (/(iphone|ipad|ipod|ios)/i.test(u)) {
            window.setupWebJsBridge(function (bridge) {
              bridge.callHandler('getUserStatus', null, function (response) {
                if (!(response.login)) {
                  bridge.callHandler('login', null, function (response) { })
                }
              })
            })
          }
          window.connWebJsBridge(function (bridge) {
            bridge.callHandler('getUserStatus', null, function (response) {
              var resObj = JSON.parse(response)
              if (!(resObj.login)) {
                bridge.callHandler('login', null, function (response) { })
              }
            })
          })
        } else {
          let instance = Toast('请先下载天下拉手APP')
          instance.position = 'bottom'
          setTimeout(() => {
            instance.close()
            this.$router.push({path: '/downloadApp'})
          }, 2000)
        }
      },
      shareEvn (shareMsg) { // 详情页底部分享
        // console.log('详情页底部分享,分享类型:' + shareMsg)
        // bridge.callHandler('share', {shareType: 'WeChat|Moments|Weibo'}, function (response) {})
        window.connWebJsBridge(function (bridge) {
          bridge.callHandler('share', {'shareType': shareMsg})
        })
      }
    },
    updated () {
      // console.log(this.datumJson)
      var _self = this
      this.scenceName = this.pageShow.sceneTitle
      if (this.isEditFlag && this.datumJson.mainContent) {
        for (var i = 0; i < this.datumJson.mainContent.length; i++) {
          if (this.datumJson.mainContent[i].type === 'map') {
            // console.log(11)
            this.lo = this.datumJson.mainContent[i].matter.longitude
            this.la = this.datumJson.mainContent[i].matter.latitude
            this.mapTitle = this.datumJson.mainContent[i].matter.title
            this.mapAddress = this.datumJson.mainContent[i].matter.address
          }
        }
      } else {
        console.log(this.isEditFlag)
      }
      if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
        _self.$refs.articleContBox.style.paddingTop = '0.4rem'
        _self.shareFlag = true
      }
      // 点击查看大图
      // console.log(document.getElementsByTagName('img'))
      var bigImg = document.getElementsByClassName('img-url')
      _self.lsInpt = document.getElementsByClassName('input-cont-box')[0]
      for (var ii = 0, len = bigImg.length; ii < len; ii++) {
        bigImg[ii].addEventListener('click', function () {
          // console.log(this.src)
          _self.bigImgCont(this.src)
        })
      }
      // 点击商品
      var goodsList = document.getElementsByClassName('cont-goods-list')
      var goodsName = document.getElementsByClassName('cont-goods-rt-title')
      var goodsPrice = document.getElementsByClassName('cont-goods-rt-bot-price')
      var goodsStore = document.getElementsByClassName('cont-goods-rt-bot-store')
      for (var jj = 0, lenGoods = goodsList.length; jj < lenGoods; jj++) {
        goodsList[jj].index = jj
        // 点击事件
        goodsList[jj].onclick = function () {
          // console.log(this.id)
          // var goodsId = this.id
          var goodsurl = this.getAttribute('goodsurl')
          var goodsMapKv = {'商品名称': goodsName[this.index].innerHTML, '商品店铺': goodsStore[this.index].innerHTML, '商品价格': goodsPrice[this.index].innerHTML.slice(2), '场景号名称': _self.pageShow.sceneAccountTitle, '卡片标题': _self.datumJson.title}
          /* eslint-disable */
          TDAPP.onEvent('查看内容详情页', '内容页商品详情', goodsMapKv)
          /* eslint-enable */
          if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
            window.connWebJsBridge(function (bridge) {
              bridge.callHandler('push', {
                router: 'LSMall',
                options: {urlString: goodsurl}
              })
            })
          } else {
            window.open(goodsurl)
          }
        }
        // 检查商品信息
        // console.log(_self.datumJson.productExtendContent)
        if (_self.datumJson.productExtendContent.type === 'product' && _self.datumJson.productExtendContent.matters) {
          for (var kk = 0, goodsMattersLen = _self.datumJson.productExtendContent.matters.length; kk < goodsMattersLen; kk++) {
            // console.log(_self.datumJson.productExtendContent.matters[kk].id)
            _self.datumJson.productExtendContent.matters[kk] = _self.datumJson.productExtendContent.matters[kk].id ? _self.datumJson.productExtendContent.matters[kk] : JSON.parse(_self.datumJson.productExtendContent.matters[kk])
            if (goodsList[jj].id === _self.datumJson.productExtendContent.matters[kk].id) {
              goodsList[jj].setAttribute('goodsurl', _self.datumJson.productExtendContent.matters[kk].url)
              // console.log(goodsPrice[jj].innerHTML.slice(2))
              if (goodsPrice[jj].innerHTML.slice(2) !== _self.datumJson.productExtendContent.matters[kk].price) {
                // console.log(_self.datumJson.productExtendContent.matters[kk].price)
                goodsPrice[jj].innerHTML = '￥ ' + _self.datumJson.productExtendContent.matters[kk].price
              }
              if (goodsStore[jj].innerHTML !== _self.datumJson.productExtendContent.matters[kk].storeName) {
                // console.log(_self.datumJson.productExtendContent.matters[kk].price)
                goodsStore[jj].innerHTML = _self.datumJson.productExtendContent.matters[kk].storeName
              }
            }
          }
        }
      }
      // 点击服务
      var serveList = document.getElementsByClassName('cont-serve-list')
      var serveName = document.getElementsByClassName('cont-serve-title')
      for (var ssI = 0, serveLen = serveList.length; ssI < serveLen; ssI++) {
        // console.log(serveList[ssI])
        serveList[ssI].index = ssI
        serveList[ssI].onclick = function () {
          var serveId = this.id
          var serveLoginFlag = false
          var serveGuid
          var serveMapKv = {'服务名称': serveName[this.index].innerText, '场景号名称': _self.pageShow.sceneAccountTitle, '卡片标题': _self.datumJson.title}
          /* eslint-disable */
          TDAPP.onEvent('查看内容详情页', '内容页服务详情', serveMapKv)
          /* eslint-enable */
          // 检查服务登录拦截状态
          if (_self.datumJson.servantExtendContent.type === 'servant' && _self.datumJson.servantExtendContent.matters) {
            for (var serveIndex = 0, serveMattersLen = _self.datumJson.servantExtendContent.matters.length; serveIndex < serveMattersLen; serveIndex++) {
              // console.log(_self.datumJson.servantExtendContent.matters[serveIndex])
              _self.datumJson.servantExtendContent.matters[serveIndex] = _self.datumJson.servantExtendContent.matters[serveIndex].id ? _self.datumJson.servantExtendContent.matters[serveIndex] : JSON.parse(_self.datumJson.servantExtendContent.matters[serveIndex])
              if (serveId === _self.datumJson.servantExtendContent.matters[serveIndex].id) {
                serveLoginFlag = _self.datumJson.servantExtendContent.matters[serveIndex].needLogin
              }
            }
          }
          if (serveLoginFlag) {
            console.log('点击服务需要登录')
            if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
              var u = navigator.userAgent.toLowerCase()
              if (/(iphone|ipad|ipod|ios)/i.test(u)) {
                window.setupWebJsBridge(function (bridge) {
                  bridge.callHandler('getUserStatus', null, function (response) {
                    if (response.login) {
                      serveGuid = response.memberId
                      _self.serveClickEvn(serveId, serveGuid)
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
                    serveGuid = resObj.memberId
                    _self.serveClickEvn(serveId, serveGuid)
                  } else {
                    bridge.callHandler('login', null, function (response) { })
                  }
                })
              })
            } else {
              serveGuid = _self.$getCookie('guid')
              if (serveGuid) {
                _self.serveClickEvn(serveId, serveGuid)
              } else {
                let curUrl = encodeURIComponent(window.location.href)
                window.location.href = 'http://www.api.tianxialashou.com.cn/static/QuickLogin.html?fromurl=' + curUrl
              // _self.loginEvn()
              }
            }
          } else {
            console.log('点服务不不需要登录')
            serveGuid = serveGuid || 'f14807da-56dc-4546-8378-61a1a9eb4266'
            _self.serveClickEvn(serveId, serveGuid)
          }
        }
      }
      // 点击mapImg
      var mapList = document.getElementsByClassName('map-img')
      for (var mapI = 0, mapLen = mapList.length; mapI < mapLen; mapI++) {
        mapList[mapI].addEventListener('click', function () {
          // console.log(this.getAttribute('title'))
          // this.$router.push({ path: '/mapIndex', query: {'longitude': this.getAttribute('lon'), 'latitude': this.getAttribute('lat'), 'mapTitle': this.getAttribute('title'), 'mapAddress': this.getAttribute('address')} })
          window.location.href = '#/mapIndex?longitude=' + this.getAttribute('lon') + '&latitude=' + this.getAttribute('lat') + '&mapTitle=' + this.getAttribute('title') + '&mapAddress=' + this.getAttribute('address')
        })
      }
      // 点击超链接 a   class="href-title"
      var getArticleDom = document.getElementById('contentBoxEdit')
      if (getArticleDom) {
        var getArticleDomHeight = getArticleDom.clientHeight
      }
      var urlAObj = document.getElementsByTagName('a')
      for (var aInd = 0, aLen = urlAObj.length; aInd < aLen; aInd++) {
        var urlAStr = urlAObj[aInd].getAttribute('href')
        if (/(\/#\/|index\.html#\/)/.test(urlAStr)) {    //   /(\/#\/|index\.html#\/)/
          urlAStr = urlAStr.replace('/#/', '/\\#/').replace('/index.html#/', '/\\#/')
          urlAObj[aInd].setAttribute('href', urlAStr)
        }
        urlAObj[aInd].onclick = function (evn) {
          var e = event || evn
          if (e && e.preventDefault) {
            e.preventDefault()
          } else {
            window.event.returnValue = false
          }
          if (this.getAttribute('href')) {
            // console.log(this.getAttribute('href'))
            if (/#\//.test(this.getAttribute('href'))) {
              window.localStorage.setItem('fromArticleShare', window.location.href)
            }
            window.location.href = this.getAttribute('href')
            if (/#\//.test(this.getAttribute('href'))) {  // 延时，a标签的href中有#号时不能跳转
              setTimeout(function () {
                var getArticleDomHeightClick = getArticleDom.clientHeight
                if (getArticleDomHeight === getArticleDomHeightClick) {
                  _self.$router.go(0)
                }
              }, 400)
            }
          }
        }
      }
      // 视频样式
      // var videoBoxArr = document.getElementsByClassName('video-box')
      // var videoArr = document.getElementsByTagName('video')
      // console.log(videoArr)
      // for (var vdInd = 0, vdLen = videoArr.length; vdInd < vdLen; vdInd++) {
        // var u = navigator.userAgent.toLowerCase()
        // if (/(iphone|ipad|ipod|ios)/i.test(u)) {
          // videoBoxArr[vdInd].setAttribute('class', 'video-box ios-video-box')
          // videoArr[vdInd].setAttribute('class', 'video-cont ios-video')
          // // console.log(videoBoxArr[vdInd].offsetHeight)
          // if (videoArr[vdInd].offsetHeight > videoBoxArr[vdInd].offsetHeight) {
          //   var topVal = (videoArr[vdInd].offsetHeight - videoBoxArr[vdInd].offsetHeight) / 75
          //   videoArr[vdInd].style.top = -topVal + 'rem'
          // }
        // } else {
        //   console.log(videoArr[vdInd].getAttribute('class'))
          // videoArr[vdInd].setAttribute('class', 'video-cont andro-video')
      //   }
      // }
      // 监听视频全屏
      document.addEventListener('fullscreenchange', function (e) {
        console.log('fullscreenchange', e)
      })
      document.addEventListener('mozfullscreenchange', function (e) {
        console.log('mozfullscreenchange', e)
      })
      document.addEventListener('webkitfullscreenchange', function (e) {
        console.log('webkitfullscreenchange', e)
      })
      document.addEventListener('msfullscreenchange', function (e) {
        console.log('msfullscreenchange', e)
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
  .articleContentBox {
    position: absolute;
    overflow-y: auto;
    top: 0;
    bottom: 0;
    -webkit-overflow-scrolling: touch;   /*这句是为了滑动更顺畅*/
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    box-sizing: border-box;
    padding-top:88px;
    padding-left:30px;
    padding-right:30px;
    padding-bottom:50px;
    background-color:#fff;
    .detailContent {
      h2 {
        font-size:50px;
        color:#222222;
        line-height: 70px;
        font-weight: 800;
        word-break: break-all;
      }
      .scencePageBox {
        height: 48px;
        display: flex;
        flex-direction:row;
        justify-content:flex-start;
        align-items:center;
        over-flow:hidden;
        img {
          display: inline-block;
          width: 30px;
          /*height: 31px;*/
          margin-right:10px;
          vertical-align: top;
        }
        .scencePageBoxSpan {
          color: #958EE9;
          font-size: 28px;
          line-height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .userInfoBox {
        position: relative;
      }
      .contentBox {
        width: 100%;
        margin-bottom:50px;
        p {
          font-size:36px;
          line-height:58px;
          color:#666;
          word-break: break-all;
          margin-bottom:50px;
        }
        img {
          max-width: 100%;
          width: 100%;
          height:auto;
          border-radius:18px;
          margin-bottom:50px;
        }
        .mapBox {
          margin-bottom:50px;
          img {
           	width: 100%;
           	height:auto;
           	border-radius:18px;
           	margin-top:0;
          }
          p {
            width:690px;
            margin-top:8px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow:ellipsis;
            img {
              width:8px;
              height:15px;
              margin-right:7px;
              vertical-align: middle;
            }
            em {
              font-size:20px;
              color:#666;
              line-height:28px;
            }
          }
        }
      }
    }
    .big-img-box, .video-box-posi {
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
      // display:flex;
      justify-content:center;
      align-items:center;
      overflow-y:scroll;
      img {
        width:100%;
        height:auto;
      }
    }
    .video-box {
      .videoCont {
        width:100%;
      }
    }
    /* 新增底部分享 GXR20180412 */
    .share-box {
      width:100%;
      margin-bottom:0.7rem;
      .shart-title {
        width:100%;
        text-align:center;
        div {
          display:inline-block;
        }
        .share-title-lt, .share-title-rt {
          width:2.3667rem;
          height:0.02667rem;
          background-color:#ddd;
          vertical-align:middle;
          margin-top:-0.13rem;
        }
        .share-title-name {
          width:2.2rem;
          font-size:0.34667rem;
          color:#666;
          text-align:center;
          line-height:0.48rem;
        }
      }
      .share-ul {
        margin-top:0.3733rem;
        display:flex;
        display:-webkit-flex;
        justify-content:space-around;
        li {
          width:1.2rem;
          height:0.58667rem;
          padding-top:1.14667rem;
          font-size:0.34667rem;
          color:#666;
          line-height:0.48rem;
          text-align:center;
        }
        .share-wechat {
          background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAAA0CAMAAADixqUFAAAAY1BMVEUAAABuz0Vuz0Zuz0Zuz0Zv0EVt0UZuz0Zuz0VszUNuz0Zu0EZuz0Zuz0Zuz0Zuz0Zt0UZu0EZuz0Vu0EZuzkb////4/faV3Hfn9+G+6ayy5Z2I12h801fv+unQ78Pa8tCm4I4LP9bTAAAAFHRSTlMA9ejZlDQdsKIRf1S7y0GIJ21hSkjVGCkAAAHNSURBVEjHpZXpcuswCIXRai3eQ7N0ubfv/5RtnE5lR0bI0+8XzKATg8IRPGNm3SophFStmwwcpXcSN4gmwgEmhTvIwUMdUSKBnKAC22IB1QOHkVgmcB0I5HBQ4oQVNKUWBNaggWR1ie9vKc7yGQiGVPPv5eXjDalcWOIexerAN/8xy5lp6lRxvp840zmOsMdqjNf7iWuWM8OMmLjcf/SVzlESTSTeX28XKlet07tL1mEFaigshkQO4QxAH5ru4Ts6WmKQFM5C77ZV3eTrFWQPUWGGCL6yi9ZTxiFj1SQdRMHuuy4u9IQFukcnsVCRBCiJ8ijFyDpPW24jeIkcIW13jlxrf94uu7EYk8NkDDbFt7RhKV5whQs1YWsU5yxesEsfcrcJtTWKaxYvTKRZN35rHB+XTZzqyCdL91vPpvxcwYNRZfcUsQoBP/jmWWGuVCCtRjN/yNw6zfMkDVbRJsfNtAXWELZNtL2NoVHLWdMgw/YR6pcP/52rtR7i0SYak7/pPCYpjMRzVkZDGXYSHTB4pg9pgcPKosAIPLbwFcpCFQ4JGg+VnBS3UTzzrsYJjmCGlUintVg89ihmDmEIs1kG/K0h4W+MDg38EfMziC+DAaJKsuTakwAAAABJRU5ErkJggg==') no-repeat center 0.12rem;
          background-size:0.8667rem 0.6933rem;
        }
        .share-miblog {
          background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAAyCAMAAAAz3ZgNAAAAwFBMVEUAAAD/KA//AA3/AA34kx3/AA3/AA7/AA3/AA34kx75kx3/AA3/AA35lBz5lBz4lB34kx34lB74kx3/AA34lB34lB3/AA33lhv/AA74lB7/AA7/AA7/AA73lR35lB3/AA7///8AAAD4kx7z8/P/7/AxMTH/v8L/Kzb/Hir/hIqJiYkdHR3/9/f/4eLX19f/1Nb/n6T/jpR8fHz/cXn/W2MSEhJsbGzh4eG0tLT/sLSpqamenp7/SlRPT0//OEK/v7/fslEPAAAAH3RSTlMADOy/6BzdPs+QcEpxLyXU9LWogVpMKxOqnZiLW4BBl0KoXAAAAttJREFUSMedlel6qjAQQAOIKFDcrVZ7IyAq7lute9//rS5ZYGLQij1/ZPmOs2QSUEacerFSynleOVcpNhT0IqYnUq46r+k5T6L6/ope8mRyby/oTrXy2XiLIipOo1hiFYD/Io0Sjf+O/kqR+G30Z9rEf5y+ritPmvkwfLOm4YiWfts9s1ittE0nrp90704Ii7gUVfT/eZyKA6PQSCWtYeBDmjtYcd69omTbWERFgNKumvW6WU1WrE4yuZEVFhq4U9tblPQnvYj00k3L8lhCl1weNUd+3z1yARiqbKs8KaPb7cI/5fiCexFgWziFRlexwG/iP4jKr4MOdoq8ZReEOyUZWJPkRBY+yRw/p4Yon6x3Yu1NNYNegOi3ndfzOAN5vltY7Q1Ydw1nQePjWy6RuTGTqevgTNipLW9C256i8s7DHio7ZAXkwkfn7WYTbjbb8+imdKaDzzZvDQtcw0G/B/QH4RXCt7oohaJC2NUs9vzjeDc++uRythpBBoas1xJ5mQSdX1zGZU7vlyOpf0Bc+Waa2GMXGNMn043ky9N6gILXrsiaPTzALr6T+wDso3vLkT0exHonVmHgVmD7E0mf+OzFCkYfoH0f9oATiLwHJ/5myH1Rpw+Wgn4R4vL28zfLR/pM0JkjMuFvZsnGA+hxMhV0Nw1/M01Of+CDPBHn9IsIX+ufnzW5ojfxBDPdEnWLLRsQEGFOZ4/7QU9cOjU98ltBX0OvTzA4hC3Vu3dmfgH6PBJ8PgJMn7O7BRw5cvihUP1O0ne88iF8dVPVX8H3A3fPrva0cp/ZbN8bKIVNBw/y/w6Y4gfE/maZs9jQddnH4TSJvwv2vr8n9s6nKx6ygWmiu1gqO2z6SQLjYOJOgjEN3efHTUtBD9BbmHJeihNE3eWZbzQD/YKhYcZwGx4Gi1l/thgcwm28yzQLPaHZefSpUj8MlIWmramyWwA3C7pld1paIUJrdWxDQb/xH/ZK2THEG7TtAAAAAElFTkSuQmCC') no-repeat center 0.1333rem;
          background-size:0.82667rem 0.6667rem;
        }
        .share-circle {
          background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAMAAAC7m5rvAAAA4VBMVEUAAAD///////////////////////////////////////////////////////////////////////7x31lf8ltanfT1dVVsWfBb5e/vs1u68Vrv9P7wuWi/82eOgPOB6/Lf7P3+8Ozc/Ntwqvb95d78+Nr2hmrq/P1t6fL0yYnL9IPe2fzTzvt0YvH9++zx/N3879u7+bnF3fus8vf70cf69Mb58bf7xLf43rbV95rL9/q31PrKw/mX7/WYi/Xt/ez20p1v82uYwvi1rPfJ+sjk+cDe+LGY9pX16ZL4p5Ly4mvnpRxUAAAAEnRSTlMA93PCQTEP6h7cs5xak8+nT4WYBhbXAAACnUlEQVRIx43W2XbaMBAGYGR5wQabZBrqEgeKCQGysCTQBVq2Nmmavv8D1WMVxmhs6H/JOR+WNJqjKeXFNo2KdEA4smKYdum/UjakgLg7+5Jk1o1BSKN8EpmeiGdvvff79N5mIDzzKLIkAKA5SBcikFYhsn2YbADiHmOtVRt8u+BT7mjTaNyiYywMf4Kb+8GqmFw1GuQ0FrbaosqVAV8TQ46xcPgARq7ijhjmu+6qpMjpDN3BOi1Bihxn4b2wSNnuhAi5HDaMXKqDP8Iz5I6zcAX+fomw0RA5Yvvt7ZYpaYnMMTaMpFIm3DJDTmN4XcyUeZOr/KSOsQfwUJUFFAedYqRAYP8ZBSCo1aSDLmWkouvISJj89E7PDYhz1dFnQeJSRqr+JJNSi99MZXvkHOIYGan6D2En5/iHq/LBJQdkpOrXyVkaI6aSX7ORO3aPCpNsrnLDlKd1vWJDpTDtCp6IpuBM68UAWUbhmTifdQVljfnQIoX55pQgZaTmIHjnt0ilDEoCGam7Zh5bKUVMLZLUZZMvsgIRKsqTo46EFLKqxlxQiphUBSCFTB4qU1dYACw3KWT65wJdYbnxcpFSzLGyO9MVXi68yqQU64Czr7hdYwqvMjYOKcW2HQDPtNMn0iFFW5NYlZFSxC4uEgdOELiQJGrrAQP/UYyUIobuSERaWA+VxtAtP+an7/2ry/xSZ+j6gw95GezaUY45K3YLue/DOWOFbgkWNVSTsQI36PuZh2rMWIFbuHb2WXxhLNdNhXX4CP/ijLup3lTGzhHjbpo3KrxojLkFKj7OjJvEuBv0RTV/eII5Md1N6WHgo9r4Dhl3yz749rHBcIxMyxpAWqfGUOi8bolsXx/XNIaeGHqh8/yY5LmzPjX08hEbikfsvwzcxH3YySnEAAAAAElFTkSuQmCC') no-repeat center 0.10667rem;
          background-size:0.72rem 0.72rem;
        }
      }
    }
  }
</style>
<!-- 新版本富文本生成的html代码块 >>> 深度查询样式 -->
<style scoped>
  .content-box-edit {
    width: 100%;
    margin-bottom:0.7rem;
  }
  .content-box-edit >>> div {
    width:100%;
    font-size: 0.373333rem;
    line-height: 0.64rem;
    word-break: break-all;
  }
  .content-box-edit >>> p {
    font-size:0.48rem;
    line-height:0.773333rem;
    color:#666;
    word-break: break-all;
    margin-top:0.533333rem;
  }
  .content-box-edit >>> a {
    /*display: block;*/
    text-decoration: none;
  }
  .content-box-edit >>> img {
    max-width: 100%;
    width: 100%;
    height:auto;
    border-radius:0.24rem;
    margin-top:0.533333rem;
  }
  .content-box-edit >>> h1 {
    font-size: 0.64rem;
    line-height: 1.04rem;
    margin-top:0.53333rem;
  }
  .content-box-edit >>> h2 {
    font-size: 0.56rem;
    line-height: 0.906667rem;
    margin-top:0.533333rem;
  }
  .content-box-edit >>> h3 {
    font-size: 0.48rem;
    line-height: 0.746667rem;
    margin-top:0.533333rem;
  }
  .content-box-edit >>> h4 {
    font-size: 0.4266667rem;
    line-height: 0.693333rem;
    margin-top:0.533333rem;
  }
  .content-box-edit >>> h5 {
    font-size: 0.373333rem;
    line-height: 0.64rem;
    margin-top:0.53333rem;
  }
  .content-box-edit >>> h6 {
    font-size: 0.32rem;
    line-height: 0.586667rem;
    margin-top:0.533333rem;
  }
  /* 嵌入商品样式 */
  .content-box-edit >>> .cont-goods-list {
    width: auto;
    height:1.84rem;
    padding:0.266667rem 0.266667rem 0;
    display:flex;
    display:-webkit-flex;
    border: 1px solid #ebebeb;/*no*/
    background-color:#f7f8f8;
    margin-top:0.533333rem;
    border-radius: 0.186667rem;
  }
  .content-box-edit >>> .cont-goods-lt {
    /* width:1.6rem; */
    width: 19%;
  }
  .content-box-edit >>> .cont-goods-lt-img {
    width:1.6rem;
    height:1.6rem;
    border-radius:0.106667rem;
    margin-bottom: 0;
    margin-top: 0;
    min-width: 1.6rem;
  }
  .content-box-edit >>> .cont-goods-rt {
    width: 81%;
    margin-left:0.32rem;
  }
  .content-box-edit >>> .cont-goods-rt-title {
    width:85%;
    font-size:0.346667rem;
    line-height:0.493333rem;
    color:#3c3c3c;
    letter-spacing:1px;
    max-height:0.96rem;
    overflow:hidden;
    margin-bottom: 0;
    margin-top: 0;
  }
  .content-box-edit >>> .cont-goods-rt-bot {
    margin-top:0.146667rem;
    display:flex;
    display:-webkit-flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
    margin-bottom: 0;
    margin-top: 0;
    line-height: 0.44rem;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .content-box-edit >>> .cont-goods-rt-bot-price {
    font-size:0.32rem;
    color:#F82442;
  }
  .content-box-edit >>> .cont-goods-rt-bot-store {
    font-size:0.32rem;
    color:#a0a0a0;
  }
  .content-box-edit >>> .cont-goods-list:first-child {
    border-top:none;
  }
  /* 嵌入服务样式 */
  .content-box-edit >>> .cont-embedded-serve {
    margin-top:0.533333rem;
  }
  .content-box-edit >>> .cont-serve-list {
    max-width: 2.5rem;
    height: 0.933333rem;
    padding: 0 0.4rem;
    margin: 0 auto;
    border-radius: 0.933333rem;
    display:flex;
    display:-webkit-flex;
    flex-direction: row;
    justify-content:space-between;
    align-items: center;
    background-color: #F7F8F8;
  }
  .content-box-edit >>> .cont-serve-img {
    width: 0.933333rem;
    height: 0.933333rem;
    border-radius: 0;
    margin-bottom: 0;
    margin-top: 0;
  }
  .content-box-edit >>> .cont-serve-title {
    font-size: 0.346667rem;
    color: #666;
    margin-bottom: 0;
    margin-top: 0;
    margin-left: 0.13rem;
    line-height: 0.35rem;
    word-break: break-all;
  }
  /* video */
  .content-box-edit >>> video::-webkit-media-controls-fullscreen-button {
    display: none;
  }
  .content-box-edit >>> .video-box {
    width: 100%;
    height: 5.175rem;
    /*height: auto;
    max-height: 5.175rem;*/
    border-radius: 0.24rem;
    margin-top:0.533333rem;
    overflow: hidden;
    /*background-color: #000;*/
  }
  .content-box-edit >>> .ios-video-box {
    background-size:cover;
    position: relative;
    height: 5.175rem;
  }
  .content-box-edit >>> .video-cont {
    width: 100%;
    height: 100%;
    /*height: auto;*/
    object-fit: cover;
    background-size:cover;
  }
  .content-box-edit >>> .ios-video {
    width: 100%;
    /*height: auto;*/
    object-fit: cover;
    background-size:cover;
    position: absolute;
    left: 0;
    top: 0;
  }
  /*.content-box-edit >>> .andro-video::-webkit-media-controls-panel {
    position:absolute;
    top: 4.4rem;
    height: 0.8rem;
  }*/
  /* map */
  .content-box-edit >>> .map-box {
    width: 100%;
    margin-top:0.533333rem;
  }
  .content-box-edit >>> .map-img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 0.24rem;
    margin-bottom: 0.21333rem;
    margin-top: 0;
  }
  .content-box-edit >>> .map-address {
    margin-bottom: 0;
    margin-top: 0;
    padding-left: 0.306667rem;
    font-size: 0.32rem;
    color: #666;
    line-height: 0.453333rem;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAPBAMAAAArJJMAAAAAJ1BMVEUAAAA8PDw8PDw9PT09PT09PT09PT0+Pj4+Pj5BQUE+Pj49PT08PDwPVQ3BAAAADHRSTlMA9ezayl1TRjovJd56IMfEAAAALUlEQVQI12MAA+cFQOKMJog41AAkzoiDiIMJQOLMURBxGsyCiYnD1GlC9EIAAN7SGh5ZtD40AAAAAElFTkSuQmCC') no-repeat left center;
    background-size: 0.106667rem 0.1733333rem;
  }
  /* img */
  .content-box-edit >>> .img-box {
    width: 100%;
    margin-top:0.533333rem;
    line-height: 0;
  }
  .content-box-edit >>> .img-url {
    max-width: 100%;
    width: 100%;
    height:auto;
    border-radius:0.24rem;
    margin-top: 0;
  }
  .content-box-edit >>> .img-title {
    font-size: 0.373333rem;
    line-height: 1.066667rem;
    max-height: 1.04rem;
    overflow: hidden;
    text-align: center;
    margin-top: 0;
    margin-bottom: 0;
  }
  /* 文字超链接 href */
  .content-box-edit >>> .href-title {
    display: inline-block;
    font-size:0.48rem;
    line-height:0.773333rem;
    color:#4A90E2;
    word-break: break-all;
    padding-left: 0.53333rem;
    margin-left: 0.1rem;
    background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAANlBMVEUAAABKkONYnPBKkeNNlOhLkeNLkuRKkeNKkONMkuRKkeNKkeNLkeRLkeNLkORLkeRLkuZNkuWc8SlGAAAAEnRSTlMA/gq3GuxX091GxKZ5koZpOix7W+tUAAAAxElEQVQoz3WQ2xrDIAiDQaVa7Wnv/7ILWzvz2S5X4i+EKKPSWtTiJHdN+lUMj6QWZwPZcdfwfjbV6UZWcc3ofSQQ2ogsINtVFEY7k5dqFip0+YXLVEhzn8NaOEnpwUzLxy6eJHUrBBIJ0fM0GF3k2JJkBAHzPJvWa9qMDp+144w2TOR/WyTAAFfVEZPV16pYKnGeBNKuIlTOszKBk/U8BRZE9OA8mcksXab2h4jnHwjvDpaIcJta0YF0D8ed0MxomvHDg96hbASWmtLQCAAAAABJRU5ErkJggg==') no-repeat left center;
    background-size: 0.346667rem 0.346667rem;
  }
  /* 引用样式 */
  .content-box-edit >>> blockquote {
    padding: 0.266667rem 0 0.266667rem 0.3rem;
    background-color: #F7F7F7;
    border-left: 0.16rem solid #B4B4B4;
    font-size: 0.373333rem;
    line-height: 0.613333rem;
    color: #3c3c3c;
    word-break: break-all;
  }
</style>
