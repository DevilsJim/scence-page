<!--
	/**
	 * serveNav插件import引入
	 * <serve-nav :serveData="serveData"></serve-nav>
	 * 通过prop属性进行组件传参，其中serveData为数据
	 *
	 */
-->
<template>
	<div class="serveNavBox" @click="$emit('goDownload')">
		<div class="serveNavCont">
			<dl class="serveList" v-for="(item, index) in serveData" :key="index">
				<dt><img :src="item.icon" alt=""></dt>
				<dd>{{ item.title }}</dd>
			</dl>
		</div>
	</div>
</template>

<script>
  export default {
    name: 'serveNav',
    props: [
      'serveData'
    ]
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
	.serveNavBox {
		margin-top:22px;
		.serveNavCont {
			height:132px;
			padding-top:28px;
			display: flex;
			flex-direction:row;
			justify-content:space-around;
			background-color:#fff;
			-moz-box-shadow: 0 2px 16px #F3F3FD;
		    -webkit-box-shadow: 0 2px 16px #F3F3FD;
		    box-shadow: 0 2px 16px #F3F3FD;
		    /* For IE 8 */
		    -ms-filter: "progid:DXImageTransform.Microsoft.Shadow(Strength=16, Direction=90, Color='#F3F3FD')";
		    /* For IE 5.5 - 7 */
		    filter: progid:DXImageTransform.Microsoft.Shadow(Strength=16, Direction=90, Color='#F3F3FD');
		    .serveList {
		    	width:120px;
		    	dt {
		    		text-align:center;
		    		img {
		    			width:60px;
		    			height:60px;
		    		}
		    	}
		    	dd {
		    		padding-top:10px;
		    		font-size:26px;
		    		color:#787878;
		    		text-align: center;
		    	}
		    }
		}
	}
</style>
