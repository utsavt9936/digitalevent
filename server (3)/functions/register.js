//'use-strict';

const {validateUser} = require('../models/user');
const bcrypt = require('bcryptjs');
const {client} =require('../server')
require('express-async-errors');

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
    
    
       client.query('INSERT INTO users (name, email, password) values($1,$2,$3)',[name,email,hash],(err,results)=>{
           // return results  
          //  return ;
              })
    
        
        
    }
    



    
 })



