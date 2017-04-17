$(document).ready(function(){
    //窗口滚动
    function wdgd(){
        var windowTime = 500;
        $(window).scroll(function(event){
            if($(window).scrollTop()>50){
                $('.nav_wrap').stop().animate({'height':'80px'},windowTime);
                $('.headerLogo').stop().animate({'top':'16px'},windowTime);
                $('.nav>li').stop().animate({'line-height':'80px'},windowTime);
                $('.nav>li>ul').css({'top':'80px'});
                $('.nav_select').css({'top':'80px'});
            }else{
                $('.nav_wrap').stop().animate({'height':'120px'},windowTime);
                $('.headerLogo').stop().animate({'top':'38px'},windowTime);
                $('.nav>li').stop().animate({'line-height':'120px'},windowTime);
                $('.nav>li>ul').css({'top':'120px'});
                $('.nav_select').css({'top':'120px'});
            }
        });
    }
    wdgd();
});