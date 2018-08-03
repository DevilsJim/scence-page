<!--
	/**
	 * serveNav插件import引入
	 * <serve-nav :serveData="serveData"></serve-nav>
	 * 通过prop属性进行组件传参，其中serveData为数据
	 *
	 */
-->
<template>
	<div class="detailBox" @click="$emit('goDetail',detailCardData)">
		<div class="detailCont">
			<h3>{{ detailCardData.title }}</h3>
			<div class="timeBox">
				<p><em class="timeIcon"></em><i>{{ detailCardData.time | filterTime }}</i></p>
			</div>
			<div class="detailShow">
        <div v-if="detailCardData.type" class="detailImgBox">
				  <img :src="detailCardData.url" alt="">
        </div>
				<p>{{ detailCardData.txt }}</p>
			</div>
		</div>
	</div>
</template>

<script>
  export default {
    name: 'detailCard',
    props: [
      'detailCardData'
    ],
    filters: {
      filterTime (item) {
        // console.log(item) // 传入的参数
        return '111'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
  .detailBox {
    .detailCont {
      min-height:200px;
      _height:200px;
      padding:25px 30px 0;
      background-color:#fff;
      -moz-box-shadow: 0 3px 3px rgba(148, 148, 148, 0.12);
      -webkit-box-shadow: 0 3px 3px rgba(148, 148, 148, 0.12);
      box-shadow: 0 3px 3px rgba(148, 148, 148, 0.12);
      h3 {
        height:56px;
        font-size:40px;
        color:#3c3c3c;
        line-height:56px;
      }
      .timeBox {
        height:33px;
        display: flex;
        flex-direction:row;
        align-items:center;
        margin-top:10px;
        margin-bottom:26px;
        p {
          display: flex;
          flex-direction:row;
          align-items:center;
          height:33px;
          margin-right:28px;
          em {
            display: block;
            width:30px;
            height:30px;
            margin-right:14px;
          }
          i {
            font-size:24px;
            color:#818181;
            font-style:normal;
          }
          .timeIcon {
            background:url('/src/assets/indexCard/iconTime.png') no-repeat center;
            background-size:100%;
          }
        }
      }
      .detailShow {
        display: flex;
        flex-direction:row;
        padding-bottom:35px;
        .detailImgBox {
          display: block;
          width:210px;
          height:210px;
          margin-right:28px;
          img {
            width:210px;
            height:210px;
            border-radius:15px;
          }
        }
        p {
          font-size:28px;
          color:#3c3c3c;
          line-height:44px;
        }
      }
    }
  }
</style>
