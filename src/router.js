import Vue from 'vue';
import VueRouter from "vue-router";
// import Home from './views/home/Home.vue'
Vue.use(VueRouter);
// const routerPush = VueRouter.prototype.push;
// VueRouter.prototype.push = function push(location) {
//   return routerPush.call(this, location).catch(error=> error)
// }
export default new VueRouter({
  mode: "history",
  routes: [{
      path: '/index', //首页
      name: "Home",
      // component: Home,
      component: () =>
        import('./views/home/Home.vue')
    },
    {
        path: '/guide', //行情
        name: "guide",
        component: () =>
          import('./views/home/Guide.vue')
     },
     {
         path: '/ceshi', //行情
         name: "ceshi",
         component: () =>
           import('./views/home/ceshi.vue')
      },

    {
      path: '/trade', //交易
      name: "trade",
      component: () =>
        import('./views/trade/Trade.vue')
    },

    {
      path: '/asset', //资产页面'/home/my_coins_m',
      name: "asset",
      component: () =>
        import('./views/asset/Asset.vue')
    },
    {
      path: '/invite', //行情
      name: "invite",
      component: () =>
        import('@/components/invite.vue')
    },
    {
      path: '/home', //个人中心
      name: "home",
      component: () =>
        import('./views/Personal/Personal.vue'), //专门放电视的
      children: [{
          path: 'center',
          name: 'center',
          component: () =>
            import('./views/Personal/Center.vue'), //个人中心页面
        },
        {
          path: 'transfer',
          name: 'transfer',
          component: () =>
            import('./views/Personal/Transfer.vue'), //划转页面  充币提币  接下来 要转过来
        },
        {
          path: 'help',
          name: 'help',
          component: () =>
            import('./views/Personal/Help.vue'), //帮助中心页面  充币提币  接下来 要转过来
        },
        {
          path: 'ex',
          name: 'ex',
          component: () =>
            import('./views/Personal/Ex.vue'), //了解50EX 充币提币  接下来 要转过来
        },
        {
          path: 'how',
          name: 'how',
          component: () =>
            import('./views/Personal/How.vue'), //如何交易页面
        },
        {
          path: 'task',
          name: 'task',
          component: () =>
            import('./views/Personal/Task.vue'), //任务中心页面
        },
        {
          path: 'invitation',
          name: 'invitation',
          component: () =>
            import('./views/Personal/Invitation.vue'), //任务中心页面
        },
        {
          path: 'login',
          name: 'login',
          component: () =>
            import('@/components/Login.vue'), //登录页面
        },
        {
          path: 'register',
          name: 'register',
          component: () =>
            import('@/components/Register.vue'), //注册
        },
        {
          path: 'forget',
          name: 'forget',
          component: () =>
            import('@/components/Forget.vue'), // 忘记密码
        },
        {
          path: 'resetpsw',
          name: 'resetpsw',
          component: () =>
            import('./views/Personal/setup/ResetPsw.vue'), // 重置密码
        },
        {
          path: 'reset',
          name: 'reset',
          component: () =>
            import('./views/Personal/setup/Reset.vue'), // 修改密码
        },
        {
          path: 'account',
          name: 'account', //账户信息
          component: () =>
            import('./views/Personal/Account.vue'), //有电视
          children: [{
            path: 'realname',
            name: 'realname',
            component: () =>
              import('./views/Personal/RealName.vue') //实名认证界面
          }]
        },
        {
          path: 'setup',
          name: 'setup',
          component: () =>
            import('./views/Personal/setup/SetUp.vue'), // 设置界面
        },
        {
          path: 'deposit',
          name: 'deposit',
          component: () =>
            import('./views/asset/Go.vue'), //充币界面
        },
        {
          path: 'withdraw',
          name: 'withdraw',
          component: () =>
            import('./views/asset/Out.vue'), //提币界面
        },
        // {
        //     path: '/home', //一开始是进入个人中心页面 判断有没有登陆 如果登陆进入这里
        //     redirect: 'Personal'
        // }
      ]
    },
    {
      path:'/*',
      redirect:"/index"
    },
  ],

});
