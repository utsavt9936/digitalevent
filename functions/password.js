//'use strict';

const otpGenerator = require('otp-generator');
const config = require('../config/config.json');
const {User , validateUser} = require('../models/user');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const {client} = require('../server')
const pg=require('pg')

exports.resetPasswordInit = async (email) => {

    const currentUser = await User.findOne({email: email});

    if(!currentUser)
    {
        const response = {
            status: 404,
            message: 'User Not Found'
        };
        return response;
    }
    else
    {
        //currentUser.otp = otpGenerator.generate(6, {alphabets: false , upperCase: false , specialChars: false});
        console.log(currentUser);
        const result = await currentUser.save();
        
        const transporter = nodemailer.createTransport(`smtps://${config.email}:${config.password}@smtp.zoho.com`);
        const mailOptions = {

            from:`"${config.name}" <${config.email}>`,
            to: currentUser.email,
            subject: 'Reset Password Request',
            html: `Hello ${currentUser.name},<br/>
                    Your Reset password token is <b>${currentUser.otp}</b>.<br/>
                
                Thanks,<br/>
                Customer Support.`
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(info);
        const response = {
            status: 200,
            message: 'Check mail for instructions'
        };

        return response;
   
    }
}

exports.resetPasswordFinal = async(email , token , newPassword) => {

    let currentUser = await User.findOne({email: email});
    
    if(currentUser.otp === token) 
    {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        currentUser.password = hash;
        currentUser.otp = null;
        await currentUser.save();

        let response = {
            status: 200,
            message: 'Password Changed Successfully'
        }

        return response;
    }
    else
    {
        let response = {
            status: 401,
            message: 'Invalid Token'
        }

        return response;
    }
}



var config1 = {
    host: 'uvgrid-test.cak8aytcldkp.us-east-2.rds.amazonaws.com',
    port: 5432,
    user: 'postgres',
    password: 'hailhydra',
    database: "UVGridDB",
    max: 10, 
    idleTimeoutMillis: 30000 
  }
const pool= new pg.Pool(config1)





pool.connect((err,client,done)=>{



    exports.verifyUserInit = async (email,name,otp) => {

        //const currentUser = await User.findOne({email: email});
    
        
        
           
            


           
                    //console.log(results)   
                   //globalThis.otp=(results.rows[0]).otp
                //console.table(results.rows)

                   const transporter = nodemailer.createTransport(`smtps://${config.email}:${config.password}@smtp.zoho.com`);
                   const mailOptions = {
           
                       from:`"${config.name}" <${config.email}>`,
                       to: email,
                       subject: 'Welcome to UVgrid',
                       html: `Hello ${name},<br/>
                               Your email verificatio token is <b>${otp}</b>.<br/>
                           
                           Thanks,<br/>
                           Customer Support.`
                   };
                   
           
                   try {
                    const info = await transporter.sendMail(mailOptions);
                    
                    const response = {
                        otp:otp,
                        status: 200,
                        message: 'Check mail for instructions'
                    };
            
                   // return response;
           
                    console.log(info);
                       
                   } catch (error) {
                       console.log(error)

                       
                   }
                   



                    

                    /*  client.query('UPDATE users SET otp = $1 WHERE email=$2 ',[otp,email],(err,results)=>{
                        console.log(results)   
                       //globalThis.otp=(results.rows[0]).otp
                          })*/

                          return 1
            
            
       
        
    }




    exports.verifyUserFinal = async(email , token) => {

        console.log(email,token)

       let result= await client.query('select * from users where email=$1',[email])
        
        if((result.rows[0]).otp === token) 
        {
            
    
            
            //globalThis.otp = null;
            
    
            let response = {
                status: 200,
                message: 'User registered Successfully'
            }
    
            return response;
        }
        else
        {
            let response = {
                status: 401,
                message: 'Invalid Token'
            }
    
            return response;
        }
    }
    

       
        
    
    
    
        
})










