function check_register() {
    if (usernameid.value != "" && usernamepassword.value != "" && tokenline.value != "") {
        register(usernameid.value,usernamepassword.value,tokenline.value)
    }
    else {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    }   
}


function register(usr,pass,token){
    var settings = {
        "url": "/checkregister/"+usr+"/"+pass+"/"+token+"",
        "method": "POST",
        "timeout": 0,
      };
      
      $.ajax(settings).done(function (response) {
        checkregister(response)
      });
    
    function checkregister(response){
        if(response == "Register Sunccess"){
            alert("สมัครสมาชิกเรียบร้อย")
            location.href = "/"
        }else{
            alert("Username มีอยู่ในระบบแล้ว")
        }
    }
}

function Backfunction(){
    location.href = "/"
}