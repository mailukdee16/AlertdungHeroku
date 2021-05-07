function readyindex(){
    $.ajax({
        type: "GET",
        url: "/dataindexjson",
        dataType: 'json',
    
        success: function (response) {
    
        if (response == ""){
    
            document.getElementById('example').innerHTML = "";
            document.getElementById('example').innerHTML = "<h3 align='Center'>ไม่มีการบันทึกข้อมูล</h3>";
    
        } else {
            var fndatatable = response[0]["datajson"]
            $('#example').DataTable({
                "data": fndatatable,
                "searching": false,
                "columns": [
                    {"className": "text-center","data":function(data, type, row, meta){
                        return type === 'display'?
                        fndatatable[meta.row][1] :data;
                    }},
                    {"className": "text-center","data":function(data, type, row, meta) {
                        return type === 'display' ?
                            '<button type="button" class="btn btn-info btn-block btn-flat" id='+ fndatatable[meta.row][0] +' onclick="datadetaildung(this.id)">'+"รายละเอียด"+'</button>'  :
                            data;
                    }},
                ],
            });   
        }
        }, error: function (jqXHR, xhr, ajaxOptions, thrownError) {
                    console.log("failed, error is '" + thrownError + "'");
                    alert("Recrive Patients data failed, error is '" + thrownError + "'");
                }
                
    });  
    }
    
    function datadetaildung(iddung){
        location.href = "/ID/"+iddung+""
    }