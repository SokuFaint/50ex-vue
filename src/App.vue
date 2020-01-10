<template>
    <div>
       
        <keep-alive exclude="trade">
          <router-view ></router-view>
        </keep-alive>

    </div>
</template>

<script>

  export default {
      name: 'App',
        methods: {

        },
    }
</script>

<style>
  body{
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  /* 提示框 mint 全局 */
.mint-header{
  background: #1D2340;
  height: 44px;
  font-size: 19px;
}
  .mint-header-title{
   background:linear-gradient(30deg,rgba(0,160,240,1) 0%, rgba(3,222,202,1) 100%);
   -webkit-background-clip:text;
   -webkit-text-fill-color:transparent;

  }
.mintui-back:before{
  width:10px;
  height:17px;
  color: #7083CC;
}

.mint-msgbox {
  background-color: #242F6D !important;
  max-width: 400px !important;
}
.mint-msgbox-title{
  color: white;
}
.mint-msgbox-btn:nth-of-type(2){
  background:linear-gradient(30deg,rgba(0,160,240,1),rgba(3,222,202,1));
  color: white;
}
.mint-msgbox-message {
  color: white;
}


</style>
