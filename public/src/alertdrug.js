function insertdata(){
    $.ajax({
        type:"GET",
        url:"/alertdung/"+sessionStorage.userID+"",
        success: function (response) {
            number= [];
            no = 0
                for(var i in response.rows){
                    no++
                    number.push(no)
                    console.log(no)
                }
            console.log(number)
    $('#example').DataTable({
        "data": response.rows,
        "searching": false,
        destroy: true,
        "columns": [
            {"className": "text-center","data":function(data, type, row, meta){
                return type === 'display'?
                number[meta.row]:data;
            }},
            {"className": "text-center","data":function(data, type, row, meta){
                return type === 'display'?
                response.rows[meta.row].namedrung : data;
            }},
            {"className": "text-center","data":function(data, type, row, meta){
                return type === 'display'?
                response.rows[meta.row].timealert : data;
            }},
            {"className": "text-center","data":function(data, type, row, meta){
                return type === 'display'?
                response.rows[meta.row].status : data;
            }},
            {"className": "text-center","data":function(data, type, row, meta) {
                return type === 'display' ?
                    '<button type="button" class="btn btn-info btn-block btn-flat" id='+ response.rows[meta.row].jobnumber +' onclick="DeleteData('+response.rows[meta.row].jobnumber+')">'+"Delete"+'</button>'  :
                    data;
            }},
        ]
    });
    }
})
}

function DeleteData(namealertdrung){
    var settings = {
        "url": "/Delete/"+namealertdrung+"",
        "method": "POST",
        "timeout": 0,
    };
    $.ajax(settings).done(function (response) {
        checkdeletedata(response)
    });

    function checkdeletedata(response){
        if(response == "Success"){
            location.reload();
            alert("Delete Success")
        }else{
            alert(response)
        }

    }
}