function check_login() {
    if (usernameid.value != "" && usernamepassword.value != "") {
        login(usernameid.value,usernamepassword.value)
    }
    else {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    }   
}

function login(usr,pass) {
    var settings = {
        "url": "/data/"+usr+"/"+pass+"",
        "method": "POST",
        "timeout": 0,
      };
      
      $.ajax(settings).done(function (response) {
        relogin(response)
      });
    
    function relogin(response){
        if(response.rows == "" || response.rows == null || response.rows == []){
            alert("กรุณาตรวจสอบ Username หรือ Password")
        }else{
            sessionStorage.setItem("userID", response.rows[0].username_id);
            location.href = "/home"
        }
    }
}

function registerid(){
    location.href = "/register"
}