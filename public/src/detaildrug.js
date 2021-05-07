firebase.initializeApp(config);

function addDrung(){
    $('#addDrung').modal('show');
    
    $(function () {
        $('.bs-timepicker').timepicker();
    });
}


function addAlert(){
    if(nameDrungshow.value != "" && timealert.value != ""){
    var namealertdrung = nameDrungshow.value;
    var timealertdrung = timealert.value;
    updateData(namealertdrung,timealertdrung);
    }else{
        alert("กรุณาตั้งเวลา")
    }
}

function updateData(namealertdrung,timealertdrung){
    var settings = {
        "url": "/insertdata/"+sessionStorage.userID+"/"+timealertdrung+"/"+namealertdrung+"",
        "method": "POST",
        "timeout": 0,
      };
      
      $.ajax(settings).done(function (response) {
        checkupdatadata(response)
      });
      function checkupdatadata(response){
        if(response == "Success"){
            alert(response)
            myFunction()
        }else{
            alert(response)
        }
      }
}

function myFunction() {
    location.href = "/alertdrug"
}
