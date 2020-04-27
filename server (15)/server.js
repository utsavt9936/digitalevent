const express=require('express')
const pg=require('pg')
const login=require('./functions/login')
const bodyParser=require('body-parser')
const posts=require('./functions/posts')
const Password=require('./functions/password')
const register=require('./functions/register')
const auth = require('basic-auth');
const jwt=require('jsonwebtoken')
const port=process.env.PORT ||3000

const connectionString='postgres://cudptzoirbatka:23aec0b2b0e941d5a71926bde8bb14d26b216bd6e3ddfc891fac1162975e54c5@ec2-3-229-210-93.compute-1.amazonaws.com:5432/d26ph197quq31v'



const upload = require('./image-upload');

const singleUpload = upload.single('image');

const authorizeParams = require('./functions/checkToken');








var config = {
    host: 'uvgrid-test.cak8aytcldkp.us-east-2.rds.amazonaws.com',
    port: 5432,
    user: 'postgres',
    password: 'hailhydra',
    database: "UVGridDB",
    max: 10, 
    idleTimeoutMillis: 30000 
  }
const pool= new pg.Pool(config)

const app=express()
app.use(bodyParser.json())

app.listen(port,'3.20.253.133',()=>{
    console.log('connected')
})


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


app.post('/:id/createpost',authorizeParams,async (req,res)=>{


    let response = await posts.createPost(req,globalThis.client)

   
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