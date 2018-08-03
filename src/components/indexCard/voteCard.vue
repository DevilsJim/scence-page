<template>
  <div class="vote-box">
    <h3 v-if="datumJson.title"><span class="vote-state-true" v-if="datumJson.additionProps.activityStatus === 'active'">进行中</span><span class="vote-state-false" v-else>已结束</span>{{ datumJson.title }}</h3>
    <div class="timeBox">
      <p><em class="timeIcon"></em><i>{{ cardData.displayTime }}</i></p>
      <!-- <p><em class="readIcon"></em><i>{{ cardData.browseCount }}</i></p> -->
      <!-- <p><em class="commonIcon"></em><i>{{ cardData.commentCount | getLikesNum }}</i></p>
      <p><em class="likesIcon"></em><i>{{ cardData.likeCount | getLikesNum }}</i></p> -->
      <p class="vote-people" v-if="datumJson.additionProps.allOptionPull">{{datumJson.additionProps.allOptionPull}}人参与</p>
    </div>
    <div class="vote-show">
      <!-- 进行中且未投票 -->
      <div class="vote-now-true" v-if="datumJson.additionProps.activityStatus === 'active' && datumJson.additionProps.memberVoted === false">
        <div class="vote-true-list" v-for="(item, index) in datumJson.mediaContent" :key="index" v-if="item.type === 'option'">
          <p class="vote-true-name">{{item.matter.title}}</p>
          <div class="vote-true-ratio">
            <!-- <span class="vote-true-ratio-absolute"></span> -->
          </div>
        </div>
      </div>
      <!-- 进行中已投票 或 已结束 -->
      <div class="vote-now-false" v-else>
        <div class="vote-false-list" v-for="(item, index) in datumJson.mediaContent" :key="index" v-if="item.type === 'option'">
          <p class="vote-false-name">{{item.matter.title}}</p>
          <div class="vote-false-num">
            <div class="vote-false-ratio">
              <span :style="{width: item.matter.poll / datumJson.additionProps.allOptionPull * 100 + '%'}" class="vote-false-ratio-absolute"></span>
            </div>
            <p class="vote-false-num-people">{{item.matter.poll}}票</p>
          </div>
        </div>
      </div>
      <!-- 有图片需展示 -->
      <div class="vote-img-box" v-if="datumJson.styleType === 'v-imageOptions'">
        <img :src="datumJson.imageMediaContent.matter" class="vote-img-show" alt="">
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
  export default {
    name: 'voteCard',
    props: [
      'cardData'
    ],
    data () {
      return {
        'actIndex': -1,
        'voteState': true, // 投票的当前状态
        'votePeople': 10 // 投票参与人数
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
        }
      }
    },
    created () {
      // console.log(this.cardData)
      this.datumJson = JSON.parse(this.cardData.datum)
      // console.log(this.datumJson)
      // 将投票卡片mediaContent下的matter转化为JSON对象
      for (var i = 0, len = this.datumJson.mediaContent.length; i < len; i++) {
        if (this.datumJson.mediaContent[i].type === 'option') {
          this.datumJson.mediaContent[i].matter = JSON.parse(this.datumJson.mediaContent[i].matter) ? JSON.parse(this.datumJson.mediaContent[i].matter) : this.datumJson.mediaContent[i].matter
        }
      }
    }
  }
</script>

<style lang="sass" scoped>
  .vote-box {
    padding:25px 30px 1px;
    background-color:#fff;
    h3 {
      display:flex;
      display:-webkit-flex;
      align-items:center;
      height:56px;
      font-size:40px;
      color:#3c3c3c;
      overflow: hidden;
      white-space: nowrap;
      text-overflow:ellipsis;
      span {
        height:42px;
        display:inline-block;
        padding:0 17px;
        margin-right:30px;
        font-size:20px;
        line-height:42px;
        border-radius:42px;
      }
      .vote-state-true {
        color:#fff;
        background-color:#7F7AFE;
      }
      .vote-state-false {
        color:#999;
        background-color:#ebebeb;
      }
    }
    .timeBox {
      height:33px;
      display: flex;
      display:-webkit-flex;
      flex-direction:row;
      align-items:center;
      margin-top:10px;
      margin-bottom:28px;
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
      }
      .vote-people {
        color: #818181;
      }
    }
    .vote-show {
      min-height:160px;
      /*max-height:244px;*/
      padding-bottom:20px;
      display:flex;
      display:-webkit-flex;
      justify-content:space-between;
      .vote-now-true {
        flex: 1;
        padding-top:3px;
        .vote-true-list {
          padding-left:51px;
          margin-bottom:15px;
          background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAHlBMVEUAAADc3Nzc3Nzc3Nzd3d3e3t7f39/a2trZ2dnb29uMFl4NAAAACnRSTlMAZQpOWz8WNy8jQbWrRQAAAKlJREFUKM9lkkEKAjEMRT8VB7exHcRdxRFxZwUP0DmBoxfo0q2ewJV7PbE0MNPKf4uGJKRN8gvlcIvu/MXETpTr6O/Fvr25B3lCMaH1agerFp1LUJrYayKextqt8/m0mAg59+hLoFsBRlIJNOIxb1ExXLBZopC9zxEVszWGFyoWLUJCRWMRPSqMg+APoQCV0KX0LDVGrdNwND4tiFZISyYZSCiSksSm7/ADT3Abfzwi7b0AAAAASUVORK5CYII=') no-repeat left 2px;
          background-size:30px;
          .vote-true-name {
            font-size:26px;
            color:#5e5e5e;
            line-height:36px;
            letter-spacing:1px;
            font-weight:bold;
          }
          .vote-true-ratio {
            margin-top:6px;
            position:relative;
            width:90%;
            height:12px;
            background-color:rgba(242, 243, 243, 0.5915);
            border-radius:17px;
          }
        }
      }
      .vote-now-false {
        flex: 1;
        padding-top:3px;
        .vote-false-list {
          margin-bottom:15px;
          .vote-false-name {
            font-size:26px;
            color:#5e5e5e;
            line-height:36px;
            letter-spacing:1px;
            font-weight:bold;
          }
          .vote-false-num {
            height:17px;
            margin-top:6px;
            display:flex;
            display:-webkit-flex;
            justify-content:space-between;
            align-items:center;
            .vote-false-ratio {
              position:relative;
              width:80%;
              height:12px;
              background-color:rgba(242, 243, 243, 0.5915);
              border-radius:17px;
              .vote-false-ratio-absolute {
                position:absolute;
                left:0;
                top:0;
                /*width:10%;*/
                height:12px;
                background:linear-gradient(-90deg,rgba(104,125,255,1),rgba(127,122,254,1));
                border-radius:17px;
              }
            }
            .vote-false-num-people {
              font-size:26px;
              color:#7F7AFE;
              letter-spacing:1px;
              line-height:36px;
            }
          }
        }
      }
      .vote-img-box {
        width:210px;
        height:210px;
        border-radius:18px;
        overflow:hidden;
        display:flex;
        display:-webkit-flex;
        align-items:center;
        margin-left:30px;
        .vote-img-show {
          width:210px;
          height:auto;
        }
      }
    }
  }
</style>
