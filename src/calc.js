export {
  bc_add,
  bc_sub,
  bc_mul,
  bc_div
}

    /**
     * 加法运算
     *
     */
    function bc_add(num1 , num2 ,dec_num =4, beishu=1){
        var num = 0;
        num1 = parseFloat(num1)*beishu;
        num2 = parseFloat(num2)*beishu;
        num = num1 + num2;
        num = parseFloat(num/beishu).toFixed(dec_num);
        return num;
    }

    /**
     * 减法运算
     */
    function bc_sub(num1 , num2 ,dec_num=4 , beishu =1){
        var num = 0;
        num1 = parseFloat(num1)*beishu;
        num2 = parseFloat(num2)*beishu;
        num = num1 - num2;
        num = parseFloat(num/beishu).toFixed(dec_num);
        return num;
    }


    /**
     * 乘法运算
     */
    function bc_mul(num1 , num2 ,dec_num=4, beishu=1) {
        var num = 0;
        num1 = parseFloat(num1);
        num2 = parseFloat(num2);
        num = num1 * num2;
        num = parseFloat(num).toFixed(dec_num);
        return num;
    }

    // /**
    //  * 除法运算
    //  */
    function bc_div(num1 , num2 ,dec_num =4, beishu=1){

        var num = 0;
        num1 = parseFloat(num1)*beishu;
        num2 = parseFloat(num2)*beishu;
        if(num2 == 0){
            return false;
        }
        num = num1 / num2;
        num = parseFloat(num).toFixed(dec_num);
        return num;

     }
     
     // /**
     //  * 浮动价格运算
     //  */
     function bc_price(num1 , num2 ,dec_num =4, beishu=1){
     
         var num = 0;
         num1 = parseFloat(num1)*beishu;
         num2 = parseFloat(num2)*beishu;
         if(num2 == 0){
             return false;
         }
         num = num1 / num2;
         num = parseFloat(num).toFixed(dec_num);
         return num;
     
      }
