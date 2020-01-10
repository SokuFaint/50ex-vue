<template>
  <div id="tv_chart_container" style="width: 652px;height: 340px;margin:auto">
  </div>
</template>

<script>
  export default {
    name: 'tv',
    data() {
      return {
        widght: null,
      }
    },
    props: ['symbol', 'interval', 'type'],
    beforeMount() {
      let lastDom = document.getElementById('tv_chart_container')
      if (lastDom) {
        lastDom.setAttribute('id', 'nice')
      }
    },
    mounted() {
      window.tvWidget = new TradingView.widget({
        fullscreen: true, //是否全屏
        symbol: this.$route.query.symbol, //商品标识  必须是字符串
        interval: "1M", //初始化显示分钟刻度 用到websocekt 在用JSapi
        container_id: "tv_chart_container",
        datafeed: new Datafeeds.UDFCompatibleDatafeed('http://pre-m.50ex.com/api/cd_kline', 2000),
        // datafeed: new Datafeeds.UDFCompatibleDatafeed('https://ffapi.myfastapi.com/cd_kline', 2000),
        library_path: "/static/charting_library/",
        locale: "zh", //语言
        autosize: false,
        load_last_chart: true, //显示上次保存的图表
        // prisent:"mobile",
        loading_screen: { backgroundColor: "#000000" },//定制加载进度条
        timezone: "Asia/Shanghai", //时区
        fullscreen: true, //显示图表是否窗口
        toolbar_bg: "#121c31", //工具栏背景颜色

        debug: true,
        // custom_css_url: 'style/black.css', //存放css的地方
        drawings_access: {
          type: 'black',
          tools: [{
            name: "Regression Trend"
          }]
        },

        time_frames: [{
            text: "50y",
            resolution: "6M",
            description: "50 Years"
          },
          {
            text: "3y",
            resolution: "W",
            description: "3 Years",
            title: "3yr"
          },
          {
            text: "8m",
            resolution: "D",
            description: "8 Month"
          },
          {
            text: "3d",
            resolution: "5",
            description: "3 Days"
          },
          {
            text: "1000y",
            resolution: "W",
            description: "All",
            title: "All"
          },
        ],
        SymbolInfo: {
          pricescale: 100,
          volume_precision: 2,
        },
        disabled_features: [
          //禁用功能（隐藏图标按钮）数组
          "use_localstorage_for_settings",
          "remove_library_container_border",
          'header_widght',
          //'widget_logo'
          "save_chart_properties_to_local_storage",
          "volume_force_overlay",
          "left_toolbar", //侧边工具
          "create_volume_indicator_by_default",
          "header_widget_dom_node",
          "header_widget",
          "header_compare",
          "control_bar",
          "dont_show_boolean_study_arguments",
          "edit_buttons_in_legend",
          "context_menus",
          "show_hide_button_in_legend",
          "create_volume_indicator_by_default_once",
          "show_interval_dialog_on_key_press",
          "caption_buttons_text_if_possible", //尝试在按钮上显示文字
          "header_resolutions", //周期设置按钮
          "header_symbol_search", //品种搜索框
          "display_market_status",
          "border_around_the_chart", //边距线
          "romove_library_container_border",
          "timeframes_toolbar", //下方工具栏
          "go_to_date", //下方工具栏
          "property_pages"
        ]
        //enabled_features:["romove_library_container_border"]

        ,
        overrides: {
          //覆盖操作
          // 十字线
          'paneProperties.background': "rgba(20, 25, 48, 1)", //
          'paneProperties.vertGridProperties.color': "#1C2843",
          'paneProperties.horzGridProperties.color': "#1C2843",
          'paneProperties.crossHairProperties.color': "#bcc4d0",
          // 'paneProperties.crossHairProperties.color': "rgb(167, 184, 161,0)",

          // 面积图
          'mainSeriesProperties.haStyle.upColor': "#09BB07",
          'mainSeriesProperties.haStyle.downColor': "#F03869",
          'scalesProperties.fontSize': 11,
          'scalesProperties.textColor': "#7083CC", //价格时间的颜色
          'scalesProperties.lineColor': 'rgba(0,0,0,0)',
          'mainSeriesProperties.style': this.type,
          'mainSeriesProperties.areaStyle.linewidth': 4,
          'mainSeriesProperties.areaStyle.color1': "#7e48e2",
          'mainSeriesProperties.areaStyle.color2': "#161d42",
        },
        studies_overrides: {
          //柱状颜色修改
          "volume.volume.color.0": "#F03869",
          "volume.volume.color.1": "#09BB07",
          // "volume.volume ma.linewidth": 4,
        },

      });
    },

    methods: {},
    beforeDestroy() {},
    watch: {
      symbol: function(val) {

        console.log(this.symbol)
        // alert(this.$route.query.symbol)
        try {
          if (this.type == 3) {
            window.tvWidget.setSymbol(val, 1, (res) => {})
            window.tvWidget.chart().setChartType(3)
          } else {
            window.tvWidget.setSymbol(val, 1, (res) => {})
          }

        } catch (e) {}
        // console.log(`${val}哈哈哈哈`)
      },
      interval: function(val) {
        console.log(val)
        try {
          if (val == 0) {
            window.tvWidget.chart().setChartType(3)
            window.tvWidget.setSymbol(this.symbol, 1, (res) => {})
          } else if (val == 1440) {
            window.tvWidget.chart().setChartType(8);
            window.tvWidget.setSymbol(this.symbol, "D", (res) => {})
          } else {
            window.tvWidget.chart().setChartType(8);
            window.tvWidget.setSymbol(this.symbol, val, (res) => {})
          }
          // window.tvWidget.chart().setResolution(val, (res) => {})
        } catch (e) {}
      },
    },
    destroyed() {
      // console.log('tv destroyed')
    },
    deactivated() {

    },
    activated() {
      // V-IF 的错 因为每次通过路由一进来 symbol就被改变了
      // this.symbol = this.$bus.symbol

    }
  }
</script>
<style>
  iframe {
    height: 350px !important;
  }

  #loading-indicator bod.chart-page {
    background: 0 0;
  }

</style>
