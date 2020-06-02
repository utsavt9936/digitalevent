const express=require('express')
const pg=require('pg')
const login=require('./functions/login')
const bodyParser=require('body-parser')
const posts=require('./functions/posts')
const Password=require('./functions/password')
const register=require('./functions/register')
const auth = require('basic-auth');
const jwt=require('jsonwebtoken')
//const port1=process.env.PORT ||3000
const port=process.env.PORT ||3000
const https =require('https')
const fs=require('fs')
const configt=require('./config/config.json')
//const http=require('http')

var hlsconfig={hls:{}}

const lvs=require('./liveStream')
const connectionString='postgres://cudptzoirbatka:23aec0b2b0e941d5a71926bde8bb14d26b216bd6e3ddfc891fac1162975e54c5@ec2-3-229-210-93.compute-1.amazonaws.com:5432/d26ph197quq31v'
const OpenTok=require('opentok')

var opent=new OpenTok('46734492','7060a2f3c61058f3a6893ef0456a75d74bdefe34')


const upload = require('./image-upload');

const singleUpload = upload.single('image');

const authorizeParams = require('./functions/checkToken');








var config = {
    host: 'uvgriddb.cak8aytcldkp.us-east-2.rds.amazonaws.com',
    port: 5432,
    user: 'postgres',
    password: 'L3tsPar7y',
    database: "UVGridDB",
    max: 10,
    idleTimeoutMillis: 30000
}
const pool= new pg.Pool(config)

const app=express()
app.use(bodyParser.json())


/*https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }, app)*/
 
/*http.createServer(app).listen(port1,function(){
    console.log('listening http 3000')
});*/




global.myid

pool.connect((err,client,done)=>{

  // console.log('clt',client)


   globalThis.client=client
   exports.client=client
   
})


app.post('/:id/create_event',authorizeParams,(req,res)=>{
    // const obj=JSON.parse(req.body)
      console.log(req.body)
     // res.send('done')
      const results= globalThis.client.query('INSERT INTO event (organiser_type,event_type,category,organiser_name,description,privacy,image,regfee,tags,event_name,date,time) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',[req.body.org_type,req.body.event_type,req.body.category,req.body.name,req.body.description,req.body.privacy,req.body.image,req.body.regfee,req.body.tags,req.body.event_name,req.body.date,req.body.time],(err,results)=>{
      // console.log(results)   
       res.send('done')
         })

   })



   app.get('/:id/listEvent',authorizeParams,(req,res)=>{
    //ask query ?category=Tech
    if(req.query.event_type)
    {
        globalThis.client.query('select * from event where event_type=$1',[req.query.event_type],(err,results)=>{
            res.send(results.rows)
           })
    }
    //ask query ?speaker=Utsav
else if(req.query.id)
    {
        globalThis.client.query('select * from event where id=$1',[req.query.id],(err,results)=>{
            res.send(results.rows)
           })
    }
         //ask query ?privacy=Public
else if(req.query.privacy)
{
    globalThis.client.query('select * from event where privacy=$1',[req.query.privacy],(err,results)=>{
        res.send(results.rows)
       })
}
    //No query then complete list
    else{
        globalThis.client.query('select * from event',(err,results)=>{
            res.send(results.rows)
           })
    }

})










//console.log(this.globalThis.client)

//Creating Standalone Event

app.post('/:id/createStandalone',authorizeParams,(req,res)=>{
 // const obj=JSON.parse(req.body)
  // console.log(req.body)
  // res.send('done')
   const results= globalThis.client.query('INSERT INTO standalone (speaker,category,topic,description,date,time,speakerid,privacy,image,regfee,tags) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',[req.body.speaker,req.body.category,req.body.topic,req.body.description,req.body.date,req.body.time,req.body.speakerid,req.body.privacy,req.body.image,req.body.regfee,req.body.tags],(err,results)=>{
    //console.log()   
    res.send('done')
      })

})

app.post('/:id/addspeaker',authorizeParams,(req,res)=>{
    // const obj=JSON.parse(req.body)
     // console.log(req.body)
     // res.send('done')
      //global.myid=4
      const results= globalThis.client.query('INSERT INTO standalone (speaker,category,topic,description,date,time,speakerid,privacy,image,regfee,tags) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id',[req.body.speaker,req.body.category,req.body.topic,req.body.description,req.body.date,req.body.time,req.body.speakerid,req.body.privacy,req.body.image,req.body.regfee,req.body.tags],(err,results)=>{
       //console.log()   
       const results1= globalThis.client.query('update event set speakers_id =array_append(speakers_id,$1) where event_name=$2;',[(results.rows[0]).id,req.body.privacy],(err,results)=>{
        // res.send('done')
        })
       
       // console.log(global.myid)
       
       
         })
        // console.log(results)
         
         res.send('done')

   })


//Like request with JSON
app.post('/:id/like',authorizeParams,(req,res)=>{
    const results= this.globalThis.client.query('update standalone set likes =array_append(likes,$1) where id=$2;',[req.body.who,req.body.speaker],(err,results)=>{
        res.send('done')
       })

})
//Comment request with JSON
app.post('/:id/comment',authorizeParams,(req,res)=>{
    globalThis.client.query('update standalone set comments =array_append(comments,$1) where id=$2;',[req.body.comment,req.body.speaker],(err,results)=>{
        res.send('done')
       // console.log(req.body.comment)
       })

})
//Getting list
app.get('/:id/listStandalone',authorizeParams,(req,res)=>{
    //ask query ?category=Tech
    if(req.query.category)
    {
        globalThis.client.query('select * from standalone where category=$1',[req.query.category],(err,results)=>{
            res.send(results.rows)
           })
    }
    //ask query ?speaker=Utsav
else if(req.query.speaker)
    {
        globalThis.client.query('select * from standalone where speaker=$1',[req.query.speaker],(err,results)=>{
            res.send(results.rows)
           })
    }
         //ask query ?privacy=Public
else if(req.query.privacy)
{
    globalThis.client.query('select * from standalone where privacy=$1',[req.query.privacy],(err,results)=>{
        res.send(results.rows)
       })
}
    //No query then complete list
    else{
        globalThis.client.query('select * from standalone',(err,results)=>{
            res.send(results.rows)
           })
    }

})

app.post('/:id/image-upload', function(req, res) {
    singleUpload(req, res, function(err) {
      if (err) {
        res.status(422).send({errors: [{title: 'Image Upload Error', detail: err.message}]})
        console.log('err upload') ;
      }
  
      res.json({'imageUrl': req.file.location})
      console.log(req.file.location) 
    });
  });



  app.post('/register' , async(req,res) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if (!name || !email || !password || !name.trim() || !email.trim() || !password.trim()) {

        res.status(400).json({message: 'Invalid Request !'});
    }

    else
    {
         let respn=await register.registerUser(name , email , password);
         if(respn&&respn.resp==='already registered')
         {
             console.log(respn)
             return  res.send(respn)
         }

         client.query('select * from users where email=$1 ',[email],async (err,results)=>{
             console.table(results.rows)
         })
      //  console.log(typeof(Password.resetPasswordInit))
        let resp=await Password.verifyUserInit(email,name,respn)
        



        //console.log(user);

        res.send('done reg');
        
        
    }

});
app.post('/verifyUser',async(req,res)=>{
    const result=await Password.verifyUserFinal(req.body.email,req.body.otp)
console.log(result)
    if(result.status===200)
    {
        const results= globalThis.client.query('UPDATE users SET otp = $1 where email=$2;',[null,req.body.email],(err,results)=>{
            res.send(result)
           })
    }
    else
    {
        res.send(result)
    }

})


app.patch('/:id/edit_profile',authorizeParams,(req,res)=>{

    if(req.body.name)
    {
        const results= globalThis.client.query('UPDATE users SET name = $1 where id=$2;',[req.body.name,req.params.id],(err,results)=>{
            if(err)
            {
                console.log(err)
                 return res.send(err)
            }
           })
    }
    if(req.body.profilepic)
    {
        const results= globalThis.client.query('UPDATE users SET profilepic = $1 where id=$2;',[req.body.profilepic,req.params.id],(err,results)=>{
            if(err)
            {
                console.log(err)
                 return res.send(err)
            }
           })
    }

    if(req.body.occupation)
    {
        const results= globalThis.client.query('UPDATE users SET occupation = $1 where id=$2;',[req.body.occupation,req.params.id],(err,results)=>{
            if(err)
            {
                console.log(err)
                 return res.send(err)
            }
           })
    }
    

    res.send('updated')

})





//post---------------------------------------------------------------------------
//-------------------------------------------------------------------------------

app.post('/:id/createpost',async (req,res)=>{


    let response = await posts.createPost(req,globalThis.client)

   
    res.send(response)

})

app.post('/:id/sharepost',authorizeParams,async (req,res)=>{


    let response = await posts.sharePost(req,globalThis.client)

   
    res.send(response)

})


app.post('/:id/likepost',authorizeParams,async (req,res)=>{


    let response = await posts.likePost(req,globalThis.client)

   
    res.send(response)

})


app.post('/:id/commentpost',authorizeParams,async (req,res)=>{


    let response = await posts.commentPost(req,globalThis.client)

   
    res.send(response)

})

app.get('/:id/getposts',authorizeParams,async (req,res)=>{

    let response=await posts.getPosts(req,client)
    res.send(response.rows)
   // console.table(response.rows)
})


app.get('/:id/findpost',authorizeParams,async (req,res)=>{

    let response=await posts.findPost(req,client)
    res.send(response)
    console.table(response)
})

app.get('/:id/getcomments',authorizeParams,async (req,res)=>{

    let response=await posts.getComments(req,client)
    res.send(response.rows)
    console.log(response.rows)
})

app.post('/:id/addmedia',authorizeParams,async (req,res)=>{

    const results=await  globalThis.client.query('INSERT INTO medias (name,author) values($1,$2) returning id',[req.body.name,req.body.authorid])

          //console.log(results)   
       res.send((results.rows[0]))
         

          
})



// Authentication part



app.post('/authenticate' , async(req,res) => {

   // const credentials = auth(req);
    //console.log(credentials)

    if(!req.body.email||!req.body.password)
    {
        res.status(400).json({message: 'Invalid Request'});
    }
    else
    {
        console.log(req.body);
        console.log(globalThis.client)
        const response = await login.loginUser(req.body.email , req.body.password,globalThis.client);

        if(response==='otp not null'||response==='not registered')
        res.send(response)

        const token = jwt.sign({ _id: response.id } , "UVgridApp");
        res.setHeader('xaccesstoken' , token);
        res.status(200).send(response);
    }
    
});

app.post('/delete',(req,res)=>{
    

    globalThis.client.query('DELETE FROM users where email=$1',[req.query.email])
    res.send('done')

})

app.get('/createSession',async (req,res)=>{

    let response=await lvs.generateSession(req,res)




    //console.log(response)

    //res.send(response.sessionId)

})

app.get('/pubtoken',async (req,res)=>{

    lvs.pubtoken(req,res)


})
app.get('/startbroadcast',async (req,res)=>{

   let tempv= await lvs.startBroadcast(req,res,hlsconfig)
  // app.set('hls',)

 console.log(lvs.brdc)
 
     

})
app.get('/subtoken',async (req,res)=>{

    lvs.subtoken(req,res)

})
app.get('/startrec',async (req,res)=>{

    lvs.startRecord(req,res)

})
app.get('/stoprec',async (req,res)=>{

    lvs.stopRecord(req,res)

})
app.get('/getrec',async (req,res)=>{

    lvs.getRecord(req,res)

})

exports.app=()=>{
    return app
}

const http=require('http').createServer(app)
const io=require('socket.io')(http)

//console.log(io)
io.on('connection',(socket)=>{

    // console.log(' client connected ')
    console.log('new user',socket.id)
     socket.on('comment',(mess)=>{
 
        // console.log(mess)
         io.emit('comment',mess)
         console.log(mess)
     
     })
     socket.on('question',(mess)=>{
 
        // console.log(mess)
         io.emit('question',mess)
         console.log(mess)
     
     })
 
 })

 app.get('/',(req,res)=>{
     res.send("Working ")
 })

 http.listen(port, function () {
    console.log(' Go to https://localhost:3000/')
  })

  app.get('/stopbroadcast',(req,res)=>{
      console.log(configt.broadcast)
     opent.stopBroadcast(configt.broadcast.id,function (err,bds){

        
        configt.broadcast={}
        console.log(bds)
            res.send(bds)
            
     })
     
  })

 
  app.get('/gethls',(req,res)=>{
    
   res.send(configt.broadcast.broadcastUrls.hls)
  // res.send(process.env.BROADCAST.broadcastUrls.hls)
})



//group---------------------------------------------------------------------
//------------------------------------------------------------------------------
app.post('/:id/create_group',authorizeParams,(req,res)=>{

    //console.log('testing............')
    

    
        const result=globalThis.client.query('INSERT INTO groups (group_name,description,icon_url,category,type) values($1,$2,$3,$4,$5)',[req.body.group_name,req.body.description,req.body.icon_url,req.body.category,req.body.type],(error,results)=>{
        if(error)
        {

        } 
        else
        {
            console.log(results)
    res.send(results)
        
        }   
        
        })
        
        
    
})

app.get('/:id/get_groups',authorizeParams,(req,res)=>{
    if(req.query.category)
    {
        const results=globalThis.client.query('SELECT * FROM groups WHERE category=$1',[req.query.category],(error,result)=>{
            if(error)
            {
                console.log(error)
                res.send(error)
            }
            {
                res.send(result.rows)
        console.table(result.rows)
            }
        })
      
    }
    else if(req.query.type)
    {
        const results=globalThis.client.query('SELECT * FROM groups WHERE type=$1',[req.query.type],(error,result)=>{
            if(error)
            {
                console.log(error)
                res.send(error)
            }
            {
                res.send(result.rows)
        console.table(result.rows)
            }
        })
      

    }
    else if(req.query.id)
    {
        const results=globalThis.client.query('SELECT * FROM groups WHERE id=$1',[req.query.id],(error,result)=>{
            if(error)
            {
                console.log(error)
                res.send(error)
            }
            {
                res.send(result.rows)
        console.table(result.rows)
            }
        })
      

    }
    else if(req.query.group_name)
    {
        const results=globalThis.client.query('SELECT * FROM groups WHERE group_name=$1',[req.query.group_name],(error,result)=>{
            if(error)
            {
                console.log(error)
                res.send(error)
            }
            {
                res.send(result.rows)
        console.table(result.rows)
            }
        })
        

    }
    else
    {
        const results=globalThis.client.query('SELECT * FROM groups ',(error,result)=>{
            if(error)
            {
                console.log(error)
                res.send(error)
            }
            {
                res.send(result.rows)
        console.table(result.rows)
            }
        })
        

    }
})

app.get('/:id/share_link',authorizeParams,(req,res)=>{

    //res.send("hello")
    var link="https://young-cliffs-17105.herokuapp.com/visit?type="+req.query.type+"&id="+req.query.id+"&name="+req.query.name;

    res.send({
link
    })
    

})

app.get('/visit',(req,res)=>{

    res.redirect('https://play.google.com/store/apps/details?id=com.whatsapp&hl=en_IN')
})