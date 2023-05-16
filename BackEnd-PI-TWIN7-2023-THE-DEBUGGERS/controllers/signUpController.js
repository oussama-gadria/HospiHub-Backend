const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const HospitalService = require('../models/HospitalService');
const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/User');
const emailValidator = require('email-validator');
require('dotenv').config();
const nodemailer = require('nodemailer');
const _ = require('lodash');
const MedicalRecord = require('../models/MedicalRecord');
const speakeasy = require('speakeasy');


//let the pc access less secured websites
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Define a secret key for JWT
const secretKey = 'mysecretkey';
const EMAIL_SECRET = 'mysecretemail';

//creating transporter (the sender of the email verification)
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

// signup
const signUpFunction = async (req, res) => {
    let { userName, firstName, lastName, gender, address, phoneNumber, email, password, dateOfBirth, role, confirmPassword, code, phoneNotVerif, enableTwoFactorAuth } = req.body;
    userName = userName.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();
    gender = gender.trim();
    address = address.trim();

    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();
    role = role.trim();
    confirmPassword = confirmPassword.trim();




    if (userName == '' || firstName == '' || lastName == '' || gender == '' || address == '' || email == '' || password == '' || dateOfBirth == '' || role == '' || confirmPassword == '') {
        res.json({
            status: 'FAILED',
            message: 'Empty input fields!',
        });
    } else if (password.length < 8) {
        res.json({
            status: 'FAILED',
            message: 'Invalid password entered!',
        });
    } else if (!emailValidator.validate(email)) {
        res.json({
            status: 'FAILED',
            message: 'Invalid email entered!',
        })
    } else if (confirmPassword != password) {
        res.json({
            status: 'FAILED',
            message: 'Wrong password confirmation!'
        })
    }
    else {
        let secret1 = '';
        if (enableTwoFactorAuth) {
            secret1 = speakeasy.generateSecret({ length: 20 }).base32;
        };
        //test sur le role
        if (role == 'patient') {
            // checking if the user exists
            console.log('Before User.find()');
            await User.find({ email })
                .then((result) => {
                    console.log('After User.find()');
                    if (result.length) {
                        res.json({
                            status: 'FAILED',
                            message: 'User already exists!',
                        });
                    } else {
                        // save User

                        // password handling
                        const saltRounds = 10;
                        bcrypt
                            .hash(password, saltRounds)
                            .then((hashedPasswords) => {
                                var newPatient = new Patient({
                                    userName,
                                    firstName,
                                    lastName,
                                    gender,
                                    address,
                                    phoneNumber,
                                    email,
                                    password: hashedPasswords,
                                    dateOfBirth: new Date(dateOfBirth),
                                    confirmed: false,
                                    role: 'patient',
                                    code,
                                    phoneNotVerif,
                                    secret: secret1,
                                });

                                //sending email verification with jwt before saving user
                                //   jwt.sign(
                                //     {
                                //       user: _.pick(newPatient, 'id'),
                                //     },
                                //     EMAIL_SECRET,
                                //     {
                                //       expiresIn: '1d',
                                //     },
                                //     (err, emailToken) => {
                                //       const url = `http://localhost:5000/confirmation/${emailToken}`;

                                //       transporter.sendMail({
                                //         to: newPatient.email,
                                //         subject: 'Confirm Email',
                                //         html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
                                //       });
                                //     },
                                //   );



                                // Generate email verification token
                                try {
                                    var emailToken = jwt.sign(
                                        {
                                            user: _.pick(newPatient, 'id', 'role'),
                                        },
                                        EMAIL_SECRET,
                                        {
                                            expiresIn: '15m',
                                        }
                                    );
                                } catch (error) {
                                    res.json(error.message);
                                }

                                // Construct email verification URL
                                const url = `http://localhost:5000/signup/${emailToken}`;

                                // Send email verification link to patient
                                transporter.sendMail({
                                    to: email,
                                    subject: 'Confirm Email',
                                    html: `<!DOCTYPE html>
                                    <html>
                                    
                                    <head>
                                        <title></title>
                                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                                        <meta name="viewport" content="width=device-width, initial-scale=1">
                                        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                                        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
                                        <link rel="stylesheet" href="<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
                                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js">
                                        <style type="text/css">
                                            @media screen {
                                                @font-face {
                                                    font-family: 'Lato';
                                                    font-style: normal;
                                                    font-weight: 400;
                                                    src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                                                }
                                    
                                                @font-face {
                                                    font-family: 'Lato';
                                                    font-style: normal;
                                                    font-weight: 700;
                                                    src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                                                }
                                    
                                                @font-face {
                                                    font-family: 'Lato';
                                                    font-style: italic;
                                                    font-weight: 400;
                                                    src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                                                }
                                    
                                                @font-face {
                                                    font-family: 'Lato';
                                                    font-style: italic;
                                                    font-weight: 700;
                                                    src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                                                }
                                            }
                                    
                                            /* CLIENT-SPECIFIC STYLES */
                                            body,
                                            table,
                                            td,
                                            a {
                                                -webkit-text-size-adjust: 100%;
                                                -ms-text-size-adjust: 100%;
                                            }
                                    
                                            table,
                                            td {
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                            }
                                    
                                            img {
                                                -ms-interpolation-mode: bicubic;
                                            }
                                    
                                            /* RESET STYLES */
                                            img {
                                                border: 0;
                                                height: auto;
                                                line-height: 100%;
                                                outline: none;
                                                text-decoration: none;
                                            }
                                    
                                            table {
                                                border-collapse: collapse !important;
                                            }
                                    
                                            body {
                                                height: 100% !important;
                                                margin: 0 !important;
                                                padding: 0 !important;
                                                width: 100% !important;
                                            }
                                    
                                            /* iOS BLUE LINKS */
                                            a[x-apple-data-detectors] {
                                                color: inherit !important;
                                                text-decoration: none !important;
                                                font-size: inherit !important;
                                                font-family: inherit !important;
                                                font-weight: inherit !important;
                                                line-height: inherit !important;
                                            }
                                    
                                            /* MOBILE STYLES */
                                            @media screen and (max-width:600px) {
                                                h1 {
                                                    font-size: 32px !important;
                                                    line-height: 32px !important;
                                                }
                                            }
                                    
                                            /* ANDROID CENTER FIX */
                                            div[style*="margin: 16px 0;"] {
                                                margin: 0 !important;
                                            }
                                        </style>
                                    </head>
                                    
                                    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                                        <!-- HIDDEN PREHEADER TEXT -->
                                        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account.
                                        </div>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <!-- LOGO -->
                                            <tr>
                                                <td bgcolor="#B0E0E6" align="center">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                                        <tr>
                                                            <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#B0E0E6" align="center" style="padding: 0px 10px 0px 10px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                                        <tr>
                                                            <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                                <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;" />
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                                        <tr>
                                                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                                <p style="margin: 0;">We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td bgcolor="#ffffff" align="left">
                                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                    <tr>
                                                                        <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                                            <table border="0" cellspacing="0" cellpadding="0">
                                                                                <tr>
                                                                                    <td align="center" style="border-radius: 3px;" bgcolor="#B0E0E6"><a href="${url}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #B0E0E6; display: inline-block;">Confirm Account</a></td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr> <!-- COPY -->
                                                        <tr>
                                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                                <p style="margin: 0;">If that doesn't work, click on this link:</p>
                                                            </td>
                                                        </tr> <!-- COPY -->
                                                        <tr>
                                                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                                <p style="margin: 0;"><a href="${url}" target="_blank" style="color: #3944BC;">Click here.</a></p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                                <p style="margin: 0;">If you have any questions, just reply to this email&mdash;we're always happy to help out.</p>
                                                            </td>
                                                        </tr>
                                                    
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                                        <tr>
                                                            <td bgcolor="#FFECD1" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                                <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2>
                                                                <p style="margin: 0;"><a href="http://localhost:3000/Contact" target="_blank" style="color: #3944BC;">We&rsquo;re here to help you out</a></p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </body>
                                    
                                    </html>`,
                                });

                                newPatient
                                    .save()
                                    .then((result) => {
                                        res.json({
                                            status: 'SUCCESS',
                                            message: 'SignUp successful',
                                            data: result,
                                            emailToken,
                                        });
                                    })
                                    .catch((err) => {
                                        res.json({
                                            status: 'FAILED',
                                            message: 'An error occurred while saving user account' + err.message,
                                        });
                                    });

                            })
                            .catch((err) => {
                                res.json({
                                    status: 'FAILED',
                                    message: 'An error occurred while hashing password!',
                                });
                            });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.json({
                        status: 'failed',
                        message: 'An error occurred while checking for existing user!',
                    });
                });



        }
        else if (role == 'doctor') {
            // const {idServ}=req.params;
            // if(!idServ){
            //     return(res.json({
            //         status: 'FAILED',
            //         message: 'You forgot to insert the service id! ',
            //     }));
            // };
            // const service= await HospitalService.findById(idServ);
            // // if(!service){
            // //     res.json({
            // //         status: 'FAILED',
            // //         message: 'invalid service id! ',
            // //     });
            // // }
            await User.find({ email })
                .then((result) => {
                    console.log('After User.find()');
                    if (result.length) {
                        res.json({
                            status: 'FAILED',
                            message: 'User already exists!',
                        });
                    } else {
                        // save User
                        // password handling
                        const saltRounds = 10;
                        bcrypt
                            .hash(password, saltRounds)
                            .then((hashedPasswords) => {
                                const newDoctor = new Doctor({
                                    userName,
                                    firstName,
                                    lastName,
                                    gender,
                                    address,
                                    phoneNumber,
                                    email,
                                    password: hashedPasswords,
                                    dateOfBirth,
                                    confirmed: false,
                                    IsValidated: false,
                                    role: 'doctor',
                                    // Service:service._id,
                                    code,
                                    phoneNotVerif,
                                    secret: secret1,
                                });

                                //email verification
                                // Generate email verification token
                                try {
                                    var emailToken = jwt.sign(
                                        {
                                            user: _.pick(newDoctor, 'id', 'role'),
                                        },
                                        EMAIL_SECRET,
                                        {
                                            expiresIn: '15m',
                                        }
                                    );
                                } catch (error) {
                                    res.json(error.message);
                                }

                                // Construct email verification URL
                                const url = `http://localhost:5000/signup/${emailToken}`;

                                // Send email verification link to patient
                                transporter.sendMail({
                                    to: email,
                                    subject: 'Confirm Email',
                                    html: `<!DOCTYPE html>
                                    <html>
                                    
                                    <head>
                                        <title></title>
                                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                                        <meta name="viewport" content="width=device-width, initial-scale=1">
                                        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                                        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
                                        <link rel="stylesheet" href="<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
                                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js">
                                        <style type="text/css">
                                            @media screen {
                                                @font-face {
                                                    font-family: 'Lato';
                                                    font-style: normal;
                                                    font-weight: 400;
                                                    src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                                                }
                                    
                                                @font-face {
                                                    font-family: 'Lato';
                                                    font-style: normal;
                                                    font-weight: 700;
                                                    src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                                                }
                                    
                                                @font-face {
                                                    font-family: 'Lato';
                                                    font-style: italic;
                                                    font-weight: 400;
                                                    src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                                                }
                                    
                                                @font-face {
                                                    font-family: 'Lato';
                                                    font-style: italic;
                                                    font-weight: 700;
                                                    src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                                                }
                                            }
                                    
                                            /* CLIENT-SPECIFIC STYLES */
                                            body,
                                            table,
                                            td,
                                            a {
                                                -webkit-text-size-adjust: 100%;
                                                -ms-text-size-adjust: 100%;
                                            }
                                    
                                            table,
                                            td {
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                            }
                                    
                                            img {
                                                -ms-interpolation-mode: bicubic;
                                            }
                                    
                                            /* RESET STYLES */
                                            img {
                                                border: 0;
                                                height: auto;
                                                line-height: 100%;
                                                outline: none;
                                                text-decoration: none;
                                            }
                                    
                                            table {
                                                border-collapse: collapse !important;
                                            }
                                    
                                            body {
                                                height: 100% !important;
                                                margin: 0 !important;
                                                padding: 0 !important;
                                                width: 100% !important;
                                            }
                                    
                                            /* iOS BLUE LINKS */
                                            a[x-apple-data-detectors] {
                                                color: inherit !important;
                                                text-decoration: none !important;
                                                font-size: inherit !important;
                                                font-family: inherit !important;
                                                font-weight: inherit !important;
                                                line-height: inherit !important;
                                            }
                                    
                                            /* MOBILE STYLES */
                                            @media screen and (max-width:600px) {
                                                h1 {
                                                    font-size: 32px !important;
                                                    line-height: 32px !important;
                                                }
                                            }
                                    
                                            /* ANDROID CENTER FIX */
                                            div[style*="margin: 16px 0;"] {
                                                margin: 0 !important;
                                            }
                                        </style>
                                    </head>
                                    
                                    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                                        <!-- HIDDEN PREHEADER TEXT -->
                                        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account.
                                        </div>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <!-- LOGO -->
                                            <tr>
                                                <td bgcolor="#B0E0E6" align="center">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                                        <tr>
                                                            <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#B0E0E6" align="center" style="padding: 0px 10px 0px 10px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                                        <tr>
                                                            <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                                <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;" />
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                                        <tr>
                                                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                                <p style="margin: 0;">We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td bgcolor="#ffffff" align="left">
                                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                    <tr>
                                                                        <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                                            <table border="0" cellspacing="0" cellpadding="0">
                                                                                <tr>
                                                                                    <td align="center" style="border-radius: 3px;" bgcolor="#B0E0E6"><a href="${url}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #B0E0E6; display: inline-block;">Confirm Account</a></td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr> <!-- COPY -->
                                                        <tr>
                                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                                <p style="margin: 0;">If that doesn't work, click on this link:</p>
                                                            </td>
                                                        </tr> <!-- COPY -->
                                                        <tr>
                                                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                                <p style="margin: 0;"><a href="${url}" target="_blank" style="color: #3944BC;">Click here.</a></p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                                <p style="margin: 0;">If you have any questions, just reply to this email&mdash;we're always happy to help out.</p>
                                                            </td>
                                                        </tr>
                                                    
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                                        <tr>
                                                            <td bgcolor="#FFECD1" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                                <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2>
                                                                <p style="margin: 0;"><a href="http://localhost:3000/Contact" target="_blank" style="color: #3944BC;">We&rsquo;re here to help you out</a></p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </body>
                                    
                                    </html>`,
                                });

                                newDoctor
                                    .save()
                                    .then((result) => {
                                        res.json({
                                            status: 'SUCCESS',
                                            message: 'SignUp successful',
                                            data: result,
                                            emailToken,

                                        });
                                    })
                                    .catch((err) => {
                                        res.json({
                                            status: 'FAILED',
                                            message: 'An error occurred while saving user account' + err.message,
                                        });
                                    });
                            })
                            .catch((err) => {
                                res.json({
                                    status: 'FAILED',
                                    message: 'An error occurred while hashing password!',
                                });
                            });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.json({
                        status: 'failed',
                        message: 'An error occurred while checking for existing user!',
                    });
                });
        }
    }
};
module.exports = { signUpFunction };