<template>
  <div id="wrap">
    <!-- 头部 -->
    <div id="header">
      <div class="zhong">

        <img src="../../assets/icons/fanhui@2x.png" alt="" width="10" height="17" @click="back">
        <span class="center">
          <span :class="{'cool':title == '交易' }" @click=" btn_jiaoyi ">{{trade_type}}</span>
          <span :class="{'cool':title == '持仓' }" @click=" btn_chicang ">{{trade_type_}}<span class="yuan" v-if="trades.length>0">{{trades.length}}</span></span>
        </span>
        <span class="right">&nbsp;</span>

      </div>
    </div>
    <div id="header_">
      <div class="zhong"></div>
    </div>
    <!-- *************************** -->
    <!-- 导航部分 -->
    <div v-show="title == '交易'">
      <div id="nav">
        <div class="zhong">
          <!-- 显示选择币种 -->
          <span ref="symbel" @click="choose_symbol"><img src="../../assets/icons/celan.png" alt="" width="17"> {{coin}}/USDT</span>
          <span :style="{'color':change24h > 1 ? '#0ABF92' :'#E9403B'}">{{last_price | keepTwo}}</span>
          <span :style="{'color':change24h > 1 ? '#0ABF92' :'#E9403B'}">{{change24h | keepTwo}}%</span>
        </div>
      </div>
      <div id="kline_nav" class="zhong">
        <span :style="{'color':interval == 0 ?  '#2377FF' : '#7083CC'}" @click="type=3 , interval =0">分时</span>
        <span :style="{'color':interval == 1 && type==1? '#2377FF' : '#7083CC'}" @click="interval = 1 , type=1">1分钟</span>
        <span :style="{'color':interval == 5 && type==1? '#2377FF' : '#7083CC'}" @click="interval = 5 , type=1">5分钟</span>
        <span :style="{'color':interval == 15 && type==1? '#2377FF' : '#7083CC'}" @click="interval = 15 , type=1">15分钟</span>
        <span :style="{'color':interval == 30 && type==1? '#2377FF' : '#7083CC'}" @click="interval = 30 , type=1">30分钟</span>
        <span :style="{'color':interval == 60 && type==1? '#2377FF' : '#7083CC'}" @click="interval = 60 , type=1">1小时</span>
        <span :style="{'color':interval == 240 && type==1? '#2377FF' : '#7083CC'}" @click="interval = 240 , type=1">4小时</span>
        <span :style="{'color':interval == 1440 && type==1? '#2377FF' : '#7083CC'}" @click="interval = 1440 , type=1">日线</span>
      </div>
      <!-- 黑色遮罩 选择币种-->
      <div id="drawer" v-if="showDrawer" @click="clear_timer_symbol">
      </div>

      <div id="info" v-if="showDrawer">
        <div class="info">
          <div class="zhong" id="clear_anchor">
            <span>选择币种</span>
            <img src="../../assets/icons/celan_.png" alt="" width="17" @click="clear_timer_symbol">
          </div>

        </div>
        <!-- USDT 市场 -->
        <div class="info" v-if="title_ == 'USDT'">
          <div class="zhong" v-for="(item,index) in USDTdata" @click="changeInfo(USDTdata,item,index)" :key="index"
            :class="{'cur_symbol':cur_symbol == item.price_index} ">

            <div class="left">
              <span ref="bk">
                {{item.coin}}/USDT
              </span>
              <span>{{item.coin_zh}}</span>
            </div>
            <span :style="{'color':item.ticker.change24h > 1 ? '#0ABF92' :'#E9403B'}">{{item.ticker.last_price | keepTwo}}</span>
            <!-- <span>{{item.ticker.last_price | keepTwo}}</span> -->
          </div>
        </div>
        <!-- BTC 市场 -->
        <div class="info" v-if="title_ == 'BTC'">
          <div class="zhong" v-for="(item,index) in BTCdata" @click="changeInfo(BTCdata,item,index)" :key="index"
            :class="{'cur_symbol':cur_symbol == item.coin}">

            <div class="left">
              <span ref="bk">
                {{item.coin}}/USDT
              </span>
              <span>{{item.coin_zh}}</span>
            </div>
            <span :style="{'color':item.ticker.change24h > 1 ? '#0ABF92' :'#E9403B'}">{{item.ticker.last_price | keepTwo}}</span>
            <!-- <span>{{item.ticker.last_price | keepTwo}}</span> -->
          </div>
        </div>
        <!-- ETH 市场 -->
        <div class="info" v-if="title_ == 'ETH'">
          <div class="zhong" v-for="(item,index) in ETHdata" @click="changeInfo(ETHdata,item,index)" :key="index"
            :class="{'cur_symbol':cur_symbol == item.coin} ">

            <div class="left">
              <span ref="bk">
                {{item.coin}}/USDT
              </span>
              <span>{{item.coin_zh}}</span>
            </div>
            <span :style="{'color':item.ticker.change24h > 1 ? '#0ABF92' :'#E9403B'}">{{item.ticker.last_price | keepTwo}}</span>
            <!-- <span>{{item.ticker.last_price | keepTwo}}</span> -->
          </div>
        </div>
      </div>
      <!-- tradingvie -->

      <div id="tv">
        <div class="zhong">
          <Tv v-if="show_kline" :symbol='symbol' :interval='interval' :type='type' />
        </div>
      </div>
      <!-- tradingvie -->
      <div id="bk"></div>
      <div id="main">
        <!-- 快捷专业 -->

        <!-- 当等于快捷的时候 -->



        <!-- 数 -->



      </div>

    </div>
    <!-- 实盘持仓 -->

  </div>
</template>

<script>
  import axios from 'axios';
  import qs from 'qs';
  import Tv from '../../components/Tv.vue';
  import Zi from '../../views/trade/Zi/zi.vue';
  import Vue from 'vue';
  import {
    Toast
  } from 'vant';

  import {
    MessageBox,
  } from "mint-ui";
  import {
    bc_add,
    bc_mul,
    bc_div,
    bc_sub
  } from '../../calc.js'
  export default {
    name: "trade",
    components: {
      Tv,
      Zi,
    },
    data() {
      return {
        MessageBox: ({
          title: '提示',
          message: '您确定撤单吗?',
          showCancelButton: true
        }),
        show_board: false, //数字键盘
        kline_nav: 1,
        jie_item: {}, //结算装详情里的数据
        ping_item: {}, // 平仓框里的json

        clear_anchor: "USDT",
        showDrawer: false, //展示遮罩 选择币种
        showGg: false, //展示遮罩 选择杠杆
        show_market: false, //展示遮罩 选择杠杆
        show_add_bzj: false, // 展示追加保证金
        show_change: false, //展示止盈止损
        show_tiao: false, // 展示调整框框
        show_ping: false, //展示 平仓
        show_che: false, //展示撤单 框框
        show_buy: false, //展示涨跌时候的框框
        show_xian_buy: false, //展示 专业限价  买卖框
        show_xiang: false,
        show_jie_xiang: false,
        buy_what: "金额", //按照金额止盈止损

        tickers: "",
        tickers_obj: {},
        title: "交易",

        key: "快捷", //切换专业 和快捷
        key_calc_market: false,
        key_calc_bzj: false,
        key_stop: false,
        xian: "持仓", // 控制3个导航显示
        title_: "USDT",
        buy: 1, // 接收买涨参数  1代表 涨 -1代表跌
        buy_type: "market", //默认持仓 0 表示限价 挂单
        way: '买涨', //仅仅展示文字
        buy_way: '市价',
        USDTdata: [], //USDT市场里的信息
        BTCdata: [], //USDT市场里的信息
        ETHdata: [], //USDT市场里的信息

        coin: "BTC", //当前币种
        markets: [], //默认的市值列表
        //   market_new: [], // 替换默认市值列表用的
        market_values: [], //用来装  接口的市值列表
        market_now: 200, //默认市值

        levers: [], //用来装杠杆列表  拉取数据里的杠杆

        bzjs: [], //渲染出来的 保证金列表  对应杠杆列表
        positions: ['1/4', '1/3', '1/2', '3/4', '全仓'],
        bzj_now: 10, //默认支付10个保证金 点击先赋值 快捷页面

        cur_markets: 1, //市值列表 加不加cur
        cc_cur: "平仓", //持仓里的cur
        cur_symbol: "BTC_USDT", // 选择币种列表 默认BTC
        cur_position: '', //选择仓位
        // -----------------------------------------------------trades接口数据
        trades: [], //持仓挂单列表
        trades_one: [],
        trades_two: [],
        add_bzj_num: 0,

        new_profit_amount: null, //新的止盈价格
        new_loss_amount: null, //新的止损价格
        count: 0, //持仓总价
        max_stop_rate: 5.00, //最大止盈率
        min_stop_rate: 0.8, //最小止损率
        id: null, //默认cd_id
        order_id: null, //trades 接口 订单id
        total: null, //trades 接口 币值
        direction: null, //trades 接口 方向 做多做空
        open_price: null, //trades 接口 开仓价
        stop_limit_way: "amount", //止盈止损方式 默认price 按价格
        profit_price: null,
        loss_price: null,
        now_price: null, // trades列表 最新价
        status: 1, //0表示“待开仓”，1表示“持仓”，2表示“已平仓”，-1表示“已取消”
        leverage: 1, //追加保证金的杠杆
        margin: 0, //追加保证金的 当前保证金
        total_anchor: null, //当前市值
        close_fee: null, //平仓手续费
        profit_loss: null,
        profit_loss_rate: null,

        //详情 ***********************
        xiang_item: {},
        anchor_ratio: null, //系数--------------
        buy_total: null,
        buy_total_: null,
        // -----------------------------------------------------trades接口数据
        add: {}, //追加保证金
        set: {}, //设置止盈止损

        showimg: false, //勾选✔️，
        showimg_: 1,
        ganggan: 50, // 快捷 页面-----默认杠杆

        long_price: 1, //买涨
        short_price: 1, //买跌
        last_price: 1, //最新价

        change24h: 1, //24小时涨跌幅
        timer: null, // 默认BTC的定时器
        timer_: null, // 切换交易对时候的定时器
        timer_symbol: null, //选择币种拉取的信息
        timer_trades: null,
        timer_float: null, // 所有tickers 价格变动
        hidden: false, //下树 买涨 买跌

        // ----------------专业-------------限价下单
        xian_market: 200, //市值
        xian_gg: 10, //专业 页面-----默认杠杆
        xian_bzj: 20,
        max_xian_money: 0,
        min_xian_money: 0,
        new_price: 0, //最新价
        buy_key: false, //点限价的时候 买涨买跌停止轮询

        market_cd_id: null, //切换路由的时候 拉取的数据
        isVirtual: null, // 模拟持仓
        trade_type: '实盘交易',
        trade_type_: '实盘持仓',

        // ---------------tickers接口所有 USDT交易对现价
        markets_info: {},
        BTC_USDT: {
          last_price: null,
          change24h: null
        },
        clear: "USDT", //市场
        yu_e: 0, //

        // k线 要传的symbol
        symbol: "BTC_USDT",
        interval: 0,
        type: 3,
        show_kline: false,
      }
    },
    created() {
      //alert(window.localStorage.isVirtual)
      //  这里需要做轮询 在列表里展示
      // this.get_markets_info()
    },

    beforeMount() {
      this.show_kline = true;
      this.get_user_info();
      //上树之前 要默认拉BTC的数据
      this.get_orders_chi() //一开始拉 是为了显示小红点
      //为了确保在单页面刷新的时候  重启数据
      /*axios.get(`${this.$bus.base_domain}/cd_public/tickers`).then(ref => {
        if (ref.data.code == 1) {
          for (let key in ref.data.data) {
            this.tickers_obj = ref.data.data
            this.tickers_obj[key] = ref.data.data[key]
          }
        }
        this.markets_info = ref.data.data //控制 详情列表里 数变化
        // this.BCH_USDT = ref.data.data.BCH_USDT
        this.BTC_USDT = ref.data.data.BTC_USDT;
        //         console.log(ref)
      })*/
    },
    mounted() {
      // console.log(localStorage.isVirtual+'--------')
      if (this.$route.query.symbol !== undefined) {
        this.cur_symbol = this.$route.query.symbol;
      }
      // console.log(`哈哈哈哈${this.$route.query.symbol}`)
      this.market_cd_id = this.$route.query.cd_id;
      // this.interval = 0;  //每次进来 K 线 分时
      this.symbol = this.$route.query.symbol;

      if (window.localStorage.isVirtual == 0) {
        this.trade_type = "实盘交易";
        this.trade_type_ = "实盘持仓";
        this.clear = "USDT";
        this.isVirtual = 0;
        this.get_markets_info()
        /*axios.get(
            `${this.$bus.base_domain}/cd_public/market?cd_id=${this.market_cd_id}&isVirtual=${localStorage.isVirtual}`)
          .then(ref => {
            // console.log(`/api/cd_public/market?cd_id=${this.market_cd_id}&isVirtual=${localStorage.isVirtual}`);
            this.bzjs = []; //保证金列表
            this.coin = ref.data.data.coin;
            this.clear_anchor = ref.data.data.clear_anchor;
            this.anchor_ratio = ref.data.data.anchor_ratio; //系数
            this.market_values = ref.data.data.anchor_steps; //用于选择市值 列表
            this.market_values.forEach((item, index) => {
              if (index < 4) {
                this.markets.push(item)
              }
            })
            this.market_now = this.market_values[1]
            this.levers = ref.data.data.leverages; //杠杆列表
            this.last_price = ref.data.data.ticker.last_price; //应该 让 creact里 轮询，这里2个数据 拿creact 对应BTC的
            this.change24h = ref.data.data.ticker.change24h;
            if (this.key_stop == false) {
              this.long_price = ref.data.data.ticker.long_price; //买涨的价格
              this.short_price = ref.data.data.ticker.short_price; //买跌的价格
            }

            this.market_cd_id = ref.data.data.id;
            this.max_stop_rate = ref.data.data.max_stop_rate;
            this.min_stop_rate = ref.data.data.min_stop_rate;
            this.anchor_ratio = ref.data.data.anchor_ratio;
            //    console.log(this.anchor_ratio)
            //  console.log(ref)
            this.levers.forEach(item_ => {
              this.bzjs.push(this.market_values[2] / item_) //默认显示 下标2的保证金 列表
            })
            this.bzjs.reverse()
          })*/
      } else if (window.localStorage.isVirtual == 1) {
        this.trade_type = "模拟交易";
        this.trade_type_ = "模拟持仓";
        this.clear_anchor = "EX50";
        this.isVirtual = 1;
        this.get_markets_info()
        /*axios.get(
            `${this.$bus.base_domain}/cd_public/market?cd_id=${this.market_cd_id}&isVirtual=${localStorage.isVirtual}`)
          .then(ref => {
            this.bzjs = []
            this.coin = ref.data.data.coin;
            this.clear_anchor = ref.data.data.clear_anchor;
            this.anchor_ratio = ref.data.data.anchor_ratio;
            this.market_values = ref.data.data.anchor_steps; //用于选择市值 列表
            this.market_values.forEach((item, index) => {
              if (index < 4) {
                this.markets.push(item)
              }
            })
            this.levers = ref.data.data.leverages; //杠杆列表
            this.last_price = ref.data.data.ticker.last_price; //应该 让 creact里 轮询，这里2个数据 拿creact 对应BTC的
            this.change24h = ref.data.data.ticker.change24h;
            if (this.key_stop == false) {
              this.long_price = ref.data.data.ticker.long_price; //买涨的价格
              this.short_price = ref.data.data.ticker.short_price; //买跌的价格
            }

            this.market_cd_id = ref.data.data.id;
            this.max_stop_rate = ref.data.data.max_stop_rate;
            this.min_stop_rate = ref.data.data.min_stop_rate;
            this.anchor_ratio = ref.data.data.anchor_ratio;
            //     console.log(ref)
            this.levers.forEach(item_ => {
              this.bzjs.push(this.market_values[2] / item_) //默认显示 下标2的保证金 列表
            })
            this.bzjs.reverse()
          })*/
      }
      // this.get_user_info()
      this.get_orders_chi()
      this.timer_ = setInterval(() => {
        this.c_market()
      }, 2000)
      //浮动盈亏 波动
      /*this.timer_float = setInterval(() => {
        axios.get(`${this.$bus.base_domain}/cd_public/tickers`).then(ref => {
          if (ref.data.code == 1) {
            for (let key in ref.data.data) {
              this.tickers_obj[key] = ref.data.data[key];
            }
          }
          this.markets_info = ref.data.data;
          //  console.log( `我是tiker${ref}`)
          for (let key in this.markets_info) {
            // 让持仓里的现价波动,
            this.trades.map(item => {
              if (this.markets_info[key].symbol == item.price_index) {
                item.last_price = this.markets_info[key].last_price;
                item.profit_loss = (item.last_price - item.open_price) * item.direction * item.total
                item.profit_loss_rate = ((item.last_price - item.open_price) * item.direction * item.total) /
                  item.margin
              }
              return item;
            })
            // 让挂单里的现价波动,
            this.trades_one.map(item => {
              if (this.markets_info[key].symbol == item.price_index) {
                item.last_price = this.markets_info[key].last_price;
                item.profit_loss = (item.last_price - item.open_price) * item.direction * item.total
                item.profit_loss_rate = ((item.last_price - item.open_price) * item.direction * item.total) /
                  item.margin
              }
              return item;
            })
          }
        })
      }, 1000)*/

    },
    filters: { //保留两位小数
      keepTwo(value) {
        let transformVal = parseFloat(value).toFixed(2)
        // num.toFixed(3)获取的是字符串
        return transformVal
      },
      keepThree(value) {
        let transformVal = parseFloat(value).toFixed(4)
        let realVal = transformVal.substring(0, transformVal.length - 1)
        // num.toFixed(3)获取的是字符串
        return parseFloat(realVal)
      }
    },
    computed: {
      now_bzj() {
        var a = 0;
        a = this.market_now / this.ganggan;
        return a;
      },
      now_gg() {
        this.ganggan = this.market_now / this.bzj_now;
        return this.ganggan;
      },
      max_stop_money() { //止盈金额
        var a = 0;
        a = this.bzj_now * this.max_stop_rate; //最新保证金 ✖️ 最大止盈率  = 最大止盈金额
        return a;
      },
      min_stop_money() { //止损金额
        var a = 0;
        a = this.bzj_now * this.min_stop_rate; //最新保证金 ✖️ 最小止盈率  = 最小止盈金额
        return -a;
      },
      float() { //浮动 总盈利
        var a = 0;
        this.trades.forEach(item => {
          a += (item.last_price - item.open_price) * item.direction * item.total;
        })
        return a
      },
      float_rate() { //浮动 总盈利率
        var a = 0;
        var b = 0;
        this.trades.forEach(item => {
          a += parseInt(item.margin)
          b = this.float / a;
        })
        return b;
      },
    },
    methods: {
      c_market() {
        /*axios.get(
            `${this.$bus.base_domain}/cd_public/market?cd_id=${this.market_cd_id}&isVirtual=${localStorage.isVirtual}`)
          .then(ref => {
            this.market_values = ref.data.data.anchor_steps; //用于选择市值 列表
            this.levers = ref.data.data.leverages; //杠杆列表
            this.last_price = ref.data.data.ticker.last_price; //应该 让 creact里 轮询，这里2个数据 拿creact 对应BTC的
            this.change24h = ref.data.data.ticker.change24h;
            if (this.key_stop == false) {
              this.long_price = ref.data.data.ticker.long_price; //买涨的价格
              this.short_price = ref.data.data.ticker.short_price; //买跌的价格
            }
            //    console.log(ref)
          })*/
      },
      stop() {
        this.key_stop = true;
        this.long_price = this.new_price;
        this.short_price = this.new_price;
      },
      stop_sz() {
        this.key_calc_bzj = true;
      },
      stop_bzj() {
        this.key_calc_market = true;
      },
      back() {
        localStorage.isVirtual = null;
        localStorage.tvSymbol = "";
        clearInterval(this.timer_);
        clearInterval(this.timer);
        clearInterval(this.timer_float)
        this.$router.back(); //后退1步
      },
      go_tran() {
        // console.log(111)
        clearInterval(this.timer_);
        clearInterval(this.timer);
        clearInterval(this.timer_float)
        this.$router.push({
          name: 'transfer'
        })
      },
      get_markets_info() {
        /*axios.get(`${this.$bus.base_domain}/cd_public/markets?isVirtual=${localStorage.isVirtual}`, {
          // isVirtual: true, //鉴定没有过滤
        }).then(ref => {
          if (localStorage.isVirtual == 0) {
            this.USDTdata = ref.data.data.USDT;
            // console.log(this.USDTdata)
            this.BTCdata = ref.data.data.BTC;
            this.ETHdata = ref.data.data.ETH;
          } else {
            this.USDTdata = ref.data.data.EX50;
          }
          //  console.log(ref)
        })*/
      },
      xianSz() {
        //离开焦点
        this.key_calc_bzj = false;
        if (this.xian_market == '') {
          this.xian_market = 200;
        }
      },
      xianBzj() {
        this.key_calc_market = false;
        if (this.xian_bzj == '') {
          this.xian_bzj = 20;
        }
      },
      xianP() { //最近限价发送改变 失去焦点
        if (this.new_price == '') {
          this.new_price = this.last_price;
        }
        this.key_stop = false;
      },
      clear_position() {
        this.cur_position = '';
        // if( ! /^d*(?:.d{0,2})?$/.test(this.)){alert('只能输入数字，小数点后只能保留两位');this.value='';}
      },

      get_user_info() {
        axios.get(`${this.$bus.base_domain}/cd_private/my_assets`).then(ref => {
          if (ref.data.code == -1) {
            this.yu_e = 0
            Toast('请先登录')
          } else if (this.clear_anchor == "ETH") {
            this.yu_e = ref.data.data.ETH;
          } else if (this.clear_anchor == "USDT") {
            this.yu_e = ref.data.data.USDT;
            // console.log(ref)
          } else if (this.clear_anchor == "EX50") {
            this.yu_e = ref.data.data.EX50;
          } else if (this.clear_anchor == "BTC") {
            this.yu_e = ref.data.data.BTC;
          }
          //  this.USDT = ref.data.data.USDT;
            // console.log(ref)
        })
      },

      clear_timer_symbol() { //清除列表里的定时器
        this.showDrawer = false
        clearInterval(this.timer_symbol)
      },
      choose_symbol() {
        // 选择币种列表
        // this.market_values = [] //用于选择市值 列表

        this.showDrawer = true
        this.timer_symbol = setInterval(() => {
          this.get_markets_info()
        }, 2000)
      },
      getTickers() {},
      changeInfo(clear_anchor, item, index) {
        //当切换交易对的时候 切换一下数据
        this.levers = []
        this.markets = []
        // console.log(item)
        this.cur_symbol = item.price_index;
        this.symbol = item.price_index; //传交易对
        clearInterval(this.timer)
        clearInterval(this.timer_)
        clearInterval(this.timer_symbol)
        this.market_cd_id = item.id;
        this.clear_anchor = item.clear_anchor;
        this.coin = clear_anchor[index].coin;
        this.get_user_info()
        this.showDrawer = false;
        /*axios.get(
            `${this.$bus.base_domain}/cd_public/market?cd_id=${this.market_cd_id}&isVirtual=${localStorage.isVirtual}`)
          .then(
            ref => {
              this.levers = ref.data.data.leverages; //杠杆列表
              this.market_values = []
              this.market_values = ref.data.data.anchor_steps; //用于选择市值 列表
              // console.log(ref)
              this.market_values.forEach((item, index) => {
                if (index < 4) {
                  this.markets.push(item)
                }
              })
              this.anchor_ratio = ref.data.data.anchor_ratio;
              this.last_price = ref.data.data.ticker.last_price;
              this.new_price = this.last_price;
              this.change24h = ref.data.data.ticker.change24h;
              if (this.key_stop == false) {
                this.long_price = ref.data.data.ticker.long_price; //买涨的价格
                this.short_price = ref.data.data.ticker.short_price; //买跌的价格
              }
              this.market_now = this.market_values[1];
              this.ganggan = this.levers[1]
            })*/
        //这里为了让价格波动
        this.timer_ = setInterval(() => {
          this.c_market()
        }, 2000)
      },
      // 计算 保证金 = 市值 / 杠杆
      choose_market(item, index) {
        // 选择市值 保证金发生变化
        this.bzj_now = item / this.ganggan;
        this.market_now = item
        this.show_market = false;
        this.hidden = false;
        if (index > 3) {
          this.markets = []
          this.markets.push(this.market_values[index], this.market_values[index - 1],
            this.market_values[index - 2], this.market_values[index - 3])
          this.markets = this.markets.reverse()
        } else if (this.markets.includes(item)) {
          return this.markets
        } else {
          this.markets = this.market_values.slice(0, 4)
        }
      },
      choose_market_(item, index) {
        // 选择市值 保证金发生变化
        this.xian_gg = item
        this.hidden = false
        this.showGg = false
      },
      choose_bzj(item, index) {
        this.cur_markets = index;
        this.bzj_now = item;
      },
      choose_position(item, index) {

        this.cur_position = item //仓位
        if (index == 0) {
          this.xian_bzj = this.yu_e * 1 / 4
          // this.xian_bzj = parseFloat(this.xian_bzj).toFixed(2);
          this.xian_bzj = Math.round(this.xian_bzj);

        } else if (index == 1) {
          this.xian_bzj = this.yu_e * 1 / 3;
          this.xian_bzj = Math.round(this.xian_bzj);


        } else if (index == 2) {
          this.xian_bzj = this.yu_e * 1 / 2;
          // this.xian_bzj = parseFloat(this.xian_bzj).toFixed(2);
          this.xian_bzj = Math.round(this.xian_bzj);

        } else if (index == 3) {
          this.xian_bzj = this.yu_e * 3 / 4;
          // this.xian_bzj = parseFloat(this.xian_bzj).toFixed(2);
          this.xian_bzj = Math.round(this.xian_bzj);

        } else if (index == 4) {
          this.xian_bzj = this.yu_e;
          // this.xian_bzj = parseFloat(this.xian_bzj).toFixed(2); 向下取整
          this.xian_bzj = Math.floor(this.xian_bzj);
        }
      },

      ok() {
        this.show_buy = false; // 购买信息框
        this.show_xian_buy = false;
        this.hidden = false;
        // console.log(localStorage.isVirtual)
        if (this.key == '快捷') {
          /*axios.post(`${this.$bus.base_domain}/cd_private/add_order`, qs.stringify({
            direction: this.buy,
            cd_id: this.market_cd_id,
            market_val: this.market_now,
            leverage: this.ganggan,
            order_type: this.buy_type,
            profit_price: this.max_stop_money, //止盈金额
            loss_price: this.min_stop_money, //止盈金额
          })).then(ref => {
            console.log(ref)
            // MessageBox('温馨提示', '下单成功啦~');
            if (ref.data.code == 1) {
              Toast.success(ref.data.info);
              this.get_user_info()
              this.get_orders_chi()
              this.title = "持仓";
            } else {
              Toast.fail(ref.data.info);
            }

          })*/
        } else {
          /*axios.post(`${this.$bus.base_domain}/cd_private/add_order`, qs.stringify({
            direction: this.buy,
            cd_id: this.market_cd_id,
            market_val: this.xian_market,
            leverage: this.xian_gg,
            open_price: this.new_price, //限价下单传的
            order_type: this.buy_type,
            profit_price: this.max_stop_money, //止盈金额
            loss_price: this.min_stop_money, //止盈金额
          })).then(ref => {
            // MessageBox('温馨提示', '限价下单成功啦~');
            if (ref.data.code == 1) {
              Toast(ref.data.info);
              this.get_user_info()
              this.get_orders_gua()
              this.title = "持仓";
              this.xian = '挂单';
            } else {
              Toast.fail(ref.data.info);
            }

          })*/
        }
      },

      btn_jiaoyi() {
        this.title = "交易"
        this.c_market()
        this.timer_ = setInterval(() => {
          this.c_market()
        }, 2000)
        // clearInterval(this.timer_float)
      },
      btn_chicang() {
        this.title = "持仓"
        this.get_orders_chi()
        clearInterval(this.timer_)
        //   tikers 是为了 让列表里的 数动起来------------------------------
      },




      guoye(item) {
        /*axios.post(`${this.$bus.base_domain}/cd_private/overnight`, qs.stringify({
          order_id: item.order_id,
        })).then(ref => {
          Toast.success(ref.data.info);
        })
        if (item.is_day == 1) {
          item.is_day = 0;
        } else {
          item.is_day = 1;
        }*/
      },

      set_money() { // 设置止盈止损
        // console.log(this.$refs.min_money.value)
        this.show_change = false;
        /*axios.post(`${this.$bus.base_domain}/cd_private/modify_stop_limit`, qs.stringify({
          order_id: this.order_id,
          stop_limit_way: this.stop_limit_way, //方式
          new_profit_amount: this.new_profit_amount, //如果不写 就传默认值 默认金额
          new_loss_amount: this.$refs.min_money.value,
          // new_profit_amount: ,
          // new_loss_amount: ,
        })).then(ref => {
          if (ref.data.code == 1) {
            Toast.success(ref.data.info);
            this.show_change = false;
            if (this.xian == '持仓') {
              this.get_orders_chi()
            } else {
              this.get_orders_gua()
            }
          } else {
            Toast(ref.data.info);
          }
          //   console.log(ref);
        })*/
        this.show_add_bzj = false;
      },


      get_orders_chi() {
        this.xian = '持仓'
        this.status = 1
        /*  axios.post(`${this.$bus.base_domain}/cd_private/get_my_orders?isVirtual=${localStorage.isVirtual}`, qs.stringify({
            status: this.status, //0放到挂单里 1，持仓 ，2 已结算   可以用watch来观察 然后拉 数据
            isVirtual: 1,
          })).then(ref => {
            if (ref.data.code == 1) {
              this.trades = ref.data.data.list;
              this.count = ref.data.data.count.USDT.market_value;
            } else {
              this.trades = []
            }
            if (this.trades.length == 0) {
              this.count = 0;
            }
          })*/
      },
      get_orders_gua() {
        this.xian = '挂单'
        /*this.status = 0,
          axios.post(`${this.$bus.base_domain}/cd_private/get_my_orders?isVirtual=${localStorage.isVirtual}`, qs.stringify({
            status: this.status, //0放到挂单里 1，持仓 ，2 已结算   可以用watch来观察 然后拉 数据
          })).then(ref => {
            this.trades_one = ref.data.data.list;
            //  this.count = ref.data.data.count.USDT.market_value;
          })*/
      },
      get_orders_jie() {
        this.xian = '结算'
        this.status = 2
         /* axios.post(`${this.$bus.base_domain}/cd_private/get_my_orders?isVirtual=${localStorage.isVirtual}`, qs.stringify({
            status: this.status, //0放到挂单里 1，持仓 ，2 已结算   可以用watch来观察 然后拉 数据
          })).then(ref => {
            this.trades_two = ref.data.data.list;
            //  console.log(this.trades_two)
          })*/
      },
      buy_way_type() {
        this.buy_type = 'limit'
        if (this.buy_way == "限价") {
          this.buy_way = "市价"
        } else {
          this.buy_way = "限价"
        }
      },
    },
    watch: {

      key(val) {
        if (val == '专业') {
          this.buy_total_ = this.xian_market / this.last_price; //限价下单 对应币种的total；
        }
      },
      markets(val) {
        this.bzjs = []; // 切换之前 把上次清空
        this.buy_total = null;
        this.levers.forEach(item_ => {
          this.bzjs.push(this.market_now / item_)
        })
        this.bzjs = this.bzjs.reverse();
        this.bzj_now = this.market_now / this.ganggan;
        // console.log(this.ganggan)
        this.buy_total = this.market_now / this.last_price / this.anchor_ratio;
      },
      market_now() {
        this.buy_total = null;
        //当 市值变化的时候
        this.bzjs = []; // 切换之前 把上次清空
        this.levers.forEach(item_ => {
          this.bzjs.push(this.market_now / item_);
        })
        this.bzjs = this.bzjs.reverse();
        this.buy_total = this.market_now / this.last_price / this.anchor_ratio;
      },
      add_bzj_num() {
        this.leverage = this.total_anchor / (parseFloat(this.add_bzj_num) + parseFloat(this.margin));
      },
      xian_market(val) {
        if (val < 0) {
          this.xian_market = '';
          Toast('不可以小于0哦~')
        }
        //this.buy_total_ = val / this.last_price; //限价下单 对应币种的total；
        this.buy_total_ = bc_div(val, this.last_price, 6, 1000);
        if (this.key_calc_market == false) {
          this.xian_bzj = bc_div(val, this.xian_gg, 4, 1000);
          // this.xian_bzj = val / this.xian_gg;
        }
      },
      xian_gg(val) {
        this.xian_bzj = this.xian_market / val; //保证金也要变  然后市值也会变
      },
      xian_bzj(val) {
        if (val < 0) {
          this.xian_market = '';
          Toast('不可以小于0哦~')
        }
        if (this.key_calc_bzj == false) {
          this.xian_market = bc_mul(val, this.xian_gg, 4, 1000);
        }
      },
      last_price(val) {
        this.last_price = parseFloat(val).toFixed(2);
        this.buy_total_ = this.xian_market / val; //限价下单 对应币种的total；
      },
      profit_price(val) { //当 止盈止损框弹出来的时候
        this.profit_price = parseFloat(val).toFixed(2);
      },
      loss_price(val) { //当 止盈止损框弹出来的时候
        this.loss_price = parseFloat(val).toFixed(2);
      },
      loss_amount(val) {},
      USDT(val) { //当 止盈止损框弹出来的时候
        this.USDT = parseFloat(val).toFixed(2);
      },
      buy_way() {
        this.new_price = this.last_price;
      },
      add_bzj_num(val) {
        if (val < 0 && val !== '') {
          this.add_bzj_num = '';
          Toast('不可以小于0哦~')
        }
        this.leverage = this.add.total_anchor / val;
        this.profit_price = val / this.add.total / this.add.direction / this.add.anchor_ratio + parseFloat(this.add.open_price);
        this.loss_price = (val / this.add.total / this.add.direction / this.add.anchor_ratio) + parseFloat(this.add.open_price);
      },
      new_price(val) {
        this.long_price = this.short_price = val;
        if (val < 0 && val !== '') {
          this.new_price = '';
          Toast('不可以小于0哦~')
        }
      },
      new_loss_amount(val) {
        // 最新止损价
        this.loss_price = (val / this.set.total / this.set.direction / this.set.anchor_ratio) + parseFloat(this.set.open_price);

        // this.new_loss_amount = parseFloat(val).toFixed(2);
        if (val > this.set.loss_amount) {
          Toast(`金额最低${this.set.loss_amount}`)
        }
      },
      new_profit_amount(val) {
        // 最新止赢价
        this.profit_price = val / this.set.total / this.set.direction / this.set.anchor_ratio + parseFloat(this.set.open_price);
        // this.new_profit_amount = parseFloat(val).toFixed(2);
        if (val > this.set.profit_amount) {
          Toast(`金额最高${this.set.profit_amount}`)
        }
      },

      yu_e() {
        this.cur_position = null;
        this.xian_market = 200;
      },
      clear_anchor() {
        this.get_user_info()
      },
    },
    beforedestroy() {
      // console.log(11111)
      // clearInterval(this.timer_);
      // this.timer_ = null;
      // clearInterval(this.timer);
      // this.timer = null;
      //  this.bzjs = [];
      // localStorage.removeItem("isVirtual")
    },
    destroyed() {
      // console.log(22222)
      localStorage.isVirtual = null;
      localStorage.tvSymbol = "";
      clearInterval(this.timer_);
      clearInterval(this.timer);
      clearInterval(this.timer_float)
    }


  };
</script>

<style scoped>
  #wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    overflow-y: auto;
    background: rgba(20, 25, 48, 1);
    font-family: PingFang SC;
    max-width: 26.55rem;
    margin: 0 auto;
  }

  #wrap::-webkit-scrollbar {
    display: none;
  }

  #header {
    width: 100%;
    height: 44px;
    background: #1D2340;
    margin: 0;
    padding: 0;
    position: fixed;
    top: 0;
    font-size: 15px;
    max-width: 26.55rem;
  }

  #header .zhong .top {
    display: flex;
    align-items: center;
  }

  #header .zhong .center {
    background: rgba(20, 25, 48, 1);
    border-radius: 8px;
    height: 33px;
    width: 170px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  #header .zhong .center span {
    width: 85px;
    height: 29px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    color: rgba(112, 131, 204, 1);
    position: relative;
  }

  #header .zhong .center span .yuan {
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: red;
    font-size: 13px;
    position: absolute;
    top: 0;
    right: 0;
    color: white;
  }

  .cool {
    background: linear-gradient(30deg, rgba(0, 160, 240, 1), rgba(3, 222, 202, 1));
    color: white !important;
  }

  #header .zhong .right {

    color: #546299;
  }

  #header_ {
    max-width: 26.55rem;
    width: 100%;
    height: 44px;
    background: #1D2340;
  }

  #header .zhong {
    width: 94%;
    margin: 0 auto;
    height: 42px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  #wrap #info #clear_anchor {
    height: 43px !important;
  }

  #wrap #info #clear_anchor_ {
    height: 44px !important;
    padding-bottom: 8px;
    color: #7083CC;
    display: flex;
    justify-content: space-between;

  }

  #wrap #info #clear_anchor_ p {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  #nav {
    width: 100%;
    height: 2.15rem;
    line-height: 2.15rem;
    font-weight: bold;
    background: rgba(20, 25, 48, 1);
  }

  #nav .zhong {
    display: flex;
    justify-content: space-between;
  }

  #nav span:nth-of-type(1) {
    color: white;
    /* margin-left: 1%; */
    font-size: 1.25rem;
  }

  #nav span:nth-of-type(2) {
    color: #0ABF92;
    margin-left: 5%;
    font-size: 1.125rem;
  }

  #nav span:nth-of-type(3) {
    color: #0ABF92;

    font-size: 1.125rem;
  }

  /* k线导航 */
  #kline_nav {
    font-size: 13px;
    color: #7083CC;
    display: flex;
    justify-content: space-between;
    align-items: center;

  }

  #kline_nav span {
    display: flex;
    justify-content: flex-end;

  }

  #bk {
    background: rgba(13, 18, 38, 1);
    height: 0.4375rem;
  }

  /* k线部分 */
  #loading-indicator body.chart-page {
    background: 0 0;
  }

  #tv {
    width: 100%;
  }

  #tv .zhong {
    height: 22.375rem;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .zhong {
    width: 91%;
    margin: 0 auto;
  }

  #kuaijie {
    width: 100%;
    font-size: 13px;
    background: rgba(20, 25, 48, 1);
  }

  #kuaijie .zhong {
    height: 42px;
    width: 91%;
    color: white;
    display: flex;
    box-sizing: border-box;
    align-items: center;
  }

  #kuaijie .zhong .left {
    width: 6.575rem;
    height: 1.875rem;
    background: rgba(34, 41, 72, 1);
    border-radius: 2.5rem;
    display: block;
    line-height: 1.875rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #kuaijie .zhong p input {
    text-align: center;
    outline: none;
  }

  #kuaijie .zhong .left span {
    width: 3.75rem;
    height: 1.875rem;
    border-radius: 2.5rem;
    justify-content: center;
    align-items: center;
    display: flex;
  }

  #kuaijie .zhong .right {
    justify-content: flex-end;
    align-items: center;
    display: flex;
  }

  #kuaijie .zhong .right span {
    width: 3.875rem;
  }

  .key_cur {
    background: linear-gradient(30deg, rgba(0, 160, 240, 1), rgba(3, 222, 202, 1));
  }

  #kuaijie .zhong .right {
    flex: 1;
    text-align: right;
    color: rgba(112, 131, 204, 1)
  }

  #mairu {
    width: 100%;
  }



  .mairu_ .zhong span:nth-of-type(2) {
    width: 20%;
  }

  #mairu .zhong {
    color: wheat;
    display: flex;
    color: rgba(112, 131, 204, 1);
    font-size: 13px;
  }

  #mairu .zhong .left {
    width: 37%;
  }

  #mairu .zhong .right {
    flex: 1;
    text-align: right;
    -webkit-box-flex: 1;
  }

  #num {
    width: 100%;
    margin: 4px 0;
    font-size: 13px;
  }

  #num .zhong {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  #num .zhong span {
    width: 18%;
    height: 2.3125rem;
    background: rgba(34, 41, 72, 1);
    border-radius: 0.1875rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #FFFFFF;
  }

  .num_ {
    font-size: 0.875rem;
  }


  #main {
    background: rgba(20, 25, 48, 1);
  }

  .cur_symbol {
    background: rgba(34, 41, 72, 1);
  }

  .cur_ {
    background: linear-gradient(30deg, rgba(0, 160, 240, 1), rgba(3, 222, 202, 1)) !important;
    color: white;
  }

  #main_ {
    background: rgba(20, 25, 48, 1);
  }

  #bzj {
    width: 100%;
  }

  #bzj .zhong {
    color: wheat;
    color: rgba(112, 131, 204, 1);
    display: flex;
    justify-content: space-between;
    font-size: 13px;
  }

  /* 专业杠杆 */
  #gg {
    width: 100%;
    font-size: 13px;
    margin: 4px 0 8px 0;
  }

  #gg .zhong {
    color: wheat;
    height: 2.5rem;
    color: rgba(112, 131, 204, 1);
    display: flex;
    justify-content: space-between;

  }

  #gg .zhong span {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgba(32, 56, 103, 1);
    border-radius: 6px;
    height: 100%;
    background: rgba(14, 17, 38, 1);
    color: white;
    width: 30%;
    font-size: 1rem;
  }

  #gg .zhong span:nth-of-type(2) {
    background: rgba(14, 17, 38, 1);
    width: 20%;
  }

  #gg .zhong span input {
    text-align: center;
    background: rgba(14, 17, 38, 1);
    border: none;
    color: white;
    -webkit-appearance: none;
    border-radius: 0;
    outline: none;
    width: 100%;
  }

  input:-ms-input-placeholder {
    color: white;
    opacity: 1;
  }

  #input {
    color: black !important;
  }

  input[type='number'] {
    -moz-appearance: textfield;
    font-size: 16px;
  }

  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input::-webkit-input-placeholder {
    color: white;
    opacity: 1;
  }

  /* 止盈止损指数 */
  .zhisun {
    margin-bottom: 0.625rem;
  }

  /* 手续费 */

  #footer {
    width: 100%;
  }

  #footer .zhong {
    color: wheat;
    display: flex;
    color: rgba(112, 131, 204, 1);
    display: flex;
    justify-content: space-between;
    font-size: 13px;
  }



  #btn {
    width: 100%;
    display: flex;
    bottom: 0.625rem;
    max-width: 26.55rem;
  }

  #btn .zhong {
    margin: 10px auto;
    color: white;
    height: 40px;
    display: flex;
    justify-content: space-around;
  }

  #btn .zhong span {
    width: 46%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
  }

  #btn .zhong .left {

    background: #0ABF92;
    border-radius: 0.375rem;
  }

  #btn .zhong .right {

    background: red;
    border-radius: 0.375rem;
  }

  #drawer {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 1);
    z-index: 3;
    position: fixed;
    top: 0;
    /* left: 0; */
    opacity: 0.8;
    max-width: 26.55rem;
  }

  #info {
    width: 19.5rem;
    height: 85.8125rem;
    background: white;
    background: #141930;
    z-index: 5;
    position: fixed;
    top: 0;
    /* left: 0; */
  }

  #info .zhong {
    border-bottom: 1px solid #242F66;
    width: 17.75rem;
    height: 3.9125rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(231, 242, 255, 1);
    font-size: 1.25rem;

  }

  #info .zhong .left {
    width: 6.3125rem;
    height: 3.3125rem;
  }

  #info .zhong .left span:nth-of-type(2) {
    font-size: 0.9375rem;
    color: #7083CC;
  }

  .cur {
    background: rgba(34, 41, 72, 1);
    margin: 0;
    color: white;
  }

  #info .info {
    width: 100%;
    box-sizing: border-box;

  }

  #info .info .zhong:nth-of-type(1) {
    border-bottom: none;
  }

  /* 选择杠杆 和 市值 */
  #chooseGg {
    width: 100%;
    z-index: 3;
    position: fixed;
    bottom: 0;
    /* left: 0; */
    background: rgba(36, 47, 102, 1);
    border-radius: 20px 20px 0px 0px;
    border-bottom: 0.0625rem solid white;
    max-width: 26.55rem;
  }

  #chooseGg .zhong {
    color: #E7F2FF;
    font-size: 1.125rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #chooseGg .zhong_ {
    margin: 5px auto;
    width: 91%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  #chooseGg .zhong_ div {
    width: 31%;
    height: 3.125rem;
    background: rgba(24, 36, 96, 1);
    border-radius: 0.3125rem;
    display: flex;
    font-size: 0.725rem;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: 5px 0;
  }

  #chooseGg .zhong_ div:nth-of-type(2),
  div:nth-of-type(5) {

    /* 需要用定位了 */
  }



  #chooseGg .zhong_ div p {
    width: 8.125rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    margin: 0;
    padding: 0;
  }


  /* 当点击更多的时候 ---市值 */
  #choose_market {
    width: 100%;
    height: 12.25rem;
    z-index: 3;
    position: fixed;
    bottom: 0;
    left: 0;
    background: rgba(36, 47, 102, 1);
    border-radius: 20px 20px 0px 0px;
    border-bottom: 0.0625rem solid white;
  }

  #choose_market .zhong {

    color: #E7F2FF;
    font-size: 1.125rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #choose_market .zhong_ {
    margin: 5px auto;
    width: 91%;
    height: 7.3125rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  #choose_market .zhong_ div {
    width: 31%;
    height: 3.125rem;
    background: rgba(24, 36, 96, 1);
    border-radius: 0.3125rem;
    display: flex;
    font-size: 0.3125rem;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  #choose_market .zhong_ div:nth-of-type(2),
  div:nth-of-type(5) {

    /* 需要用定位了 */
  }



  #choose_market .zhong_ div p {
    width: 8.125rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    margin: 0;
    padding: 0;
  }

  .bk {
    width: 100%;
    height: 1px;
    background: rgba(48, 64, 133, 1);
  }

  /* 买涨 */

  #buy1 {
    width: 91%;
    height: 15rem;
    background: rgba(36, 47, 102, 1);
    border-radius: 10px;
    z-index: 3;
    margin: auto;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 1.025rem;
    max-width: 24.55rem;
  }

  #buy1 div {
    width: 91%;
    height: 30px;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #7083CC;
    font-weight: 400;
    font-size: 15px;
  }



  #buy1 p:nth-of-type(1) {
    margin: 0 auto;
    color: #7083CC;
    width: 91%;
  }

  #buy1 p:last-of-type {
    margin: 1.025rem auto;
    width: 91%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #buy1 p:last-of-type span {
    width: 9rem;
    height: 2.75rem;
    /* background:linear-gradient(30deg,rgba(0,160,240,1),rgba(3,222,202,1)); */
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #31408C;
  }

  #buy1_ {
    width: 91%;
    height: 18rem;
    background: rgba(36, 47, 102, 1);
    border-radius: 10px;
    z-index: 3;
    margin: auto;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 1.025rem;
    max-width: 24.55rem;
  }

  #buy1_ div {
    width: 91%;
    height: 30px;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #7083CC;
    font-weight: 400;
    font-size: 15px;
  }


  #buy1_ p:nth-of-type(1) {
    margin: 0 auto;
    color: #7083CC;
    width: 91%;
  }

  #buy1_ p:last-of-type {
    margin: 0.525rem auto;
    width: 91%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.125rem;
  }

  #buy1_ p:last-of-type span {
    width: 9rem;
    height: 2.75rem;
    /* background:linear-gradient(30deg,rgba(0,160,240,1),rgba(3,222,202,1)); */
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #31408C;
  }

  .bai {
    color: white;
    font-family: DINPro;
  }


  /* 实盘持仓 */


  #chicang {
    width: 100%;
    position: fixed;
    top: 43px;
    /* left: 0; */
    background: #131830;
    max-width: 26.55rem;
    font-size: 16px;
  }

  #chicang_ .zhong {
    height: 34px;
  }

  #chicang .zhong {
    height: 7%;
    display: flex;
    justify-content: space-around;
    align-items: center;

  }

  #chicang .zhong span {
    color: white;
    height: 30px;
    display: block;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #7083CC;
  }

  .xian {
    border-bottom: 1px solid #2963E4;
    border-bottom-width: 2px;
    color: rgba(41, 99, 228, 1);
  }

  /* 总市值订单数 */

  #wrap .orders_box {
    height: 80%;
    overflow-y: auto;
  }


  #orders {
    width: 100%;
  }

  #orders .zhong {
    width: 94%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: white;
    height: 80px;
    background: rgba(36, 47, 109, 1);
    border-radius: 10px;
    margin-bottom: 10px
  }

  #orders .zhong div {
    width: 30%;
    display: flex;
    flex-wrap: wrap;
  }

  #orders .zhong .right {
    width: 20%;
  }

  #orders .zhong div span {
    width: 100%;
    text-align: center;
  }

  #orders .zhong .right span {
    text-align: right;
  }

  /* list */
  #list {
    width: 100%;
    margin: 0 0 10px 0;
  }

  /* 结算页面 */

  #jiesuan #list .zhong {
    height: 134px;
  }

  #list .zhong {
    width: 94%;
    color: white;
    height: 169px;
    background: rgba(36, 47, 109, 1);
    border-radius: 10px;
    font-size: 13px;
    color: #7083CC;
  }

  #list .zhong .header {
    width: 92%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    height: 2.5rem;
    line-height: 2.5rem;
  }

  #list .zhong .info {
    width: 92%;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
  }

  #list .zhong .info span {
    margin: 4px 0;
  }

  #list .zhong .info div {
    width: 43%;
    display: flex;
    flex-wrap: wrap;
  }

  #list .zhong .info div span {
    width: 100%;
  }

  #list .zhong .info .right {
    display: flex;
    text-align: right;
    align-items: flex-start;
    width: 18%;

  }

  #list .zhong .info .right span:nth-of-type(1) {
    font-size: 15px;
    background: rgba(10, 191, 146, 1);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }

  #list .zhong .info .right span {
    width: 100%;
  }

  /* 按钮们 */
  .listbtn {
    width: 92%;
    margin: 0% auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 20%;
  }

  .listbtn span {
    height: 70%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .listbtn span:nth-of-type(1) {
    width: 25%;
    display: flex;
    align-items: center;
  }

  .listbtn span:nth-of-type(2) {
    width: 26%;
    background: rgba(49, 64, 140, 1);
    border-radius: 4px;
  }

  .listbtn span:nth-of-type(3) {
    width: 32%;
    background: rgba(49, 64, 140, 1);
    border-radius: 4px;
  }

  .listbtn span:nth-of-type(4) {
    width: 13%;
    background: rgba(49, 64, 140, 1);
    border-radius: 4px;
  }


  /* 追加保证金 */
  .show_add_bzj div:nth-of-type(3),
  div:nth-of-type(5) span {
    /* font-size: 16px; */
  }

  .show_add_bzj div:nth-of-type(4) input {
    width: 100%;
    height: 35px;
    background: rgba(24, 36, 96, 1);
    border: 1px solid rgba(48, 64, 133, 1);
    border-radius: 5px;
    text-align: center;
    outline: none;
    position: relative;
    font-size: 18px;
    color: white;
  }

  .show_add_bzj .jian {
    position: absolute;
    left: 9%;

  }

  .show_add_bzj .jia {
    position: absolute;
    right: 9%;
  }

  /* 设置止盈止损 */
  #wrap .show_change div {
    margin: 2px auto !important;
  }

  #wrap .show_change [input] {
    margin: 5px auto !important;
  }

  #wrap .show_change div:nth-of-type(1) {
    margin-top: 0;
  }


  #wrap .show_change div input {
    width: 100%;
    height: 32px;
    background: rgba(24, 36, 96, 1);
    border: 1px solid rgba(48, 64, 133, 1);
    border-radius: 5px;
    text-align: center;
    outline: none;
    position: relative;
    font-size: 18px;
    color: white;
  }

  #wrap .show_change .jian {
    position: absolute;
    left: 9%;

  }

  #wrap .show_change .jia {
    position: absolute;
    right: 9%;
  }

  /* 详情列表 */

  #buy2 {
    width: 91%;
    height: 70%;
    background: rgba(36, 47, 102, 1);
    border-radius: 10px;
    z-index: 3;
    margin: auto;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 1.125rem;
    max-width: 24.55rem;
  }

  #buy2 div:nth-of-type(1) {
    height: 42px;
    display: flex;
    align-items: flex-end;
    font-size: 20px;
    margin-bottom: 3px;
  }

  #buy2 div {
    width: 91%;
    height: 7%;
    margin: 0px auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #7083CC;
    font-weight: 200;
    font-size: 13px;
  }

  #buy2 div:nth-of-type(3) {
    font-size: 13px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .buy_way {
    padding: 0px 6px;
    color: white;
    font-size: 13px;
    border-radius: 4px;
  }

  #buy2 div:nth-of-type(4) {
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 30px;
    font-family: DINPro;
    font-weight: 200;
  }

  #buy2 div:nth-of-type(4) span {
    height: 37px;
  }

  #buy2 div:nth-of-type(4) span:nth-of-type(2) {
    display: flex;
    align-items: flex-end;
  }

  #buy2 div:nth-of-type(4) span:nth-of-type(2) span:nth-of-type(1) {
    display: flex;
    align-items: flex-end;
  }

  #buy2 div:nth-of-type(5) {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    border-bottom: 1px dashed #0e688c;
  }

  #buy2 div:nth-of-type(6) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }

  #buy2 div:nth-of-type(7) {
    font-size: 20px;
    color: white;
    border-bottom: 1px dashed #0e688c;
  }

  #buy2 div:nth-of-type(9) {
    border-bottom: 1px dashed #0e688c;
  }

  #buy2 div:nth-of-type(11) {
    border-bottom: 1px dashed #0e688c;
  }

  #buy2 div:nth-of-type(7) .small {
    color: #7083CC;
    font-size: 13px;
  }

  #buy2 div:nth-of-type(8),
  div:nth-of-type(9),
  div:nth-of-type(10),
  div:nth-of-type(11),
  div:nth-of-type(12) {
    font-size: 14px;
  }



  #buy2 p:nth-of-type(1) {
    margin: 0 auto;
    color: #7083CC;
    width: 91%;
  }

  #buy2 p:last-of-type {
    margin: 1.625rem auto;
    width: 91%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #buy2 .weindowbtn span {
    width: 6rem;
    height: 2.75rem;
    /* background:linear-gradient(30deg,rgba(0,160,240,1),rgba(3,222,202,1)); */
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #31408C;
    font-size: 15px;
  }

  /* 结算页面详情 */
  #buy3 {
    width: 91%;
    height: 34rem;
    background: rgba(36, 47, 102, 1);
    border-radius: 10px;
    z-index: 3;
    margin: auto;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 1.125rem;
    max-width: 24.55rem;
  }

  #buy3 div:nth-of-type(1) {
    height: 42px;
    display: flex;
    align-items: flex-end;
    font-size: 20px;
    margin-bottom: 3px;
  }

  #buy3 div {
    width: 91%;
    height: 33px;
    margin: 0px auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #7083CC;
    font-weight: 200;
  }

  #buy3 div:nth-of-type(3) {
    font-size: 13px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  #buy3 div:nth-of-type(4) {
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 30px;
    font-family: DINPro;
    font-weight: 200;
  }

  #buy3 div:nth-of-type(4) span {
    height: 37px;
  }

  #buy3 div:nth-of-type(4) span:nth-of-type(2) {
    display: flex;
    align-items: flex-end;
  }

  #buy3 div:nth-of-type(4) span:nth-of-type(2) span:nth-of-type(1) {
    display: flex;
    align-items: flex-end;
  }

  #buy3 div:nth-of-type(5) {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    border-bottom: 1px dashed #0e688c;
  }

  #buy3 div:nth-of-type(6) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }

  #buy3 div:nth-of-type(7) {
    font-size: 20px;
    color: white;
  }

  #buy3 div:nth-of-type(12) {
    font-size: 14px;
    border-bottom: 1px dashed #0e688c;
  }

  #buy3 div:nth-of-type(13) {
    font-size: 14px;

  }

  #buy3 div:nth-of-type(14) {
    font-size: 12px;
    height: 16px;
  }

  #buy3 div:nth-of-type(15) {
    font-size: 12px;
    height: 16px;
  }

  #buy3 div:nth-of-type(16) {
    font-size: 0.75rem;
    height: 20px;
    color: white;
    font-weight: 300;
  }

  #buy3 div:nth-of-type(17) {
    font-size: 14px;
  }

  #buy3 div:nth-of-type(17) span:nth-of-type(2) {
    color: white;
  }


  #buy3 div:nth-of-type(7) .small {
    color: #7083CC;
    font-size: 13px;
  }

  #buy3 div:nth-of-type(8),
  div:nth-of-type(9),
  div:nth-of-type(10),
  div:nth-of-type(11),
  div:nth-of-type(12) {
    font-size: 14px;
  }



  #buy3 p:nth-of-type(1) {
    margin: 0 auto;
    color: #7083CC;
    width: 91%;
  }

  #buy3 p:last-of-type {
    margin: 1.625rem auto;
    width: 91%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #buy3 .weindowbtn span {
    width: 6rem;
    height: 2.75rem;
    /* background:linear-gradient(30deg,rgba(0,160,240,1),rgba(3,222,202,1)); */
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #31408C;
    font-size: 15px;
  }



  /* 字体 */
  .big {
    font-size: 0.95rem;
    color: white;
    font-family: DINPro;
    font-weight: 200;
  }

  .small {
    font-size: 13px;
    color: #7083CC;
  }

  .small_ {
    font-size: 18px;
    color: #7083CC;
  }

  #strong {
    font-family: DINPro;
    font-weight: 700;
  }

  input::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #0BB98E;
    opacity: 0.4;
  }

  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #0BB98E;
    opacity: 0.4;
  }

  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #0BB98E;
    opacity: 0.4;
  }

  input:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #0BB98E;
    opacity: 0.4;
  }

  /* tradingview */
</style>
