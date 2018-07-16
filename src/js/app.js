var scrollTop = 0;
//更新步骤 step


$(function () {
    

    
    function fmoney(s, n) {   
        n = n > 0 && n <= 20 ? n : 2;   
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
        var l = s.split(".")[0].split("").reverse(),   
        r = s.split(".")[1];   
        console.log(l);
        
        t = "";   
        console.log(l[l.length-1], 1231354);
        for(i = 0; i < l.length; i ++ )   
        {   
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length && l[i+1] !== "-" ? "," : "");   
        }   
        return t.split("").reverse().join("") + "." + r;   
    }
    var abc = fmoney('6961.565',2);
    console.log(abc);


    //------------------协议同意---------------
	var agree = false;
	$('#agree-btn').on('click',() => {
		agree = !agree;
		$("#agree-btn").toggleClass("unselect")
        $("#sure-btn").toggleClass("disable")
        $("#au-tip").toggleClass("colff5c45")
    })
    
    //参加活动
	$('#sureJoin').click(function(){
        if(!agree) {
            toast('请先阅读并同意以上说明');
            return;
        }
        $('#showJoinBox').hide();
        clsoeAlert();

        //ajax 成功
        changeStep(1);
        btnStatus(2);
		toast('恭喜你，成功参加活动！');
    })

})


//手机验证
function phoneChk( phone ){
    if(!/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(phone))
    {
      return false;
    }
    else{
        return true;
    }
}


// 提示
$('body').append(function() {
    return "<center class='tip_wrap'><span class='tip'></span></center>";
});
function toast(msg, time) {
    var aftTime = 2000;
    if(time){
        aftTime = parseInt(time);
    }

    $('.tip').text(msg);
    $('.tip_wrap').show();
    setTimeout(function() {
        $('.tip_wrap').hide();
    }, aftTime);
    
}



//弹窗时屏幕禁止滚动
function to(scrollTop) {
  document.body.scrollTop = document.documentElement.scrollTop = scrollTop;
}
function getScrollTop() {
  return document.body.scrollTop || document.documentElement.scrollTop;
}


function openAlert() {

  // 在弹出层显示之前，记录当前的滚动位置
  scrollTop = getScrollTop();

  // 使body脱离文档流
  document.body.classList.add('modal-open');


  // 把脱离文档流的body拉上去！否则页面会回到顶部！
  document.body.style.top = -scrollTop + 'px';
}


function clsoeAlert() {

  document.body.classList.remove('modal-open');

  document.body.style.top = 0 + 'px';

  to(scrollTop);
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
