const express = require('express');
const pg        = require('pg');
const app = express();
const { google } = require('googleapis');
const keys = require('./alertapi.json');
const PORT = process.env.PORT || 8080

app.use(express.static("public"));

const config = {
    host: 'ec2-3-215-57-87.compute-1.amazonaws.com',
    user: 'tkezprifggcogx', 
    database: 'd46gmabaahpvb6',
    password: '11cdbf4d4fc32faf0b0e5401fe423c532981d8f9f8ab5688850792ef1f983942',
    port: 5432,
    ssl: { rejectUnauthorized: false }
};
const pool = new pg.Pool(config);

const client = new google.auth.JWT(
    keys.client_email, 
    null, 
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/drive']
);
  
  
client.authorize(function(err,token){
    if(err){
        console.log(err);
        return;
    }else{
        alldata(client)
    }
  
});
  
async function alldata(cl){
    const gsapi = google.sheets({version:'v4',auth: cl});
    const opt = {
        spreadsheetId : '1XG78FfdP0z8cbGTOC7OTKAgtfUZYsBrBY91UWKPX7vY',
        range: 'Sheet1!A4:B'
    };
    var data = await gsapi.spreadsheets.values.get(opt); 
    var maindata = data.data.values
    datajson(maindata)
  
}
  
function selectdata(idname){
    const client = new google.auth.JWT(
        keys.client_email, 
        null, 
        keys.private_key,
        ['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/drive']
);
    
    
client.authorize(function(err,token){
    if(err){
        console.log(err);
         return;
    }else{
        gsrun(client)
    }
    
});
    
async function gsrun(cl){
    const gsapi = google.sheets({version:'v4',auth: cl});
    const opt = {
        spreadsheetId : '1XG78FfdP0z8cbGTOC7OTKAgtfUZYsBrBY91UWKPX7vY',
        range: 'Sheet1!A1:A'
    };
    var data = await gsapi.spreadsheets.values.get(opt); 
    var maindata = data.data.values
    var index = ''
    for (index = 0; index < maindata.length; index++) {
        var FNmaindata = maindata[index]
        if(FNmaindata == idname){
        break;
        }
    }
    const opt2 = {
        spreadsheetId : '1XG78FfdP0z8cbGTOC7OTKAgtfUZYsBrBY91UWKPX7vY',
        range: 'Sheet1!A'+(index+1)+':E'+(index+1)+''
    };
    var FNdata = await gsapi.spreadsheets.values.get(opt2);
    var nonofulldata = FNdata.data.values
  
    const drive = google.drive({version: 'v3', auth: cl});
    str = FNdata.data.values["0"]["4"]
    drive.files.list({
        pageSize: 10,
        q:"name ='"+ str +"'",
        fields: 'nextPageToken, files(id,name)',
        }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        idphoto = ''
        if (files.length) {
            files.map((file) => {
                idphoto = "https://drive.google.com/uc?export=view&id=" + file.id
                nonofulldata["0"].push(idphoto)
                fulldata = nonofulldata
            });
        } else {
            idphoto = "https://siph-space.sgp1.digitaloceanspaces.com/uploads/editor/1598261295_medicine.jpg"
            nonofulldata["0"].push(idphoto)
            fulldata = nonofulldata
        }
        });
}
}
var myVar = setInterval(myTimer, 20000);
function myTimer(){
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query(`select *  from public."Username" join public.alertdung on public."Username".username_id = public.alertdung.username_id where public.alertdung.status='Wait'`, function (err, result) {
            done();
            if (err) {
                console.log(err);
            }
            alerttime(result.rows)
        })
    })     
}

function alerttime(dataalert){
    for (index = 0; index < dataalert.length; index++) {
        var d = new Date()
        utc = d.getTime() + (d.getTimezoneOffset() * 60000)
        nd = new Date(utc + (3600000*7));
        var n = nd.getUTCHours();
        var m = nd.getUTCMinutes();
        var convertjson = dataalert[index].timealert
        var res = convertjson.split(":");
        if(res[0] == n && res[1] == m){
          linenotify(dataalert[index])
          break;
        }
    }        
}
function linenotify(dataalert){
    var tokenline = dataalert.tokenline
    const lineNotify = require('line-notify-nodejs')(tokenline);
    lineNotify.notify({
        message: "ถึงเวลาทานยา "+dataalert.namedrung,
      }).then(() => {
        console.log('send completed!');
        pool.connect(function (err, client, done) {
            if (err) {
                console.log("Can not connect to the DB" + err);
            }
        client.query(`UPDATE public.alertdung SET status='Success' where jobnumber = `+dataalert.jobnumber+`;`)
        })
      });

}

var dataindexjson;
function datajson(datajson){
    dataindexjson = [{datajson}]
}

var checkdata
function fndata(idname){
    checkdata = [{idname}]
}

var fulldata;
app.get('/data', (req, res, next) => {
    res.send(fulldata)
})

app.get('/dataindexjson', (req, res, next) => {
    res.send(dataindexjson)
})

app.get('/checkdata', (req, res, next) => {
    res.send(checkdata)
})

app.get('/ID/:idname', (req, res) => {
    idname = req.params.idname
    selectdata(idname)
    fndata(idname)
    res.sendFile(__dirname + '/public/detaildrug.html')
})

app.get('/Register', (req, res, next) => {
    res.sendFile(__dirname + '/public/register.html')
})


app.get('/alertdrug', (req, res, next) => {
    res.sendFile(__dirname + '/public/alertdrug.html')
})

app.get('/home', (req, res, next) => {
    res.sendFile(__dirname + '/public/home.html')
})



app.post('/data/:username/:pass', (req, res, next) => {
    var username = req.params.username
    var password = req.params.pass
    pool.connect(function (err, client, done) {
       if (err) {
           console.log("Can not connect to the DB" + err);
       }
        client.query(`SELECT * FROM public."Username" WHERE username_id = '`+username+`'  AND username_password  = '`+password+`'`, function (err, result) {
            done(); 
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result);
        })
   })
});

app.post('/checkregister/:username/:pass/:tokenline', (req, res, next) => {
    var username = req.params.username
    var password = req.params.pass
    var tokenline = req.params.tokenline
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query(`SELECT * FROM public."Username" WHERE username_id = '`+username+`'`, function (err, result) {
            done();
            if(err){
                console.log(err);
                res.status(400).send(err);
            }
            if(result.rows == ""){
                client.query(`INSERT INTO public."Username" (username_id, username_password, tokenline) values ('`+username+`', '`+password+`', '`+tokenline+`');`)
                res.status(200).send("Register Sunccess")
            }else{
                res.status(200).send(result.rows)
            }
    })
})
});
app.get('/alertdung/:username', (req, res, next) => {
    var username = req.params.username
    pool.connect(function (err, client, done) {
       if (err) {
           console.log("Can not connect to the DB" + err);
        }
        client.query(`SELECT * FROM public."alertdung" WHERE username_id = '`+username+`'`, function (err, result) {
            done(); 
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result);
        });
   })
});

app.post('/Delete/:jobnumber', (req, res, next) => {
    var jobnumberdata = req.params.jobnumber
    pool.connect(function (err, client, done) {
       if (err) {
           console.log("Can not connect to the DB" + err);
        }
        client.query(`DELETE FROM public.alertdung WHERE jobnumber = `+ jobnumberdata +` ;`, function (err, result) {
            done(); 
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send("Success");
        });
   })
});

app.post('/insertdata/:username/:timealert/:namedrung', (req, res, next) => {
    var username = req.params.username
    var timealert = req.params.timealert
    var namedrung = req.params.namedrung

    pool.connect(function (err, client, done) {
       if (err) {
           console.log("Can not connect to the DB" + err);
        }
        client.query(`INSERT INTO public.alertdung (username_id, timealert, namedrung, status) VALUES('`+username+`', '`+timealert+`', '`+namedrung+`', 'Wait');`, function (err, result) {
            done(); 
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send("Success");
        });
   })
});

app.get('/public/src/alertdrug.js', (req, res, next) => {
    res.sendFile(__dirname + '/public/src/alertdrug.js')
})

app.get('/public/src/home.js', (req, res, next) => {
    res.sendFile(__dirname + '/public/src/home.js')
})

app.get('/public/src/detaildrug.js', (req, res, next) => {
    res.sendFile(__dirname + '/public/src/detaildrug.js')
})

app.get('/public/bootstrap/dist/js/bootstrap.min.js', (req, res, next) => {
    res.sendFile(__dirname + '/public/bootstrap/dist/js/bootstrap.min.js')
})

app.get('/public/bootstrap/user-friendly-time-picker/dist/css/timepicker.min.css', (req, res, next) => {
    res.sendFile(__dirname + '/public/bootstrap/user-friendly-time-picker/dist/css/timepicker.min.css')
})

app.get('/public/bootstrap/user-friendly-time-picker/dist/js/timepicker.min.js', (req, res, next) => {
    res.sendFile(__dirname + '/public/bootstrap/user-friendly-time-picker/dist/js/timepicker.min.js')
})

app.get('/public/jquery/dist/jquery.min.js', (req, res, next) => {
    res.sendFile(__dirname + '/public/jquery/dist/jquery.min.js')
})

app.get('/dist/css/adminlte.min.css', (req, res, next) => {
    res.sendFile(__dirname + '/dist/css/adminlte.min.css')
})

app.get('/path/to/font-awesome/css/font-awesome.min.css', (req, res, next) => {
    res.sendFile(__dirname + '/path/to/font-awesome/css/font-awesome.min.css')
})

app.get('/css/bootstrap-4.6.0-dist/js/bootstrap.bundle.min.js', (req, res, next) => {
    res.sendFile(__dirname + '/css/bootstrap-4.6.0-dist/js/bootstrap.bundle.min.js')
})


app.listen(PORT,()=>{
    console.log(`Server in runing.${PORT}`)
})