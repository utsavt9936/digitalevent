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
    host: 'uvgrid-db1.cak8aytcldkp.us-east-2.rds.amazonaws.com',
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

  //console.log('clt',client)


   globalThis.client=client
   exports.client=client
   
})


app.post('/:id/create_event',authorizeParams,(req,res)=>{
    // const obj=JSON.parse(req.body)
      console.log(req.body)
     // res.send('done')
      const results= globalThis.client.query('INSERT INTO event (organiser_type,event_type,category,organiser_name,description,privacy,image,regfee,tags,event_name,date,time) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning id',[req.body.org_type,req.body.event_type,req.body.category,req.body.name,req.body.description,req.body.privacy,req.body.image,req.body.regfee,req.body.tags,req.body.event_name,req.body.date,req.body.time],(err,results)=>{
      // console.log(results)   
       res.send({
           id:(results.rows[0]).id})
         })

   })





   app.get('/:id/listEvent',(req,res)=>{
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

app.post('/:id/addspeaker',(req,res)=>{
    // const obj=JSON.parse(req.body)
     // console.log(req.body)
     // res.send('done')
      //global.myid=4
      const results= globalThis.client.query('INSERT INTO standalone (speaker,category,topic,description,date,time,speakerid,privacy,image,regfee,tags,event_id) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning id',[req.body.speaker,null,req.body.topic,req.body.description,req.body.date,req.body.time,req.body.speakerid,null,req.body.image,null,null,req.body.event_id],(err,results)=>{
       //console.log()   
       const results1= globalThis.client.query('update event set speakers_id =array_append(speakers_id,$1) where id=$2;',[(results.rows[0]).id,req.body.event_id],(err,results)=>{
        // res.send('done')
        })
       
       // console.log(global.myid)
       
       
         })
        // console.log(results)
         
         res.send('done')

   })


   app.post('/:id/add_admin_event',authorizeParams,(req,res)=>{
    const results= globalThis.client.query('update event set admins =array_append(admins,$1) where id=$2;',[req.body.admin_id,req.body.event_id],(err,results)=>{
        res.send('done')
       })

   })
   app.post('/:id/add_speaker',authorizeParams,(req,res)=>{
    const results= globalThis.client.query('update event set speakers_id =array_append(speakers_id,$1) where id=$2;',[req.body.speaker_id,req.body.event_id],(err,results)=>{
        res.send('done')
        
       })

   })
   
   app.post('/:id/add_member',authorizeParams,(req,res)=>{
    const results= globalThis.client.query('update event set members =array_append(members,$1) where id=$2;',[req.body.member_id,req.body.event_id],(err,results)=>{
       // res.send('done')
       })
       const results1= globalThis.client.query('update event set req_members =array_remove(req_members,$1) where id=$2;',[req.body.member_id,req.body.event_id],(err,results)=>{
        const results2= globalThis.client.query('update users set events =array_append(events,$1) where id=$2;',[req.body.event_id,req.body.member_id],(err,results)=>{
            res.send('done')

            
           })
       })

   })

   app.post('/:id/request_member',authorizeParams,(req,res)=>{
    const results= globalThis.client.query('update event set req_members =array_append(req_members,$1) where id=$2;',[req.body.member_id,req.body.event_id],(err,results)=>{
       
        console.log(err,results)
        res.send('done')
       })

   })


   app.get('/:id/get_requests_event',authorizeParams,(req,res)=>{
       //console.log(globalThis.client)
    globalThis.client.query('select * from event where id=$1',[req.query.id],(err,results)=>{
        console.log(results.rows)
        res.send(JSON.stringify({array:(results.rows[0]).req_members}))
       })


   })

   app.get('/:id/get_members_event',(req,res)=>{
    //console.log(globalThis.client)
 globalThis.client.query('select * from event where id=$1',[req.query.id],(err,results)=>{
     console.log(results.rows)
     res.send((results.rows[0].members))
    })


})
   app.get('/:id/get_user',(req,res)=>{
    //console.log(globalThis.client)
 globalThis.client.query('select * from users where id=$1',[req.query.id],(err,results)=>{
     return res.send(results.rows)
     console.log(results.rows)

     let tobj=JSON.stringify({
        type:"new_post",
        authorid:577,
        content_id:233,
        time:new Date()

        
    })


    globalThis.client.query('update users set feed =array_append(feed,$1) where id = ANY($2::int[]);',[tobj,(results.rows[0].admirers)],(err,results)=>{
        // res.send('done')
        console.log(err,results)
        })
     
    })

})

   

//Like request with JSON


app.post('/:id/like',authorizeParams,(req,res)=>{
    const results= globalThis.client.query('update standalone set likes =array_append(likes,$1) where id=$2;',[req.body.who,req.body.speaker],(err,results)=>{
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
else if(req.query.event_id)
{
    globalThis.client.query('select * from standalone where event_id=$1',[req.query.event_id],(err,results)=>{
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


app.post('/fpInit',async(req,res)=>{
    const result=await Password.resetPasswordInit(req.body.email,res)


})

app.post('/fpFinal',async(req,res)=>{
    const result=await Password.resetPasswordFinal(req.body.email,req.body.otp,req.body.password,res)


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

app.get('/:id/get_users',async(req,res)=>{

    globalThis.client.query('select * from users where id!=$1',[req.params.id],(err,results)=>{
        console.log(results.rows)
        res.send(results.rows)
       })

})




//post---------------------------------------------------------------------------
//-------------------------------------------------------------------------------

app.post('/:id/createpost',authorizeParams,async (req,res)=>{


    let response = await posts.createPost(req,globalThis.client)

   
    res.send(response)

})


app.post('/:id/editpost',authorizeParams,async (req,res)=>{


    let response = await posts.editPost(req,globalThis.client)

   
    res.send(response)

})

app.post('/:id/deletepost',authorizeParams,async (req,res)=>{


    let response = await posts.deletePost(req,globalThis.client)

   
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
app.get('/:id/get_feed',(req,res)=>{
    globalThis.client.query('select * from users where id=$1',[req.params.id],(err,results)=>{
        res.send(results.rows[0].feed)
       })

})

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
    

    
        const result=globalThis.client.query('INSERT INTO groups (group_name,description,icon_url,category,type) values($1,$2,$3,$4,$5) returning id',[req.body.group_name,req.body.description,req.body.icon_url,req.body.category,req.body.type],(error,results)=>{
        if(error)
        {

        } 
        else
        {
            console.log(results)
            res.send({
                id:(results.rows[0]).id})
             
        
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




app.post('/:id/add_admin_group',authorizeParams,(req,res)=>{
    const results= globalThis.client.query('update groups set admins =array_append(admins,$1) where id=$2;',[req.body.admin_id,req.body.group_id],(err,results)=>{
        res.send('done')
       })

   })
   
   app.post('/:id/add_participants',authorizeParams,(req,res)=>{
    const results= globalThis.client.query('update groups set participants =array_append(participants,$1) where id=$2;',[req.body.participant_id,req.body.group_id],(err,results)=>{
       // res.send('done')
       })

       const results1= globalThis.client.query('update groups set req_participants =array_remove(req_participants,$1) where id=$2;',[req.body.participant_id,req.body.group_id],(err,results)=>{
        const results2= globalThis.client.query('update users set groups =array_append(groups,$1) where id=$2;',[req.body.group_id,req.body.participant_id],(err,results)=>{
        res.send('done')
       })
       })

   })

   app.post('/:id/request_participant',authorizeParams,(req,res)=>{
    const results= globalThis.client.query('update groups set req_participants =array_append(req_participants,$1) where id=$2;',[req.body.participant_id,req.body.group_id],(err,results)=>{
        res.send('done')
       })

   })


   app.get('/:id/get_requests_group',(req,res)=>{
       //console.log(globalThis.client)
    globalThis.client.query('select * from groups where id=$1',[req.query.id],(err,results)=>{
        console.log(((results.rows[0]).req_participants))
        res.send(JSON.stringify({array:(results.rows[0]).req_participants}))
       })


   })



   app.get('/:id/get_participants',(req,res)=>{
    //console.log(globalThis.client)
 globalThis.client.query('select * from groups where id=$1',[req.query.id],(err,results)=>{
     console.log(results)
     console.log(err)
     console.log(((results.rows[0]).participants))
     res.send(JSON.stringify({array:(results.rows[0]).participants}))
    })


})



   app.post('/:id/add_admirer',(req,res)=>{
    const results= globalThis.client.query('update users set admirers =array_append(admirers,$1) where id=$2;',[req.body.admirer_id,req.params.id],(err,results)=>{
       // res.send('done')
       console.log(err,results)
       })

       const results2= globalThis.client.query('update users set followee =array_append(followee,$1) where id=$2;',[req.params.id,req.body.admirer_id],(err,results)=>{
        // res.send('done')
        console.log(err,results)
        })
       const results1= globalThis.client.query('update users set req_admirers =array_remove(req_admirers,$1) where id=$2;',[req.body.admirer_id,req.params.id],(err,results)=>{
        res.send('done')
       })

   })
   app.post('/:id/remove_admirer',authorizeParams,(req,res)=>{
    const results= globalThis.client.query('update users set admirers =array_remove(admirers,$1) where id=$2;',[req.body.admirer_id,req.params.id],(err,results)=>{
       // res.send('done')
       console.log(err,results)
       })

       const results2= globalThis.client.query('update users set followee =array_remove(followee,$1) where id=$2;',[req.params.id,req.body.admirer_id],(err,results)=>{
        // res.send('done')
        console.log(err,results)
        })
      res.send('done')

   })

   app.post('/:id/request_admirer',authorizeParams,(req,res)=>{
    const results= globalThis.client.query('update users set req_admirers =array_append(req_admirers,$1) where id=$2;',[req.params.id,req.body.admirer_id],(err,results)=>{
        console.log(err)
        console.log(results)
        res.send('done')
       })

   })


   app.get('/:id/get_requests_admirer',(req,res)=>{
    //console.log(globalThis.client)
 globalThis.client.query('select * from users where id=$1',[req.params.id],(err,results)=>{
     console.log(((results.rows[0]).req_admirers))
     res.send(JSON.stringify({array:(results.rows[0]).req_admirers}))
    })


})


app.get('/:id/get_admirers',(req,res)=>{
    //console.log(globalThis.client)
 globalThis.client.query('select * from users where id=$1',[req.params.id],(err,results)=>{
     console.log(((results.rows[0]).admirers))
     res.send(JSON.stringify({array:(results.rows[0]).admirers}))
    })


})














app.get('/:id/share_link',authorizeParams,(req,res)=>{

    //res.send("hello")
    var link="https://young-cliffs-17105.herokuapp.com/visit?type="+req.query.type+"&id="+req.query.id+"&name="+req.query.name;

    res.send({
link
    })
    

})
app.get('/:id/invite_link',authorizeParams,(req,res)=>{

    //res.send("hello")
    var link="https://young-cliffs-17105.herokuapp.com/invite?type="+req.query.type+"&id="+req.query.id+"&name="+req.query.name;

    res.send({
link
    })
    

})



app.get('/visit', (req,res)=>{

    res.redirect('https://play.google.com/store/apps/details?id=com.whatsapp&hl=en_IN')

} )
app.get('/invite', (req,res)=>{

    res.redirect('https://play.google.com/store/apps/details?id=com.whatsapp&hl=en_IN')

} )










//------------------------------Chat---------------------------------------------------------------------------------
//------------------------------Chat----------------------------------------------------------------------------------

var storeId={}
var storeSocket={}

io.on('connection', (socket) => {

    console.log('user connected',socket.id); 
    // console.log(socket.id);
    // console.log('====================================');
    // console.log(io.sockets.connected[socket.id].id);
    // console.log('====================================');   

    socket.on('register',async(userId)=>{
        storeId[userId]=socket.id
        storeSocket[socket.id]=userId


    })
    socket.on('disconnect',function(){
        storeId[storeSocket[socket.id]]=undefined
        delete storeSocket[socket.id]


    })
    
    socket.on('join', async(req) => {
        
        let request = JSON.parse(req);

        console.log(request)

        socket.join(request.group_id)
        socket.broadcast.to(request.group_id).emit('group_message',req)
    });

    socket.on('group_message', async(req) => {
        
        let request = JSON.parse(req);

        console.log(request)

        socket.broadcast.to(request.group_id).emit('group_message',req)
        const results= globalThis.client.query('INSERT INTO messages (mfrom,mto,group_id,name,avatar,mcontent,time,seen) values($1,$2,$3,$4,$5,$6,$7,$8) ',[request.from,null,request.group_id,request.name,request.avatar,request.message,new Date(),0],(error,results)=>{
            if(error)
            {console.log(error)}
            
              })
    });

    socket.on('joinRoom' , async(req) => {

        let request = JSON.parse(req);
        if(checkToken(request._id , request.accessToken)){

            let currentUser = await User.findOne({_id: request._id});

            let currentRoom = await MessageRoom.findOne({_id: request.roomId});

            currentRoom.members.push(currentUser._id);
            await currentRoom.save();

            currentUser.rooms.push(currentRoom._id);
            await currentUser.save();

            socket.broadcast.to(currentRoom._id).emit('joinMessage', currentUser._id);
            
            socket.join(currentRoom._id);
        }
        else
        {
            console.log('Invalid Token');
            return;
        }
    });

    socket.on('group' , async(req) => {

        let request = JSON.parse(req);

        if(checkToken(request._id , request.accessToken)) {

            let message = new MessageRoom({
                content: request.msg,
                sender: request._id,
                room: request.roomId,
                createdAt: new Date()
            });

            await message.save();

            let currentRoom = await Room.findOne({_id: roomId});

            console.log('Group message to ' + currentRoom.name);
            
            socket.broadcast.to(currentRoom._id).emit('group', message);
        }                  
        else
        {
            console.log('Invalid token');
        }
    });

    socket.on('addUser' , async(req) => {

        let request = JSON.parse(req);

        if(checkToken(request._id , request.accessToken)) {

            let currentUser = await User.findOne({name: request.addName});
            currentUser.rooms.push(request.roomId);
            await currentUser.save();

            let currentRoom = await Room.findOne({_id: request.roomId});
            currentRoom.members.push(currentUser._id);
            await currentRoom.save();

            console.log(currentUser.name + 'has been added to the chat room ' + currentRoom.name);

            io.sockets.connected[currentUser.socketId].join(request.roomId);
            socket.broadcast.to(currentRoom._id).emit('joinMessage', currentUser._id);
        }
    });

    socket.on('updateId',(request)=>{
        let req = JSON.parse(request);
        console.log(req,"inside upid")
        const results= globalThis.client.query('UPDATE socketid SET socketid = $1 where userid=$2;',[req.socketId,req.userId],(err,results)=>{
            if(err)
            {
                console.log(err,"inside upid err")
                 
            }
            
           })

    })
   

    socket.on('private' , async(req) => { 

        let request = JSON.parse(req);
       
        console.log(request)
        console.log(storeId[request.to])
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        if(storeId[request.from])
        {
            const results= globalThis.client.query('INSERT INTO messages (mfrom,mto,mcontent,time,seen) values($1,$2,$3,$4,$5) ',[request.from,request.to,request.message,new Date(),1],(error,results)=>{
                if(error)
                {console.log(error)}

                  })
            io.to(storeId[request.to]).emit('private',JSON.stringify({
            message:request.message,
            from:request.from

        }))}
        else
        {
            const results= globalThis.client.query('INSERT INTO messages (mfrom,mto,mcontent,time,seen) values($1,$2,$3,$4,$5) ',[request.from,request.to,request.message,new Date(),0],(error,results)=>{
                if(error)
                {console.log(error)}
                
                  })
           }

       /* if(checkToken(request._id , request.accessToken)) {

            //console.log('inside private');

            let receiver = await User.findOne({ name: request.to});

            let message = new MessageConvo({
                content: request.msg,
                sender: request._id,
                receiver: receiver._id,
                conversation: request.convo,
                createdAt: new Date()
            });

            await message.save();

            console.log('Private message to ' + receiver.name);

            io.to(`${receiver.socketId}`).emit('private', message);
        }                  
        else
        {
            console.log('Invalid token');
        }
        
    */
   
        });

    socket.on('create' , async(req) => {

        let request = JSON.parse(req);
        
        if(checkToken(request._id , request.accessToken)) {

            let room = new Room({
                createdAt: new Date(),
                name: request.roomName,
                members: [request._id],
                creator: request._id
            });

            let newRoom = await room.save();

            console.log('Room created ' + roomName);
            
            socket.join(newRoom._id);
        }
    });

});    

app.get('/:id/get_messages',authorizeParams,async(req,res)=>{

    if(req.query.toid)
   { const results=globalThis.client.query('select * from messages where (mfrom=$1 AND mto=$2) OR (mfrom=$2 AND mto=$1)',[req.params.id,req.query.toid],(error,result)=>{
        if(error)
        {
            console.log(error)
            res.send(error)
        }
        {
            res.send(result.rows)
    console.table(result.rows)
        }
    })}
    else if(req.query.group_id)
    { const results=globalThis.client.query('select * from messages where group_id=$1',[req.query.group_id],(error,result)=>{
         if(error)
         {
             console.log(error)
             res.send(error)
         }
         {
             res.send(result.rows)
     console.table(result.rows)
         }
     })}


})




//--------------------------------------------------------------
//----------PROGRAM---------------------------------------------


app.post('/:id/create_program',(req,res)=>{
    // const obj=JSON.parse(req.body)
      console.log(req.body)
     // res.send('done')
     if(req.body.privacy=="Private")
     {
        const results= globalThis.client.query('INSERT INTO program (event,title,description,privacy,image,date,time) values($1,$2,$3,$4,$5,$6,$7) returning id',[req.body.event_id,req.body.title,req.body.description,req.body.privacy,req.body.image,req.body.date,req.body.time],(err,results)=>{
            // console.log(results)   
             res.send({
                 id:(results.rows[0]).id,
                status:"created"})
               })

     }
     else
     {
        globalThis.client.query('select * from event where id=$1',[req.body.event_id],(err,results)=>{
            if(!results)
            return res.send("No event of this id present")
            let tp=(results.rows[0]).members
            console.log(tp)
            const results2= globalThis.client.query('INSERT INTO program (event,title,description,privacy,image,date,time,members) values($1,$2,$3,$4,$5,$6,$7,$8) returning id',[req.body.event_id,req.body.title,req.body.description,req.body.privacy,req.body.image,req.body.date,req.body.time,tp],(err,results1)=>{
               // console.log(results1,err)   
                 res.send({
                     id:(results1.rows[0]).id,
                    status:"created"})
                   })


           }) 
     }
      

   })



   app.get('/:id/listProgram',(req,res)=>{
    //ask query ?category=Tech
   if(req.query.privacy)
   {
    globalThis.client.query('select * from program where event=$1 and privacy=$2',[req.query.event_id,req.query.privacy],(err,results)=>{
        res.send(results.rows)
       })     
   }
   else if(req.query.title)
   {
    globalThis.client.query('select * from program where event=$1 and title=$2',[req.query.event_id,req.query.title],(err,results)=>{
        res.send(results.rows)
       })    

   }
   else
   {
    globalThis.client.query('select * from program where event=$1 ',[req.query.event_id],(err,results)=>{
        res.send(results.rows)
       })  

   }


})



app.post('/:id/add_member_program',authorizeParams,(req,res)=>{
    try {
        const results= globalThis.client.query('update program set members =array_append(members,$1) where id=$2;',[req.body.member_id,req.body.program_id],(err,results)=>{
            // res.send('done')
            })
            const results1= globalThis.client.query('update program set req_members =array_remove(req_members,$1) where id=$2;',[req.body.member_id,req.body.program_id],(err,results)=>{
             
            })
            res.send("Member Added")
    } catch (error) {
        res.send(error)
    }
      

   })

   app.post('/:id/request_member_program',authorizeParams,(req,res)=>{
    const results= globalThis.client.query('update program set req_members =array_append(req_members,$1) where id=$2;',[req.body.member_id,req.body.program_id],(err,results)=>{
       
        console.log(err,results)
        res.send('done')
       })

   })



   
   app.get('/:id/get_requests_program',authorizeParams,(req,res)=>{
       //console.log(globalThis.client)
    globalThis.client.query('select * from program where id=$1',[req.query.id],(err,results)=>{
        console.log(results.rows)
        res.send(JSON.stringify({array:(results.rows[0]).req_members}))
       })


   })

   app.get('/:id/get_members_program',(req,res)=>{
    //console.log(globalThis.client)
 globalThis.client.query('select * from program where id=$1',[req.query.id],(err,results)=>{
     console.log(results.rows)
     res.send((results.rows[0].members))
    })


})

//----------------------------------------------------------------------------
//----------------------------------STORY-------------------------------------


app.post('/:id/create_story',(req,res)=>{
    // const obj=JSON.parse(req.body)
      console.log(req.body)
     // res.send('done')
     var unx =new Date()
       var tt=Math.floor(unx.getTime()/1000);
     if(req.body.event_id)
     {
        const results= globalThis.client.query('INSERT INTO story (event_id,text,image,time,author_id) values($1,$2,$3,$4,$5) returning id',[req.body.event_id,req.body.text,req.body.image,tt,req.body.author_id],(err,results)=>{
            // console.log(results)   
             res.send({
                 id:(results.rows[0]).id,
                status:"created"})
               })

     }
     else if(req.body.group_id)
     {
        const results= globalThis.client.query('INSERT INTO story (group_id,text,image,time,author_id) values($1,$2,$3,$4,$5) returning id',[req.body.group_id,req.body.text,req.body.image,tt,req.body.author_id],(err,results)=>{
            // console.log(results)   
             res.send({
                 id:(results.rows[0]).id,
                status:"created"})
               })
     }
     else
   res.send("Found Nothing ")
      

   })



   app.get('/:id/listStory',(req,res)=>{
       var unx =new Date()
       var tt=Math.floor(unx.getTime()/1000);
       tt=tt-24*60*60

       globalThis.client.query('delete from story where time<$1 ',[tt],(err,results)=>{
        console.log(results.rows)
       }) 


    //ask query ?category=Tech
   if(req.query.event_id)
   {
    globalThis.client.query('select * from story where event_id=$1 ',[req.query.event_id],(err,results)=>{
        res.send(results.rows)
       })     
   }
   else if(req.query.group_id)
   {
    globalThis.client.query('select * from story where group_id=$1 ',[req.query.group_id],(err,results)=>{
        res.send(results.rows)
       })    

   }
   else
   res.send("Found Nothing ")


})


//-------------------------------------------------------------------------
//-------------------------------report------------------------------------





app.post('/:id/create_report',(req,res)=>{
    // const obj=JSON.parse(req.body)
      console.log(req.body)
     // res.send('done')
     var unx =new Date()
       var tt=Math.floor(unx.getTime()/1000);
     if(req.body.event_id)
     {
        const results= globalThis.client.query('INSERT INTO report (event_id,description,author_id,time) values($1,$2,$3,$4) returning id',[req.body.event_id,req.body.description,req.body.author_id,req.body.time],(err,results)=>{
            // console.log(results)   
             res.send({
                 id:(results.rows[0]).id,
                status:"created"})
               })

     }
     else if(req.body.group_id)
     {
        const results= globalThis.client.query('INSERT INTO report (group_id,description,author_id,time) values($1,$2,$3,$4) returning id',[req.body.group_id,req.body.description,req.body.author_id,req.body.time],(err,results)=>{
            // console.log(results)   
             res.send({
                 id:(results.rows[0]).id,
                status:"created"})
               })
     }
     else if(req.body.user_id)
     {
        const results= globalThis.client.query('INSERT INTO report (user_id,description,author_id,time) values($1,$2,$3,$4) returning id',[req.body.user_id,req.body.description,req.body.author_id,req.body.time],(err,results)=>{
            // console.log(results)   
             res.send({
                 id:(results.rows[0]).id,
                status:"created"})
               })
     }
     else
   res.send("Found Nothing ")
      

   })



   app.get('/:id/listreports',(req,res)=>{
    globalThis.client.query('select * from report ',(err,results)=>{
        console.log(results.rows)
        res.send(results)
       }) 
   })
      


   app.post('/:id/create_story',(req,res)=>{
    // const obj=JSON.parse(req.body)
      console.log(req.body)
     // res.send('done')
     var unx =new Date()
       var tt=Math.floor(unx.getTime()/1000);
     if(req.body.event_id)
     {
        const results= globalThis.client.query('INSERT INTO story (event_id,text,image,time,author_id) values($1,$2,$3,$4,$5) returning id',[req.body.event_id,req.body.text,req.body.image,tt,req.body.author_id],(err,results)=>{
            // console.log(results)   
             res.send({
                 id:(results.rows[0]).id,
                status:"created"})
               })

     }
     else if(req.body.group_id)
     {
        const results= globalThis.client.query('INSERT INTO story (group_id,text,image,time,author_id) values($1,$2,$3,$4,$5) returning id',[req.body.group_id,req.body.text,req.body.image,tt,req.body.author_id],(err,results)=>{
            // console.log(results)   
             res.send({
                 id:(results.rows[0]).id,
                status:"created"})
               })
     }
     else
   res.send("Found Nothing ")
      

   })



   app.get('/:id/listStory',(req,res)=>{
       var unx =new Date()
       var tt=Math.floor(unx.getTime()/1000);
       tt=tt-24*60*60

       globalThis.client.query('delete from story where time<$1 ',[tt],(err,results)=>{
        console.log(results.rows)
       }) 


    //ask query ?category=Tech
   if(req.query.event_id)
   {
    globalThis.client.query('select * from story where event_id=$1 ',[req.query.event_id],(err,results)=>{
        res.send(results.rows)
       })     
   }
   else if(req.query.group_id)
   {
    globalThis.client.query('select * from story where group_id=$1 ',[req.query.group_id],(err,results)=>{
        res.send(results.rows)
       })    

   }
   else
   res.send("Found Nothing ")


})


//-------------------------------------------------------------------------
//-------------------------------report------------------------------------





app.post('/:id/create_block',(req,res)=>{
    // const obj=JSON.parse(req.body)
      console.log(req.body)
     // res.send('done')
     
     
        const results= globalThis.client.query('INSERT INTO block (blocker,blocked,time) values($1,$2,$3) returning id',[req.body.blocker,req.body.blocked,req.body.time],(err,results)=>{
            // console.log(results)   
             res.send({
                 id:(results.rows[0]).id,
                status:"created"})
               })

     
      

   })



   app.get('/:id/get_blocks',(req,res)=>{
    if(req.body.blocker)
    {globalThis.client.query('select * from block where blocker=$1 ',[req.body.blocker],(err,results)=>{
        console.log(results.rows)
        res.send(results)
       }) }
       else if(req.body.blocked)
       {globalThis.client.query('select * from block where blocked=$1 ',[req.body.blocked],(err,results)=>{
           console.log(results.rows)
           res.send(results)
          }) }

          res.send("send proper body")
   })
   app.get('/:id/unblock_request',(req,res)=>{
    const results2= globalThis.client.query('update block set requests =array_append(requestss,$1) (where blocker=$2) and (where blocked=$3);',[req.body.request,req.body.blocker,req.body.blocked],(err,results)=>{
        res.send('done')

        
       })
   })
      



