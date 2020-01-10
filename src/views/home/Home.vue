<template>
  <div id="wrap">

    <Loading v-if="isLoading" />

    <header>
      <div class="zhong">
        <img src="../../assets/home/logo@2x.png" width="66" alt="">
        <span>
          <!-- <img src="../../assets/home/icon@2x(1).png" width="20" alt=""> -->
          <span v-if="uid == '' " @click="go_login">注册 | 登录</span>
          <!-- <span v-if="uid !== '' " @click="show_ask"><img src="../../assets/home/icon@2x(1).png" width="20" alt="">&nbsp;客服</span> -->
        </span>

      </div>
    </header>
    <div id="bao">
      <div style="height:44px"></div>

      <div id="info" v-if="title == 'USDT' ">
        <div class="zhong" v-for="(item,index) in USDTdata" :key="index" @click="go_trade(item)">
          <div class="left">
            <img :src="require(`../../assets/coins/${item.coin}.png`)" width="30" alt="">
            <!-- <img :src="`../../assets/coins/${JSON.stringify(item.coin)}.png`" > -->
            <span class="coin">
              <span><span class="bai">{{item.coin}}</span>/USDT</span>
              <span>{{item.coin_zh}}</span>
            </span>
          </div>
          <div class="center">
            <span :style="{'color':item.ticker.change24h>0? '#0ABF92':'#E9403B' }">{{item.ticker.last_price | keepTwo}}</span>
            <span>￥{{item.ticker.cny | keepTwo}}</span>
          </div>
          <div class="right">
            <span :style="{'background':item.ticker.change24h>0? '#0ABF92':'#E9403B' }">
              <p v-if="item.ticker.change24h>0">＋</p>{{item.ticker.change24h | keepTwo}}%
            </span>
          </div>
        </div>
      </div>
      <!-- USDT 市场币种信息 -->
      <div id="info" v-if="title == 'BTC'">
        <div class="zhong" v-for="(item,index) in BTCdata" :key="index" @click="go_trade(item)">
          <div class="left">

            <img :src="require(`../../assets/coins/${item.coin}.png`)" width="30" alt="">
            <!-- <img :src="`../../assets/coins/${JSON.stringify(item.coin)}.png`" > -->
            <span class="coin">
              <span><span class="bai">{{item.coin}}</span>/USDT</span>
              <span>{{item.coin_zh}}</span>
            </span>
          </div>
          <div class="center">
            <span :style="{'color':item.ticker.change24h>0? '#0ABF92':'#E9403B' }">{{item.ticker.last_price | keepTwo}}</span>
            <span>￥{{item.ticker.cny | keepTwo}}</span>
          </div>
          <div class="right">
            <span :style="{'background':item.ticker.change24h>0? '#0ABF92':'#E9403B' }">
              <p v-if="item.ticker.change24h>0">＋</p>{{item.ticker.change24h | keepTwo}}%
            </span>
          </div>
        </div>

      </div>
      <!-- USDT 市场币种信息 -->
      <div id="info" v-if="title == 'ETH' ">
        <div class="zhong" v-for="(item,index) in ETHdata" :key="index" @click="go_trade(item)">
          <div class="left">
            <img :src="require(`../../assets/coins/${item.coin}.png`)" width="30" alt="">
            <!-- <img :src="`../../assets/coins/${JSON.stringify(item.coin)}.png`" > -->
            <!-- :src="require(`../../assets/icons/${img}.png`)" -->
            <span class="coin">
              <span><span class="bai">{{item.coin}}</span>/USDT</span>
              <span>{{item.coin_zh}}</span>
            </span>
          </div>
          <div class="center">
            <span :style="{'color':item.ticker.change24h>0? '#0ABF92':'#E9403B' }">{{item.ticker.last_price | keepTwo}}</span>
            <span>￥{{item.ticker.cny | keepTwo}}</span>
          </div>
          <div class="right">
            <span :style="{'background':item.ticker.change24h>0? '#0ABF92':'#E9403B' }">
              <p v-if="item.ticker.change24h>0">＋</p>{{item.ticker.change24h | keepTwo}}%
            </span>
          </div>
        </div>
      </div>

      <div class="footer"></div>
    </div>

  </div>

</template>

<script>
  import axios from 'axios';
  import qs from 'qs';
  // import {
  //   Popup
  // } from 'vant';
  export default {

    data() {
      return {
        isLoading: false,
        show_xiazai: false,
        USDTdata: [],
        ETHdata: [],
        BTCdata: [],
        img_list: [],
        news_list: [],
        news: '',
        timer: null,
        aa: "BTC",
        isLoading: false,
        title: 'USDT',
        uid: '',
        show: false,
        url:'',
      }
    },
    components: {

    },
    beforeCreate() {
      localStorage.isVirtual = 0;
      // console.log(localStorage.isVirtual)
      this.isLoading = true;
      //判断线上还是测试

      axios.get('http://pre-m.50ex.com/api/cd_public/markets').then(ref => {
        this.USDTdata = ref.data.data.USDT;
        this.ETHdata = ref.data.data.ETH;
        this.BTCdata = ref.data.data.BTC;
        this.isLoading = false;
      })
    },
    created() {
      // 这里需要做轮询 在列表里展示
      // console.log(1)
    },
    beforeMount() {
      //看起来像这行报错了
      // console.log(window.location.href,'----------href')
      var a = window.location.href.split("=")
      localStorage.invite_id = a[1]  //存起邀请ID
      console.log(localStorage.invite_id)
      // console.log(this.appSource())
      let type = this.appSource();
      if(type == 'ios'){
        this.url = 'https://admin.sunflower.nz/public/50EX.mobileconfig';
        this.show_xiazai = true;
      }else if(type == ''){
        this.show_xiazai = false;
      }else{
        this.url = 'https://m.50ex.com/download/android.apk';
        this.show_xiazai =true;
      }

    },
    mounted() {
    
    },
    filters: { //保留两位小数
      keepTwo(value) {
        let transformVal = parseFloat(value).toFixed(2)
        // let realVal = transformVal.substring(0, transformVal.length - 1)
        // num.toFixed(3)获取的是字符串
        return transformVal
      },
    },
    methods: {
      appSource() {
        //不应该啊  你们代码没有转成es5执行吗 打包之后 就转了呀 webpack 自动转 应该是
        let u = navigator.userAgent;
        const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (isiOS) {
          return "ios";
        } else {
          if (u.includes('androidapp')) {
            return "";
          } else {
            return 'andriod';
          }
        }
      },
      go_xiazai(url) {
        window.localtion.href = url;
      },
      show_ask() {
        this.show = true;
      },
      go_banner(item){
        window.open(item)
      },
      go_login() {
        this.$router.push({
          name: 'login'
        })
      },
      go_moni() {
        localStorage.isVirtual = 1;
        // localStorage.tv_key = 1;
        this.$router.push({
          path: "/trade",
          query: {
            symbol: "BTC_USDT"
          }
          //提币
        });
      },
      go_shipan() {
        localStorage.isVirtual = 0;
        // localStorage.tv_key = 1;
        this.$router.push({
          path: "/trade", //实盘交易
          query: {
            symbol: "BTC_USDT"
          }
        });
      },
      go_trade(item) {
        // console.log(localStorage.isVirtual)
        localStorage.tvSymbol = item.price_index;
        localStorage.isVirtual = 0;
        // this.$bus.symbol = item.price_index;
        // localStorage.tv_key = 1;
        // symbol:localStorage.tvSymbol
        this.$router.push({
          path: "/trade", //实盘交易
          query: {
            cd_id: item.id,
            symbol: item.price_index,
          }
        });
      },
      go_invite() {
        this.$router.push({
          name: 'invite'
        })
      },
      go_guide() {
        this.$router.push({
          name: 'help'
        })
      },
      get_markets() {
        axios.get(`${this.$bus.base_domain}/cd_public/markets`).then(ref => {
          this.USDTdata = ref.data.data.USDT;
        })
      },
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    deactivated() {
      clearInterval(this.timer); //清除定时器
    },
    activated() {
      localStorage.tvSymbol = null;
      axios.get(`${this.$bus.base_domain}/cd_private/my_info`).then(ref => {
        if (ref.data.code == 1) {
          this.uid = ref.data.data.uid;
        } else {
          this.uid = '';
        }
      })
      this.get_markets()
      this.timer = setInterval(() => {
        this.get_markets()
      }, 4000)
    }
  }
</script>

<style scoped>
  #wrap {
    width: 100%;
    background: #0D1226;
    height: 100%;
    position: absolute;
    top: 0;
    max-width: 26.55rem;
    overflow: hidden;
    left: 50%;
    transform: translateX(-50%);
  }

  #wrap #xiazai {
    position: fixed;
    z-index: 100;
    width: 100%;
    height: 3.75rem;
  }

  #wrap #xiazai a {
    border: 1px solid wheat;
    color: white;
    position: absolute;
    border-radius: 10px;
    left: 69%;
    top: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 18%;
    height: 43%;

  }

  #wrap #xiazai #img1 {
    width: 100%;
    height: 100%;
  }

  #wrap #xiazai #img2 {
    position: absolute;
    width: 20px;
    height: 20px;
    left: 91%;
    top: 31%;
  }

  #wrap header {
    height: 2.75rem;
    position: fixed;
    width: 100%;
    color: wheat;
    top: 0;
    left: 0;
    z-index: 99;
    background: #1D2340;
  }

  #wrap #van {
    text-align: center;
    overflow: hidden;
  }

  #wrap .zhong {
    width: 94%;
    margin: 0 auto;
  }

  #wrap #bao {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }

  #wrap #bao::-webkit-scrollbar {
    display: none;
  }


  #wrap header .zhong {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    color: white;
  }

  #wrap header .zhong span {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    font-size: 0.9375rem;
    color: #7083CC;
  }

  #wrap #header {
    width: 100%;
    height: 2.75rem;
    background: #1D2340;
  }

  #wrap #header .zhong {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }

  #wrap #header .zhong span {
    display: flex;
    justify-content: space-between;

    align-items: center;
    height: 100%;
    font-size: 0.9375rem;
    color: #7083CC;
  }

  #wrap #banner {
    width: 100%;
    /* height: 153px; */
    margin-top: 10px;
    padding: 0;
  }

  #wrap #banner .banner .item {
    text-align: center;
  }

  #wrap #banner .banner img {
    width: 98%;
  }

  /* 公告 */
  #wrap #notice {
    width: 92%;
    margin: 5px auto;
    height: 17px;
  }

  #wrap #notice .zhong {
    color: #E7F2FF;
    font-size: 0.8125rem;
    display: flex;
    align-items: center;
  }

  #wrap #notice .zhong img {
    margin-right: 5px;
  }

  #wrap #main {
    width: 100%;
    margin-top: 7px;
  }

  #wrap #main .zhong {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* height: 100%; */
  }

  #wrap #main .zhong .left {
    /* height: 100%; */
    width: 50%;
  }

  #wrap #main .zhong .left img {
    width: 96%;
    /* height: 80%; */
  }

  #wrap #main .zhong .right img {
    width: 98%;
    /* height: 38.7%; */
  }

  #wrap #main .zhong .right {
    width: 50%;
    /* height: 152px; */
  }

  .bai {
    color: white;
    font-size: 1.125rem;
  }

  #wrap #clear_anchor {
    width: 100%;
  }

  #wrap #clear_anchor .zhong {
    height: 44px;
    color: white;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  #wrap #clear_anchor .zhong p {
    width: 12%;
    margin: 0;
    padding: 0;
  }


  .xian {
    color: #7083CC;
    border-bottom: 1.5px solid #2963E4;
  }

  #wrap #bao #info {
    width: 100%;
    overflow-y: auto;
  }
#wrap #bao #info p{
  font-size: 13px;
  padding: 0;
  margin: 0;
}
  #wrap #info .zhong {
    display: flex;
    align-items: center;
    height: 60px;
  }

  #wrap #info .zhong .left {
    width: 40%;
    font-size: 13px;
    color: #7083CC;
    display: flex;
    align-items: center;
  }

  #wrap #info .zhong .left img {
    margin-right: 8px;
  }

  #wrap #info .zhong .left .coin {
    width: 50%;
  }

  #wrap #info .zhong .center {
    width: 25%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  #wrap #info .zhong .center span {
    width: 90%;
  }

  #wrap #info .zhong .center span:nth-of-type(1) {
    color: #0BB98E;
    font-size: 1.125rem;
  }

  #wrap #info .zhong .center span:nth-of-type(2) {
    color: #7083CC;
    font-size: 0.8125rem;
  }

  #wrap #info .zhong .right {
    flex: 1;
    text-align: right;
    align-items: center;
    display: flex;
    justify-content: flex-end;
    margin-right: 5px;
  }

  #wrap #info .zhong .right span {
    width: 70%;
    height: 30px;
    background: rgba(10, 191, 146, 1);
    border-radius: 4px;
    align-items: center;
    display: flex;
    justify-content: center;
    color: white;
  }

  #wrap .footer {
    height: 50px !important;
  }

  #wrap #footer {
    width: 100%;
    height: 50px;
    background: #1D2340;
    position: fixed;
    bottom: 0;
    margin: 0;
    max-width: 500px;
  }

  #wrap #footer ul {
    display: flex;
    height: 50px;
    align-items: center;
    justify-content: space-around;
    list-style: none;
    padding: 0;
  }

  #wrap #footer ul li {
    text-align: center;
    width: 30%;
  }

  #wrap #footer ul li.active {
    color: #f03d37;
  }

  #wrap #footer ul li.router-link-active {
    color: #f03d37;
  }

  #wrap #footer ul i {
    font-size: 20px;
  }

  #wrap #footer ul p {
    font-size: 12px;
    line-height: 8px;
    margin: 4px;
    color: #c6cfd8;
  }
</style>
