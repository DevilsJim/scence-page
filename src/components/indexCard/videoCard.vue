<template>
  <div class="video-card-box">
    <h3 v-if="datumJson.title">{{ datumJson.title }}</h3>
    <div class="timeBox">
      <p><em class="timeIcon"></em><i>{{ cardData.displayTime }}</i></p>
      <!-- <p><em class="readIcon"></em><i>{{ cardData.browseCount }}</i></p> -->
      <p><em class="commonIcon"></em><i>{{ cardData.commentCount | getLikesNum }}</i></p>
      <p><em class="likesIcon"></em><i>{{ cardData.likeCount | getLikesNum }}</i></p>
    </div>
    <div class="imageTextShow">
      <!--无图-->
      <p v-if="datumJson.textContent" class="showText">{{ datumJson.textContent[0].matter }}</p>
      <!--单张图-->
      <div v-if="datumJson.styleType === 'v-default'" class="imgShow" :style="{backgroundImage: 'url(' +datumJson.mediaContent[0].additionProps.cover+ ')'}">
        <div class="video-contrel">
          <p class="video-contrel-num" v-if="datumJson.mediaContent[0].additionProps.browseCount">{{ datumJson.mediaContent[0].additionProps.browseCount }}</p>
          <p class="video-contrel-time" v-if="datumJson.mediaContent[0].additionProps.duration">{{ datumJson.mediaContent[0].additionProps.duration }}</p>
        </div>
      </div>
    </div>
    <div class="cont-embedded-box" v-if="datumJson.embedded && datumJson.extendContents[0].matters.length">
      <!-- 嵌入服务 -->
      <ul class="cont-embedded-serve" v-if="datumJson.extendContents[0].type === 'servant' &&  datumJson.extendContents[0].matters.length" ref="contServeBox">
        <li v-for="(serItem, serIndex) in datumJson.extendContents[0].matters" :key="serIndex" @click.stop="layoutEvn(serItem.id, serItem.needLogin, serItem.title)" v-if="serIndex < 4">
          <img :src="serItem.icon" alt="">
          <p>{{ serItem.title }}</p>
        </li>
      </ul>
      <!-- 嵌入商品 -->
      <div class="cont-embedded-goods-box" v-if="datumJson.extendContents[0].type === 'product' &&  datumJson.extendContents[0].matters.length">
        <div class="cont-embedded-goods" ref="contGoodsList">
          <div class="cont-goods-list" v-for="(goodsItem, goodsIndex) in datumJson.extendContents[0].matters" :key="goodsIndex" @click.stop="toShopDetail(goodsItem.id, goodsItem.name, goodsItem.price, goodsItem.storeName, goodsItem.url)">
            <div class="cont-goods-lt">
              <img class="cont-goods-lt-img" ref="contGoodsPicture" :src="goodsItem.picture" alt="">
            </div>
            <div class="cont-goods-rt">
              <p class="cont-goods-rt-title">{{ goodsItem.name }}</p>
              <p class="cont-goods-rt-bot">
                <em class="cont-goods-rt-bot-price">￥ {{ goodsItem.price }}</em>
                <em class="cont-goods-rt-bot-store">{{ goodsItem.storeName }}</em>
              </p>
            </div>
          </div>
        </div>
        <div v-if="contEmbeddedGoodsFlag" @click.stop="contGoodsEvn()" class="cont-goods-icon" :class="[contGoodsFlag ? 'cont-goods-up' : '']"></div>
      </div>
    </div>
    <!-- 卡片来源 -->
    <!-- <ul v-if="datumJson.actionLayouts && datumJson.actionLayouts.length" class="templateBtn">
      <li v-for="(item, index) in datumJson.actionLayouts" :key="index">
        <em class="link-box" v-if="item.type === 'link'" @click="goHtml(item.link.options.urlString)" :style="{backgroundImage: 'url(' +item.icon+ ')'}">{{ item.title }}</em>
        <em v-if="item.type === 'servant'">{{ item.title }}</em>
      </li>
    </ul> -->
  </div>
</template>

<script type="text/ecmascript-6">
  import Toast from '@/components/toast'
  export default {
    name: 'videoCard',
    props: [
      'cardData'
    ],
    data () {
      return {
        'actIndex': -1,
        'imagessFlagMore': true,
        'contEmbeddedGoodsFlag': true, // 卡片中嵌入的商品
        'contGoodsFlag': false,
        'moreNum': 0,
        'btnLiWidth': 0,
        'datumJson': {},
        'serveDatumJson': {}, // 嵌入服务的data
        'goodsData': [
          {'image': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522899734&di=255a777cbd543bd29ee9c46d98e59f32&imgtype=jpg&er=1&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dpixel_huitu%252C0%252C0%252C294%252C40%2Fsign%3D7f3f2d10e0c4b7452099bf56a6847b7b%2Fe824b899a9014c081b6c839c017b02087bf4f4b0.jpg', 'title': 'sssssssss', 'store': 'store', 'price': '5555'}
        ]
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
      goHtml () {
        console.log('goHtml')
      },
      contGoodsEvn (ind) {
        // console.log(this.contGoodsFlag)
        if (this.contGoodsFlag) {
          this.contGoodsFlag = false
          this.$refs.contGoodsList.style.height = '2.106667rem'
        } else {
          this.contGoodsFlag = true
          this.$refs.contGoodsList.style.height = 'auto'
        }
      },
      layoutEvn (id, needLoginFlag, serveTitle) {
        // console.log(this.cardData.sceneAccountTitle)
        var _self = this
        var serveGuid
        var serveMapKv = {'服务名称': serveTitle, '场景号名称': _self.cardData.sceneAccountTitle, '卡片标题': _self.datumJson.title}
        /* eslint-disable */
        TDAPP.onEvent('查看场景号主页', '场景号主页服务', serveMapKv)
        /* eslint-enable */
        if (needLoginFlag) {
          console.log('点击服务需要登录')
          if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
            var u = navigator.userAgent.toLowerCase()
            if (/(iphone|ipad|ipod|ios)/i.test(u)) {
              window.setupWebJsBridge(function (bridge) {
                bridge.callHandler('getUserStatus', null, function (response) {
                  if (response.login) {
                    serveGuid = response.memberId
                    _self.serveClickEvn(id, serveGuid)
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
                  _self.serveClickEvn(id, serveGuid)
                } else {
                  bridge.callHandler('login', null, function (response) { })
                }
              })
            })
          } else {
            serveGuid = _self.$getCookie('guid')
            if (serveGuid) {
              _self.serveClickEvn(id, serveGuid)
            } else {
              let curUrl = encodeURIComponent(window.location.href)
              window.location.href = 'http://www.api.tianxialashou.com.cn/static/QuickLogin.html?fromurl=' + curUrl
              // _self.loginEvn()
            }
          }
        } else {
          console.log('点服务不不需要登录')
          serveGuid = serveGuid || 'f14807da-56dc-4546-8378-61a1a9eb4266'
          _self.serveClickEvn(id, serveGuid)
        }
      },
      serveClickEvn (serveId, serveGuid) {
        var _self = this
        _self.$http.get(_self.$host + '/gateway/delegate/servants/' + serveId + '/display', {
          headers: {
            guid: serveGuid
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
          // console.log(_self.serveDatumJson)
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
      toShopDetail (id, name, price, storeName, url) {
        // console.log(url)
        var goodsMapKv = {'商品名称': name, '商品店铺': storeName, '商品价格': price, '场景号名称': this.cardData.sceneAccountTitle, '卡片标题': this.datumJson.title}
        /* eslint-disable */
        TDAPP.onEvent('查看场景号主页', '场景号主页商品', goodsMapKv)
        /* eslint-enable */
        if (window.navigator.userAgent.toLowerCase().indexOf('lashoucloud') > 0) {
          window.connWebJsBridge(function (bridge) {
            bridge.callHandler('push', {
              router: 'LSMall',
              options: {urlString: url}
            })
          })
        } else {
          window.open(url)
        }
      }
    },
    created () {
      this.datumJson = JSON.parse(this.cardData.datum)
      // 将嵌入式字符串转为Json
      // console.log(this.datumJson.embedded)
      if (this.datumJson.embedded) {
        // for (var j = 0, len = this.datumJson.extendContents.length; j < len; j++) {
          // console.log(this.datumJson.extendContents[j])
        for (var i = 0; i < this.datumJson.extendContents[0].matters.length; i++) {
          this.datumJson.extendContents[0].matters[i] = JSON.parse(this.datumJson.extendContents[0].matters[i])
        }
        // }
      }
      // 新版富文本
      if (!this.datumJson.mediaContent) {
        this.datumJson.mediaContent = this.datumJson.imageContent
      }
      // if (this.datumJson.actionLayouts && this.datumJson.actionLayouts.length) {
      //   var BtnLiNum = this.cardData.actionLayouts.length
      //   this.btnLiWidth = (100 / BtnLiNum).toFixed(2)
      // }
    },
    mounted () {
      // 卡片中嵌入服务为1个时靠左对齐
      if (this.datumJson.embedded && this.datumJson.extendContents[0].type === 'servant' && this.datumJson.extendContents[0].matters.length) {
        if (this.datumJson.extendContents[0].matters.length < 2) {
          this.$refs.contServeBox.style.justifyContent = 'flex-start'
          this.$refs.contServeBox.style.marginLeft = '0.6rem'
        }
      }
      // 卡片中嵌入商品1个时隐藏下拉按钮
      if (this.datumJson.embedded && this.datumJson.extendContents[0].type === 'product' && this.datumJson.extendContents[0].matters.length) {
        if (this.datumJson.extendContents[0].matters.length < 2) {
          this.contEmbeddedGoodsFlag = false
        }
      }
    }
  }
</script>

<style lang="sass" scoped>
  .video-card-box {
    min-height:200px;
    _height:200px;
    padding:25px 30px 1px;
    background-color:#fff;
    h3 {
      height:56px;
      font-size:40px;
      color:#3c3c3c;
      line-height:56px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow:ellipsis;
    }
    .timeBox {
      height:33px;
      display: flex;
      display:-webkit-flex;
      flex-direction:row;
      align-items:center;
      margin-top:10px;
      margin-bottom:26px;
      p {
        display: flex;
        display:-webkit-flex;
        flex-direction:row;
        align-items:center;
        height:33px;
        margin-right:28px;
        em {
          display: block;
          width:30px;
          height:30px;
          margin-right:13px;
        }
        i {
          display:block;
          font-size:24px;
          line-height:30px;
          color:#818181;
          font-style:normal;
        }
        .timeIcon {
          background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAcpJREFUSA3tlkFqwzAQRW25d4gpdON2awKlhh4iuy57GV+my+58iIJDIWSbZlMI9iHs9E8qg2Ykqw6Vs4ohWBrN/KcZK5Ki6PpcqALxOZzNZvN4PB5XcRw/IO5Wxx5g28FWLZfLz6l6f4IhqgB8hXCJduYThs8ePiUm8IZ27/X1DW6327uu697hU/j8HGN1kiQveZ5/O8ZOptGMAX3q+75CBouxYJ8dGbdKqRXga5efE0yZAlr7oIvF73zatnXpnmwaXrgyVzIKMEXl9UEpJk3T00/Gm33S0FoWxzLQQkLwud/U5Ml2oTWZ3QKjPCXzCNBxaTKw/p9mAVhMAiXPSNs0MjAcVuZgyLbUZmCUhHakWR6pfSMowzYozONd7FLOwaZpIvFXY9osY6fCTEaZ8WEqB4tlquvgx7RZxlgAu8Er9FtqMzAWQBUaOOhJbWuvRgm/MLtsCAjxBnSPRXhvarGMaQDQ0nQI0XZpWhnDiQ7+DwBD7dc1sn1G1uxiYGVMDnSI4z1+3k0sA2loLQalcAtMRjo/6RD/D5xi9UXAeQtxgjV8jUAqd039M5+aYsduH6RlfWMJ0N/8spc9OQk62jCRINdbqX3tz1aBH9QIxb+GdsGbAAAAAElFTkSuQmCC') no-repeat center;
          background-size:100%;
        }
        .readIcon {
          background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAM1BMVEUAAADGxsbGxsbOzs7GxsbIyMjGxsbGxsbFxcXFxcXIyMjFxcX////x8fHa2trKysr4+Pg4P5xGAAAAC3RSTlMA5GsP8kmykHc+Jf+JfUoAAACGSURBVCjPvZJZDoMwDERLFraM7dz/tC3BUgmg+YP5s5+8+/OC4rrGexDGVH5KY4hnNG3ElaYO56F0GvKfhXJRODMVQLSny26ZoElst5cGvZ6gqplWiNfd2Ow5UVuIVXjm+RjoPj2EZm8AMK8NuCtTyNLShtgodAlsfWzx7GTs2ORNyIM9ri9XuBHdu8bzDgAAAABJRU5ErkJggg==') no-repeat center;
          background-size:100%;
        }
        .commonIcon {
          background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcBAMAAACAI8KnAAAAJFBMVEUAAADGxsbHx8fFxcXFxcXGxsbIyMjGxsbFxcX4+Pj////V1dXFzPFUAAAACHRSTlMA40nzsHAcmYRLz3UAAABNSURBVBjTY6AIKHbAgRCQK4HgNgK5HUiAUm73zB0dO2eDKDC3c9WMjlkrQRQaF10xFZ2B5kF078OBR4cDchglNycgc1lbUYOwgHAoAwDNjHYzg3gGngAAAABJRU5ErkJggg==") no-repeat center;
          background-size:100%;
        }
        .likesIcon {
          background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAWCAMAAADto6y6AAAAM1BMVEUAAADJycnFxcXGxsbHx8fGxsbJycnX19fFxcXGxsbFxcXHx8fGxsbHx8fIyMjJycnFxcW3BcWWAAAAEHRSTlMAJOXzP9wTCbWun5VnW0ovKADoXwAAAHdJREFUKM9tz0sOwyAMRdFLbCD/eP+rrUSpXMV+I3SPJzDWHy2MFX06v5VdzKyecFYzk30eqdh36zofouNeLEwKsFmyDZqla9w53Fw5XGgOSpesS4cjgwNoNfbaxg+Xd18KuMTu4t0ldhfvmXh38R5k9iizR/nvHwlDEq8bcauCAAAAAElFTkSuQmCC") no-repeat center;
          background-size:100%;
        }
      }
    }
    .imageTextShow {
      padding-bottom:34px;
      .showText {
        font-size:28px;
        color:#666;
        line-height:44px;
        max-height:88px;
        margin-bottom:28px;
        word-break: break-all;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .imgShow {
        /*width:690px;*/
        height:280px;
        overflow:hidden;
        -moz-border-radius: 18px;
        -webkit-border-radius:18px;
        border-radius:18px;
        background: no-repeat center;
        background-size: cover;
        position:relative;
        .video-contrel {
          position:absolute;
          left:0;
          right:0;
          top:0;
          bottom:0;
          width:100%;
          height:100%;
          background:rgba(50, 50, 50, 0.3) url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAWlBMVEX///8AAAD///////////////////////////////////////////9vb2+GhoaWlpbAwMDk5OT///////////////////////+kpKSxsbF4eHjQ0NDx8fFmZmbU/IECAAAAHXRSTlPMAL0SHLKgdEmrfWsv/PPt39WXjFdAJwvo4/ja0F3SmZEAAAH/SURBVGjevNaJdoIwEIXhayYrwaUsYm15/9esR23RHpQMWf4X+A7JMIBNYFRb32qnBCCU0623NW0CQxBgK4WZVGUpDSK9w5ucl7EIdRqL6Y4iEDIIzNBKRFZgVMkVyGDAzAxcxAqwE5aFyAaramQ40gusTPShiEFEJgghjag0LSNSITIll5CjQHTi+B6pBRIk6hmE8RycZ5lHpECihHyFkEKyFL1ANBKm5xGDpJk5pEfi+glhXzr/8iekQfKa/4hFhuwzMghkSAxPiEGWzCMikSn5gFTIVDUhhGzRH2KQLfOLEDJGd6RDxro7opExfUMksiaviEdYh/3+AH7+ijgEtRsvnb/AzV2Q0Nk6jbf23/z5Quj+PY/3tgf2LkboShmndh/M1YKNYiPj9hOM1AYEJsJ/GELNQqZOCK6GXYPwptnCr0CY0+zRrkCY09xCcxH+AGg4PsKdZgfFRfhjpiBikXHxxAQQjSwfWBGkyHEVufgiI1zkZSyyVoosyCKrvshHq8jnt8SPRKlfIougfqq1AyIAQBiGgQrwbxcLsO2e4qJNsurjjsxUMbjJdSAnSNw5ckzJxRawgGAPAXAIihJQjeBBAToFsiXwWWB0IQSE2iCSRugmIc6EAnwvM2e0bIZgbqvyJOnfyRfSQoxiUpIZx9xmPtnB0mF69UtENpDDbUdiT14o1BvcAAAAAElFTkSuQmCC') no-repeat center;
          background-size:100px 100px;
          .video-contrel-num {
            position:absolute;
            left:16px;
            bottom:14px;
            height:30px;
            padding-left:28px;
            background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAIVBMVEUAAAD////////////////////////////////////////PIev5AAAACnRSTlMA8xGFvVDmb2Apv3O9hQAAADhJREFUCNdjYApVYACDaauEISyvVVCW1CooC0hDWKvAQBzGWNUAYzjAGehS4nDtMAMRViAshTsDAH0DL1UXJErDAAAAAElFTkSuQmCC') no-repeat left center;
            background-size:16px 16px;
            color:#fff;
            font-size:22px;
            line-height:30px;
          }
          .video-contrel-time {
            position:absolute;
            right:16px;
            bottom:14px;
            color:#fff;
            font-size:22px;
            line-height:30px;
          }
        }
      }
    }
    .cont-embedded-box {
      border-radius:18px;
      background-color:#fcfcfc;
      border:1px solid #ebebeb;/*no*/
      margin-bottom:30px;
      .cont-embedded-serve {
        height:194px;
        display:flex;
        display:-webkit-flex;
        flex-direction:row;
        justify-content:space-around;
        align-items:center;
        li {
          width:96px;
          overflow:hidden;
          img {
            width:88px;
            height:88px;
          }
          p {
            margin-top:18px;
            text-align:center;
            font-size:22px;
            line-height:30px;
            color:#787878;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
        }
      }
      .cont-embedded-goods-box {
        border-radius:18px;
        background-color:#f7f8f8;
        border:1px solid #ebebeb;/*no*/
        position:relative;
        .cont-embedded-goods {
          height:158px;
          overflow:hidden;
          .cont-goods-list {
            height:138px;
            padding:20px 20px 0;
            display:flex;
            display:-webkit-flex;
            flex-direction:row;
            border-top:1px solid #ebebeb;/*no*/
            .cont-goods-lt {
              width:19%;
              .cont-goods-lt-img {
                width:120px;
                height:120px;
                border-radius:8px;
              }
            }
            .cont-goods-rt {
              width:81%;
              margin-left:24px;
              .cont-goods-rt-title {
                width:80%;
                font-size:26px;
                line-height:37px;
                color:#3c3c3c;
                letter-space:1px;
                max-height:72px;
                overflow:hidden;
              }
              .cont-goods-rt-bot {
                margin-top:13px;
                display:flex;
                display:-webkit-flex;
                flex-direction:row;
                justify-content:space-between;
                align-items:center;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
                .cont-goods-rt-bot-price {
                  font-size:24px;
                  color:#F82442;
                }
                .cont-goods-rt-bot-store {
                  font-size:24px;
                  color:#a0a0a0;
                }
              }
            }
          }
          .cont-goods-list:first-child {
            border-top:none;
          }
        }
        .cont-goods-icon {
          width:50px;
          height:50px;
          position:absolute;
          top:0;
          right:0;
          background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAJ1BMVEUAAADY2NjY2Njb29vY2NjY2Nja2trY2NjY2NjY2Nj////r6+vw8PCI/3rFAAAACXRSTlMA6cU++diJVCGVMHhBAAAAoklEQVQ4y+3QwQ2CQBSEYXrwYgWeacEOLIUSbMEVTSZawWIDKxVoKIqQDAwE5sSJhHfZl3z772EzzOZ8yrNusDCPwgnC1QkOVsrcCY5WghUUVi5W7laeVoKVm5XSCtZIzZOb5BUTtI3lGyvKn5uEV9+RotdixUSvDdFPCaWPPkwkiphIFDHpRVHDhKKomzQRRUwkitKS6IskipIR1HCCXbYjLclB5unYmp0cAAAAAElFTkSuQmCC') no-repeat;
          background-size:50px 50px;
        }
        .cont-goods-up {
          background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAM1BMVEUAAADY2NjZ2dnY2NjY2Nja2trY2NjY2NjZ2dna2trg4ODb29vf39/Y2Nj////r6+vv7++6IolgAAAADXRSTlMAydf466SYaFhEIRUIt6rhIQAAAJFJREFUSMft00sKw0AMBNGW47/d9tz/tNkGQpG011P7BxJI8o9eY03Lrs/8V7Ui4YYNCTefMXEdMfFwxMR1xsRzTrzlZMiJ15xUTrznZMnJlJPKyYjkvunnROK6yAgFGpFgIxJsRIKNSLRGRiRsMkKBRiTYiAQbkWAjEt+GSYPT4cEaHCiv3+ANgGCddNLJU/IGJzp8IpEdbmYAAAAASUVORK5CYII=') no-repeat;
          background-size:50px 50px;
        }
      }
    }
    .templateBtn {
      height:89px;
      border-top:1px solid #ebebeb;
      display:flex;
      display:-webkit-flex;
      flex-direction:row;
      align-items:center;
      li {
        width:auto;
      	height:auto;
        border-right:1px solid #ebebeb;
        em {
          display: block;
          width:100%;
          font-size:24px;
          color:#999;
        }
        .link-box {
          padding-left:42px;
          background-repeat:no-repeat;
          background-position:left center;
          background-size:30px 30px;
        }
      }
      li:last-child {
        border-right:none;
      }
    }
  }
</style>
