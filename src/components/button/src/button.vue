<template>
  <button
    :type="nativeType"
    class="lashou-button"
    :class="['lashou-button--' + type, 'lashou-button--' + size, {
      'is-disabled': disabled,
      'is-plain': plain
    }]"
    @click="handleClick"
    :disabled="disabled">
    <span class="lashou-button-icon" v-if="icon || $slots.icon">
      <slot name="icon">
        <span v-if="icon" class="lashouui" :class="'lashouui-' + icon"></span>
      </slot>
    </span>
    <label class="lashou-button-text"><slot></slot></label>
  </button>
</template>

<script>
// if (process.env.NODE_ENV === 'component') {
//   require('lashou-ui/packages/font/style.css');
// }

/**
 * mt-header
 * @module components/button
 * @desc 按钮
 * @param {string} [type=default] - 显示类型，接受 default, primary, danger
 * @param {boolean} [disabled=false] - 禁用
 * @param {boolean} [plain=false] - 幽灵按钮
 * @param {string} [size=normal] - 尺寸，接受 normal, small, large
 * @param {string} [native-type] - 原生 type 属性
 * @param {string} [icon] - 图标，提供 more, back，或者自定义的图标（传入不带前缀的图标类名，最后拼接成 .lashouui-xxx）
 * @param {slot} - 显示文本
 * @param {slot} [icon] 显示图标
 *
 * @example
 * <mt-button size="large" icon="back" type="primary">按钮</mt-button>
 */
export default {
  name: 'mt-button',

  methods: {
    handleClick (evt) {
      this.$emit('click', evt)
    }
  },

  props: {
    icon: String,
    disabled: Boolean,
    nativeType: String,
    plain: Boolean,
    type: {
      type: String,
      default: 'default',
      validator (value) {
        return [
          'default',
          'danger',
          'primary',
          'download',
          'save',
          'followed',
          'notFollowed'
        ].indexOf(value) > -1
      }
    },
    size: {
      type: String,
      default: 'normal',
      validator (value) {
        return [
          'small',
          'normal',
          'large'
        ].indexOf(value) > -1
      }
    }
  }
}
</script>

<style lang="sass" scoped type="text/css">
  .lashouui-back {
    width: 39px;
    height: 32px;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAgCAYAAAHmoVEbAAAAAXNSR0IArs4c6QAAAYRJREFUWAntV0tOwzAQjVFvwBqp6qk4BcuuKyQWUIki7sCih0AsuAeXYAlqeM/NSGPXTm3HkahkS9Ox5/Nm+uraSdcNo+/7jcythqHXhgXWSxp8Bw07HRmfI3KhveYES7xw7GV+opmF4UA5QUf/SACir4aMF+g3J3tsAeQdJN7bWHLQx16DDm2sFhRnXJfruhu7TCorifMFSwVqVuHQtqL5EcZ+xjdSCnINIMNCBBoKPkD/DvNcdTDG3Nsk4HGzclTcsIAG4IUC55IZjQcFt5DraECqQ3F5l5oTjFNA037tBhTkVxt5jD7CsIZ8Q561M3P+TrADkuwhkJnsh/9YAwBlTDvbBF7QoBugkJKp5+LwKbOP/HB0Lsc9v8Q2H2GGDK8pNraH1Nmepf22plKZa0xdMlO8spb4Al+QGtdWKhfn4nj9reRhWi5oSeJF/QopfbAWnBLN+/0DD+afTvK//BM4HWLRmvQZKV03JkuZ8/MCTE57efIL1FijSb4ibiDTXxMDDf0BRtFosp5lM0QAAAAASUVORK5CYII=');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    position: absolute;
    left: 30px;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .lashouui-more {
    width: 36px;
    height: 8px;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAICAYAAAHmaW1DAAAAAXNSR0IArs4c6QAAALJJREFUOBHFUUEOgDAIM77D9+8dvsabb8AW2MKWaWYyIwkO1tIhLIubiCSGOA/7WLIpzlu4aGIAU81xGIYgwa3CSEcoMAwENQII+qoAyC6WVbxoHIPCVlREzkZoHHMhtqtj6giNYaEbhpXYK6whl0n7jCL8jIF5BnZZnwuNYxDhQGNB1uVdJdyZ3/w6PMql3Fk1lqahT+pWPLLHh5r4Hwzj4doSnH9NZ3y7rtw0Oc6dVncBs3tTd4+xzfwAAAAASUVORK5CYII=');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    position: absolute;
    right: 30px;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .lashou-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 8px;
    border: 0;
    box-sizing: border-box;
    color: inherit;
    display: block;
    font-size: 36px;
    height: 82px;
    outline: 0;
    overflow: hidden;
    position: relative;
    text-align: center
    &::after{
      background-color: #000;
      content: " ";
      opacity: 0;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      position: absolute
    }
    &:not(.is-disabled):active::after{
      opacity: .4
    }
    &.is-disabled {
      opacity: .6
    }
    &-icon {
      vertical-align: middle;
      display: inline-block;
      width: 100px;
      height: 50px;
      line-height: 50px;
      }
    /*size*/
    &--small {
       display: inline-block;
       font-size: 28px;
       padding: 0 24px;
       height: 66px
     }
    &--normal {
       /*display: inline-block;*/
       padding: 0 24px;
     }
    &--large {
       display: block;
       width: 100%
     }
    /*type*/
    &--default {
      color: #656b79;
      background-color: #f6f8fa;
      box-shadow: 0 0 1px #b8bbbf
    }
    &--default.is-plain {
      border: 1px solid #5a5a5a;
      background-color: transparent;
      box-shadow: none;
      color: #5a5a5a
    }
    &--primary {
      color: #fff;
      background-color: #26a2ff
    }
    &--primary.is-plain {
      border: 1px solid #26a2ff;
      background-color: transparent;
      color: #26a2ff
    }
    &--danger {
      color: #fff;
      background-color: #ef4f4f
    }
    &--danger.is-plain {
      border: 1px solid #ef4f4f;
      background-color: transparent;
      color: #ef4f4f
      }
    &--download{
       display: block;
       position: fixed;
       bottom: 0;
       left: 0;
       z-index: 2;
       font-size: 36px;
       color: #fff;
       width: 100%;
       height: 94px;
       letter-spacing: 10px;
       box-shadow: none;
       border: none;
       border-radius: 0;
       background-image:linear-gradient(to top, #6463E5, #937AFA);
       background-image:-moz-linear-gradient(to top, #6463E5, #937AFA);
       background-image:-o-linear-gradient(to top, #6463E5, #937AFA);
       background-image:linear-gradient(to top, #6463E5, #937AFA);
     }
    &--save{
      margin: 0 auto;
      width: 289px;
      height: 85px;
      background: #7f7afe;
      border-radius: 148px;
      padding: 0;
      font-size: 28px;
      color: #fff;
      letter-spacing: 5px;
      border: 11px solid #dfe2fc;
      box-sizing: content-box;
    }
    &--notFollowed, &--followed{
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 120px;
      /*height: 52px;*/
      background: transparent no-repeat center;
      background-size: 100%;
    }
    &--notFollowed{
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAyCAMAAACgee/qAAAAM1BMVEUAAACAfP9/ev9/e/9/ev9/ef+Aev+Aev9/ev+Aev9/ev9/ev9+ev+Ae/+Aev+Aev9/ev9nFP0EAAAAEHRSTlMAH5ESt0V2ojLl2e5baMeBRFMR/gAAAlhJREFUWMO81UtyhDAMRdEnWbbxh87b/2oTGmgntCFFKnAGDBhwUSEA76Sq5cJ/UrJpFfxKQuYFcjhuD5FkseDF4Z848cEKyThgj5uy0eMC/nlph65aSBVcRJQsFR1KmuBCYqTijZEjLjaSho0H04DLDYmP7bxZcAPJP2dWJsEtJFHxUskBNxnIioUrHHGbkcVhFmm4kTG+hhfcSNYHG6k4TTwWIWDlsKqKfTqPLIcD+5Q8OvK6jo4Zi9g+BUqPvlYMjNiXyIQOv/ZCW8yxLazQsC8yAMj02Mcv6PngByapuO8fpoCZsZ3u37Ww4C9h5DwPHNBILjLqxJI+9YcqFFTa6bDGLxYnhdNRX+UBxu8CeowVynA6XLiRMKlz+0lZZeLQE6gw+tNht0jJLebdekhbgcPLehoy5WS4KRl7v5rjsDCj0PXfX2503ufteoytfBx2LNgZKPFNwoYwYlPOh+GG/ENYwmczVoDDIAgDQ6GoSNj9/7UbE4JjkpEmQy5RIcZUmh5cL4EQbIaqKoDA72czsCDVjAtwiYsTQjPVguLSa8IGuDxOf0/0uiIClviwzeKS0KlwgsDVSkI3nQhWGDiAdUUoC98V2IIkW2b+2KRbgdv7eGzgxYeEPThLMPqUwaUv8A4lPBaVyXsFYfMl+WtXYIaTCQFFKAv1Owznkvk6JFRDCEikDxvA+TJXaX4QxP/Y7lJEidhjGF+JdBP1jw4ujukDj4bYE8lbfdEfpBe98vYuQX9zCzO+abu/TR3bmM9hRYwzX+axm8YYbHNZin83UWe0jQca5U+SojoNfYaMTAAAAABJRU5ErkJggg==');
    }
    &--followed{
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAyCAMAAACgee/qAAAAM1BMVEUAAADMzMzGxsbHx8fHx8fGxsbGxsbHx8fFxcXGxsbGxsbHx8fHx8fJycnHx8fGxsbFxcWrH/F9AAAAEHRSTlMAFKGSVe92QrfgxTRnJILSXvKhQQAAAmhJREFUWMPNmNGWqyAMRRNCkCC2+f+vvYOjjWOFoXeNtvuhpaA9K2mOhcAz6CkK6x/BEskj/ArmyDEME8IfgdMQIseM7ascOw8n4B07rMsS3xBOAm9MlS/3tnIKSHyYzSAjnMwoAZ5wCeF0MDnYYTPn4tLu84m6LaWQ4DJSsLEXhMtA8Y8hj3AhI69hEsGFmB4ywoWYoLv9x73Doy6DTVrRtHN4c82A/RO2JjotYpoeRpHpkUwdfw851yzMusfW/KoX1MNCVl7zMKlrmzl/vUQPfRGLbm/VAAW5bx/FmpdhVIQGPpawu52vP9woFrBNMmYqRKGZoZZNLOKvCpP7IrkCa3mlh/IIUbcEOCZ6oFAvPsFDYdYdDAW/bHUKpH5+ryU8EMShXgJ6LIwLIrjwXVvRLr/pAC2GCDK9KGywwBbShL3CkwBjQzjkDbIXXi1lfpKpUxgZtOG2io+rZs2CbWFD28J++MG3XlggTWFl2gRTIPVYqAu3U3205vUAb7q6IdVT3V9c5tUFUb2vY7Q/PCokjeUt1Iur307PkTva/ZKoqd9OFF4Q5rB114R83xnKdwoHAh/7hVHJbi3jrHG7zNLr4+gBuV941GC6d5xjjAg2F3qFGYt4XXja+XRNJcb1KUVqByJR7BT28XAjYDqEW4a74ixLqs6OerrUp58n0XxcN7LLzb0e6p44F6Rq8htnRNV7+Zx0eHK51LY+7c0eZreFxtkJ6sa9NzQDYEqlDOgHt9pmz/T7Obh6rC3UAn7Xhv7NR5jrD23vP6ZeezD/jFbEdc2Xz2k3XdNg+6yW4ulN1E9sG1/YKP8H9lYl+G4CBiQAAAAASUVORK5CYII=');
    }
  }
  .lashou-header-button {
    -webkit-box-flex: .5;
    -ms-flex: .5;
    flex: .5;
    & > a{
      color: inherit;
    }
    &.is-right {
      text-align: right;
    }
    &.is-left {
      text-align: left;
    }
  }
  .lashou-header .lashou-button {
    background-color: transparent;
    border: 0;
    box-shadow: none;
    color: inherit;
    display: inline-block;
    padding: 0;
    font-size: inherit;
    height: auto;
  }
  .lashou-header .lashou-button::after {
    content: none;
  }
  .lashou-header.is-opaque{
    .lashouui-back {
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAgCAYAAACRpmGNAAAAAXNSR0IArs4c6QAAAYJJREFUWAnN1r9KxDAYAPBLbScXaVcLYjsUHLr6KIIvoYO+g4uKBz6Ek6uTBScfQKilSMG110IdhFZavxyXI+f1T3IXmwTu8pF+X/O7lF6CJls0x3FOEEKeruvTMAxnW9yqtVRvHWUYdF33pq7rs6ZpJlVV7ULJBUMZV4rGlb1IJjCq9pOKhYXcuL8weKwPtm3fCxNRN0JUPBh2wE6DIPgZLN4ggRk3Ngz/FiacDBgTThZsECcT1ouTDevEqQBrxakCW8OpBFvBqQZb4uB0cQUb+CUewA22pC/o7qD/l3/++SQdX3CYqOGU8xxF0QvyPO+gLMsPbOrIH30YFqWCzyH3xj+mdL5ayj5WshIqvhA7BJdl2ZNlWXvwYhwvxo6KovB8339MkqQmeWP2SxyeVDXgCk414BpOJWArThVgJ04FYC9ONnAQJxPIhJMFZMbJAHLheoCzPM9f8XWRbaNTSRzH55qm3VKQfSoWFnKvHJkZb3Wmab4D8s0wjOs0Tb/JNVH9L81XVCQwI0BEAAAAAElFTkSuQmCC');
    }
    .lashouui-more {
      width: 36px;
      height: 8px;
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAICAYAAACRbl3VAAAAAXNSR0IArs4c6QAAAOFJREFUOBHFk70NgzAQhf2zAaSJBB09JS07sAtDZBAmyABpKekpQ+sCpQXynuLGxCeiNFi64u75+T5bPq2wiqLItm27IWrmWusHoh3H8clcWlVVZcuyBD5rbdv3/d8+TZh1XQc0TXaNnTGmlKA8zIBLBD5cxAGqlKCOfIYvE4EhW+K1Hecn9S8TwFAhILWoCcUjH4FqyXyGZiSYs+qGH1hqfoZGoBZALgLlvBaRlOI0Qf/ysUYtakLxyGedc3Oaph32XhEXxAuH3jFhjTRh2KOmaZrzPO/wzwIfGjbShP3iewOU9agxbBXzIgAAAABJRU5ErkJggg==');
    }
  }
</style>
