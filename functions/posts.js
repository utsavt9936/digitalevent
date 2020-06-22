
const pg=require('pg')




exports.sharePost = async(req,client) => {

   
  

    try {
        if(req.body.group_id)
     {client.query('INSERT INTO posts (parent_id,parent_author,content, media,author,createdat,privacy,group_id) values($7,$8,$1,$2,$3,$4,$5,$6) returning id',[req.body.parent_id,req.body.parent_author,req.body.content,req.body.media,req.body.authorid,req.body.createdat,req.body.privacy,req.body.group_id],(err,results)=>{
         // return results  
         
         console.log(results)
         console.log(err)
             client.query('update users set posts =array_append(posts,$1) where id=$2;',[(results.rows[0]).id,req.body.authorid],(err,results)=>{
                // res.send('done')
                })
         
         
        //  return ;
            })}
            else  if(req.body.event_id)
            {client.query('INSERT INTO posts (parent_id,parent_author,content, media,author,createdat,privacy,event_id) values($7,$8,$1,$2,$3,$4,$5,$6) returning id',[req.body.parent_id,req.body.parent_author,req.body.content,req.body.media,req.body.authorid,req.body.createdat,req.body.privacy,req.body.event_id],(err,results)=>{
                // return results  
                
                console.log(results)
                    client.query('update users set posts =array_append(posts,$1) where id=$2;',[(results.rows[0]).id,req.body.authorid],(err,results)=>{
                       // res.send('done')
                       })
                
                
               //  return ;
                   })}
                   else
                   {client.query('INSERT INTO posts (parent_id,parent_author,content, media,author,createdat,privacy) values($6,$7,$1,$2,$3,$4,$5) returning id',[req.body.parent_id,req.body.parent_author,req.body.content,req.body.media,req.body.authorid,req.body.createdat,req.body.privacy],(err,results)=>{
                    // return results  
                    
                    console.log(results)
                        client.query('update users set posts =array_append(posts,$1) where id=$2;',[(results.rows[0]).id,req.body.authorid],(err,results)=>{
                           // res.send('done')
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
                        client.query('update users set posts =array_append(posts,$1) where id=$2;',[(results.rows[0]).id,req.body.authorid],(err,results)=>{
                           // res.send('done')
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
                client.query('update posts set commentss =array_append(comments,$1) where id=$2;',[(results.rows[0]).id,req.body.onpost],(err,result)=>{


                    client.query('UPDATE users SET comments =array_append(comments,$1) where id=$2;',[(results.rows[0]).id,req.body.authorid],(err,result)=>{
                        // res.send('done')
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




