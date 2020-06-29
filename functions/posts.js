
const pg=require('pg')




exports.sharePost = async(req,client) => {

   
  

    try {
        if(req.body.group_id)
     {client.query('INSERT INTO posts (parent_id,parent_author,content, media,author,createdat,privacy,group_id) values($1,$2,$3,$4,$5,$6,$7,$8) returning id',[req.body.parent_id,req.body.parent_author,req.body.content,req.body.media,req.body.authorid,req.body.createdat,req.body.privacy,req.body.group_id],(err,results)=>{
         // return results  
         
         console.log(results)
         console.log(err)
             client.query('update users set posts =array_append(posts,$1) where id=$2;',[(results.rows[0]).id,req.body.authorid],(err,results)=>{
                // res.send('done')


                client.query('update users set posts =array_append(posts,$1) where id=$2;',[(results.rows[0]).id,req.body.authorid],(err,results1)=>{
                    // res.send('done')

                    let tobj=JSON.stringify({
                     type:"shared_post_in_group",
                     authorid:req.body.authorid,
                     content_id:(results.rows[0]).id,
                     group_id:req.body.group_id,
                     time:new Date()

                     
                 })
                 client.query('select * from groups where id=$1',[req.body.group_id],(err,results2)=>{
                     client.query('update users set feed =array_append(feed,$1) where id = ANY($2::int[]);',[tobj,(results2.rows[0].members)],(err,results3)=>{
                         // res.send('done')
                         console.log(err,results3)
                         })
                        })


                    })


                })
         
         
        //  return ;
            })}
            else  if(req.body.event_id)
            {client.query('INSERT INTO posts (parent_id,parent_author,content, media,author,createdat,privacy,event_id) values($7,$8,$1,$2,$3,$4,$5,$6) returning id',[req.body.parent_id,req.body.parent_author,req.body.content,req.body.media,req.body.authorid,req.body.createdat,req.body.privacy,req.body.event_id],(err,results)=>{
                // return results  
                
                console.log(results)
                    client.query('update users set posts =array_append(posts,$1) where id=$2;',[(results.rows[0]).id,req.body.authorid],(err,results)=>{


                        client.query('update users set posts =array_append(posts,$1) where id=$2;',[(results.rows[0]).id,req.body.authorid],(err,results1)=>{
                            // res.send('done')
 
                            let tobj=JSON.stringify({
                             type:"shared_post_in_event",
                             authorid:req.body.authorid,
                             content_id:(results.rows[0]).id,
                             event_id:req.body.event_id,
                             time:new Date()
 
                             
                         })
                         client.query('select * from event where id=$1',[req.body.event_id],(err,results2)=>{
                             client.query('update users set feed =array_append(feed,$1) where id = ANY($2::int[]);',[tobj,(results2.rows[0].participants)],(err,results3)=>{
                                 // res.send('done')
                                 console.log(err,results3)
                                 })
                                })
 
 
                            })
                       // res.send('done')
                       })
                
                
               //  return ;
                   })}
                   else
                   {client.query('INSERT INTO posts (parent_id,parent_author,content, media,author,createdat,privacy) values($6,$7,$1,$2,$3,$4,$5) returning id',[req.body.parent_id,req.body.parent_author,req.body.content,req.body.media,req.body.authorid,req.body.createdat,req.body.privacy],(err,results)=>{
                    // return results  
                    
                    console.log(results)
                        client.query('update users set posts =array_append(posts,$1) where id=$2;',[(results.rows[0]).id,req.body.authorid],(err,results1)=>{
                           // res.send('done')

                           let tobj=JSON.stringify({
                            type:"shared_post",
                            authorid:req.body.authorid,
                            content_id:(results.rows[0]).id,
                            time:new Date()

                            
                        })
                        client.query('select * from users where id=$1',[req.body.authorid],(err,results2)=>{
                            client.query('update users set feed =array_append(feed,$1) where id = ANY($2::int[]);',[tobj,(results2.rows[0].admirers)],(err,results3)=>{
                                // res.send('done')
                                console.log(err,results3)
                                })
                               })


                           })
                    
                    
                   //  return ;
                       })}

 
 
            return 'done'
        
    } catch (error) {
 
 
     console.log(error)
     return 'error'
        
    }
 
 
 }



    

    //console.log(user);
    
    
   // return response;






exports.createPost = async(req,client) => {

   
  

    try {
        if(req.body.group_id)
     {client.query('INSERT INTO posts (content, media,author,createdat,privacy,group_id) values($1,$2,$3,$4,$5,$6) returning id',[req.body.content,req.body.media,req.body.authorid,req.body.createdat,req.body.privacy,req.body.group_id],(err,results)=>{
         // return results  
         
         console.log(results)
             client.query('update users set posts =array_append(posts,$1) where id=$2;',[(results.rows[0]).id,req.body.authorid],(err,results)=>{
                // res.send('done')
                })
         
         
        //  return ;
            })}
            else  if(req.body.event_id)
            {client.query('INSERT INTO posts (content, media,author,createdat,privacy,event_id) values($1,$2,$3,$4,$5,$6) returning id',[req.body.content,req.body.media,req.body.authorid,req.body.createdat,req.body.privacy,req.body.event_id],(err,results)=>{
                // return results  
                
                console.log(results)
                    client.query('update users set posts =array_append(posts,$1) where id=$2;',[(results.rows[0]).id,req.body.authorid],(err,results)=>{
                       // res.send('done')
                       })
                
                
               //  return ;
                   })}
                   else
                   {client.query('INSERT INTO posts (content, media,author,createdat,privacy) values($1,$2,$3,$4,$5) returning id',[req.body.content,req.body.media,req.body.authorid,req.body.createdat,req.body.privacy],(err,results)=>{
                    // return results  
                    
                    console.log(results)
                        client.query('update users set posts =array_append(posts,$1) where id=$2;',[(results.rows[0]).id,req.body.authorid],(err,results1)=>{
                           // res.send('done')
                           let tobj=JSON.stringify({
                            type:"new_post",
                            authorid:req.body.authorid,
                            content_id:(results.rows[0]).id,
                            time:new Date()

                            
                        })
                        client.query('select * from users where id=$1',[req.body.authorid],(err,results2)=>{
                            client.query('update users set feed =array_append(feed,$1) where id = ANY($2::int[]);',[tobj,(results2.rows[0].admirers)],(err,results3)=>{
                                // res.send('done')
                                console.log(err,results3)
                                })
                               })
                        
                            
                            
                           })
                        
                           
                    
                    
                   //  return ;
                       })}

 
 
            return 'done'
        
    } catch (error) {
 
 
     console.log(error)
     return 'error'
        
    }
 
 
 }












exports.findPost = async(req,client) => {
    

   let results= client.query('select * from posts where id=$1',[req.query.postid])

       return results.rows;

    
}

exports.getPosts = async(req,client) => {
    
    if(req.query.authorid)
    {let results=client.query('select * from posts where author=$1',[req.query.authorid])

       return results}
       else if(req.query.groupid)
       {let results=client.query('select * from posts where group_id=$1',[req.query.groupid])
   
          return results}
          else if(req.query.eventid)
       {let results=client.query('select * from posts where event_id=$1',[req.query.eventid])
   
          return results}

}

exports.likePost = async(req,client) => {



    try {
        client.query('UPDATE posts SET likes =array_append(likes,$1) where id=$2;',[req.body.authorid,req.body.postid],(err,results)=>{
            // return results  
            
            console.log(results)
                client.query('UPDATE users SET likes =array_append(likes,$1) where id=$2;',[req.body.postid,req.body.authorid],(err,results)=>{
                   // res.send('done')
                   })
                   let tobj=JSON.stringify({
                    type:"liked_post",
                    authorid:req.body.authorid,
                    content_id:req.body.postid,
                    time:new Date()

                    
                })
                client.query('select * from users where id=$1',[req.body.authorid],(err,results2)=>{
                    client.query('update users set feed =array_append(feed,$1) where id = ANY($2::int[]);',[tobj,(results2.rows[0].admirers)],(err,results3)=>{
                        // res.send('done')
                        console.log(err,results3)
                        })
                       })
            
            
           //  return ;
               })
    
    
               return 'done'
           
       } catch (error) {
    
    
        console.log(error)
        return 'error'
           
       }
    
    
    
    
}

exports.commentPost = async(req,client) => {



    try {
        client.query('INSERT INTO comments (content,onpost,author,createdat) values($1,$2,$3,$4) returning id',[req.body.content,req.body.postid,req.body.authorid,req.body.createdat],(err,results)=>{
            // return results  
            
            console.log(results)
                client.query('update posts set comments =array_append(comments,$1) where id=$2;',[(results.rows[0]).id,req.body.onpost],(err,result5)=>{


                    client.query('UPDATE users SET comments =array_append(comments,$1) where id=$2;',[(results.rows[0]).id,req.body.authorid],(err,result4)=>{
                        // res.send('done')
                        })



                        let tobj=JSON.stringify({
                            type:"commented_post",
                            authorid:req.body.authorid,
                            content_id:(results.rows[0]).id,
                            time:new Date()
        
                            
                        })
                        client.query('select * from users where id=$1',[req.body.authorid],(err,results2)=>{
                            client.query('update users set feed =array_append(feed,$1) where id = ANY($2::int[]);',[tobj,(results2.rows[0].admirers)],(err,results3)=>{
                                // res.send('done')
                                console.log(err,results3)
                                })
                               })
                        

                   // res.send('done')
                   })
            
            
           //  return ;
               })
    
    
               return 'done'
           
       } catch (error) {
    
    
        console.log(error)
        return 'error'
           
       }




}

exports.getComments = async(req,client) => {
    if(req.comment_id)
   {
    let results=client.query('select * from comments where id=$1',[req.query.comment_id])

    return results;

   }
   else

  {  let results=client.query('select * from comments where onpost=$1',[req.query.postid])

       return results;}

}




