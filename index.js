const { response } = require('express');
const express = require('express');
const pg        = require('pg');
const app = express();
const PORT = process.env.PORT || 8080

app.use(express.static("public"));

const config = {
    user: 'postgres',
    database: 'alertdung',
    password: '2624',
    port: 5432       
};
const pool = new pg.Pool(config);

app.post('/data/:username/:pass', (req, res, next) => {
    var username = req.params.username
    var password = req.params.pass
    console.log(username)
    console.log(password)
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


app.listen(PORT,()=>{
    console.log(`Server in runing.${PORT}`)
  })