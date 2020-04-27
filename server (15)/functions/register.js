//'use-strict';

const {validateUser} = require('../models/user');
const bcrypt = require('bcryptjs');
const {client} =require('../server')
require('express-async-errors');

const otpGenerator = require('otp-generator');
const pg=require('pg')




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



pool.connect((err,client,done)=>{

    exports.registerUser = async (name , email , password) => {
    
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const currentUser=await client.query('select * from users where email=$1',[email])

        

        if((currentUser.rows).length!==0)
        {
            let rtn={resp:'already registered',
                    curr:currentUser.rows[0]
                    
                    }
            return rtn}

            let otp = otpGenerator.generate(6, {alphabets: false , upperCase: false , specialChars: false});
    
       client.query('INSERT INTO users (name, email, password,otp) values($1,$2,$3,$4)',[name,email,hash,otp],(err,results)=>{
           // return results  

          //  return ;
              })

              return otp
    
        
        
    }
    



    
 })



