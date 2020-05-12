const OpenTok=require('opentok')

var opentok=new OpenTok('46671022','d3ffd993e72d566ad37b5b7bf7aa4d98e6375ea0')
exports.generateSession=async(req,res)=>{

    console.log(opentok)
  globalThis.ss
    return opentok.createSession({mediaMode:"routed"}, function(err, session) {
        if (err) return console.log(err);
      
        // save the sessionId
        console.log(session.sessionId)
        
        res.send({
            sessionId:session.sessionId
        })
      });

      
     



}

exports.pubtoken=async(req,res)=>{

    const options={
        role :                   'publisher',
        expireTime :             (new Date().getTime() / 1000)+(7 * 24 * 60 * 60), // in one week
        data :                   'name=Utsav',
        initialLayoutClassList : ['bestFit']
      }

      let token=opentok.generateToken(req.query.sessionId,options)
      if(!token)
      console.log(token)

      res.send({
          publisherToken:token
      })
}

exports.subtoken=async(req,res)=>{

    const options={
        role :                   'subscriber',
        expireTime :             (new Date().getTime() / 1000)+(7 * 24 * 60 * 60), // in one week
        data :                   'name=Utsav Tiw',
        initialLayoutClassList : ['bestFit']
      }

      let token=opentok.generateToken(req.query.sessionId,options)
      if(!token)
      console.log(token)

      res.send({
          subscriberToken:token
      })
}





exports.startRecord=async(req,res)=>{

    opentok.startArchive(req.query.sessionId, { name: 'Important Presentation' }, function(err, archive) {
        if (err) {
          return console.log(err);
        } else {
          // The id property is useful to save off into a database
          console.log("new archive:" + archive.id);
          res.send({
            recordingId:archive.id
        })
        }
      });
      

    
}



exports.stopRecord=async(req,res)=>{

    opentok.stopArchive(req.query.recordingId, function(err, archive) {
        if (err) return console.log(err);
      
        console.log("Stopped archive:" + archive.id);
        res.send(archive)
      });
      

    
}

exports.getRecord=async(req,res)=>{

    opentok.getArchive(req.query.recordingId, function(err, archive) {
        if (err) return console.log(err);
      
        console.log(archive);

        res.send(archive)
      });
      

    
}

exports.startBroadcast=async(req,res)=>{
 // console.log(app)
  console.log('inside')
  var broadcastOptions = {
  
    outputs: {
      hls: {},
      rtmp: [{
        id: 'ut11',
        serverUrl: 'rtmp://23875417.fme.ustream.tv/ustreamVideo/23875417',
        streamName: 'jMEPvfvMH5D3NGAx3fkj4hexfw62Zpjb'
      }]
      
    },
    maxDuration: 5400,
    resolution: '640x480',
    layout: {
      type: 'bestFit'
    },
  };
  //console.log(opentok)
  console.log('inside',2)
  var sessionId=req.query.sessionId
  opentok.startBroadcast(sessionId,broadcastOptions, function(error, broadcast) {
  
    if (error) {
      res.send(error)
      return console.log(error);
    }
    res.send(broadcast)
    return console.log('Broadcast started: ', broadcast.id);
  });


  
}



