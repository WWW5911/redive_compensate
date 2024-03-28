let timePass = 90;

function timeTran1(text){
    colon = text.includes(":") ? ":" : "：";
    min = text.split(colon)[0];
    sec = text.split(colon)[1];
    return parseInt(min) * 60 + parseInt(sec);
}
function timeTran2(text){
    min = text[0];
    sec = text.substring(1,3);
    return parseInt(min) * 60 + parseInt(sec);
}

function check(){
    var LeftInput = document.getElementById('leftSec').value;
    var ret = 90;
    if (LeftInput.includes(":") || LeftInput.includes("：")){
        colon = LeftInput.includes(":") ? ":" : "：";
        min = LeftInput.split(colon)[0];
        sec = LeftInput.split(colon)[1];
        ret = parseInt(min) * 60 + parseInt(sec);
        document.getElementById('timeFormat').innerHTML = '（<span style="color:red">分:秒秒</span> / 分秒秒 / 秒秒）'
        
    }
    else if(LeftInput.length == 3){
        min = LeftInput[0];
        sec = LeftInput.substring(1,3);
        ret = parseInt(min) * 60 + parseInt(sec);
        document.getElementById('timeFormat').innerHTML = '（分:秒秒 / <span style="color:red">分秒秒</span> / 秒秒）'
    }else if(LeftInput.length <= 2 && LeftInput.length > 0){
        ret = parseInt(LeftInput);
        document.getElementById('timeFormat').innerHTML = '（分:秒秒 / 分秒秒 / <span style="color:red">秒秒</span>）'
    }else{
        document.getElementById('timeFormat').innerHTML = '（分:秒秒 / 分秒秒 / 秒秒）'
    }
    timePass = 90 - ret;
    compensate( document.getElementById('inputText').value  );
}

var regex1 = /^\d{3}\s?$/; 
var regex2 = /^\d{1}:\d{2}$/; 
var regex2_5 = /^\d{1}：\d{2}$/; 
var regex3 = /^\d{2}$/; 

function compensateTran(text){
    var timeStr = text.substring(0, 4);
    var ret_str = text;
    var flag = -1;
    var colon = ":";
    if (regex1.test(timeStr) || regex1.test(timeStr.substring(0, 3)) ) {
    //    console.log("字符串符合 '数字数字数字' 的格式");
        time = timeTran2(timeStr) - timePass;
        flag = 1;
    } else if (regex2.test(timeStr) || regex2_5.test(timeStr)) {
     //   console.log("字符串符合 '数字:数字数字' 的格式");
        colon = text.includes(":") ? ":" : "：";
        time = timeTran1(timeStr) - timePass;
        flag = 2;
    } else if(regex3.test(timeStr.substring(0, 2) )){
     //   console.log("字符串只符合 '数字数字' 的格式");
        time = parseInt(timeStr.substring(0, 2) ) - timePass ;
        flag = 3;
    }else {
    //    console.log("字符串不符合要求的格式");
    //    if(startFlag) ret_str = "";
        return ret_str;
    }
    
    
    if (time >= 0){
        var min = String(parseInt(time / 60));
        var sec = time % 60;
    }else{
        var min = "0";
        var sec = "0";
    }

    if(sec < 10) sec = "0" + sec;
    else sec = String(sec);
    if(flag == 1){
        ret_str = min + sec + text.substring(3, text.length);
    }
    else if (flag == 2){
        ret_str = min + colon +  sec + text.substring(4, text.length);
    }else if (flag == 3){
        ret_str = "0" + sec + text.substring(2, text.length);
    }

    // if( !startFlag) ret_str =  "\n ==== 以下是時間軸 ====\n" + ret_str;
    startFlag = true;
    
    return ret_str
}
var startFlag = false;
function compensate(text){
    if(text.length == 0){
        document.getElementById('output').innerHTML = "請在左邊輸入軸><";
    }else{
        if(timePass <= 90 && timePass >= 0){
            lines = text.split("\n");
            new_text = ""
            startFlag = false;

            for(var i = 0; i < lines.length; ++i){
                new_text += compensateTran(lines[i]) + "\n";
            }
            var regex = /^(\d{1,}：\d{2}|\d{1,}:\d{2}|\d{1,3}\d{2,3})\b/gm;  // 每行句首 匹配 "數字:數字數字" 或 "數字數字數字" 的模式
            var formattedText = new_text.replace(regex, '<span style="color:red">$1</span>'); // 將符合模式的文字調整為紅色顯示
            document.getElementById('output').innerHTML = formattedText;
        }else{
            document.getElementById('timeFormat').innerHTML = '（分:秒秒 / 分秒秒 / 秒秒）'
            document.getElementById('output').innerHTML = "請輸入正確的剩餘秒數！\n格式為：（分:秒秒 / 分秒秒 / 秒秒 ）"
        } 
    }
}

window.onload = function() {
    var inputText = document.getElementById('inputText');
    
    inputText.addEventListener('input', function() {
        compensate(inputText.value);
        
    });
};
