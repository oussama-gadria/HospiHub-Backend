const mongoose=require('mongoose');
const {isEmail}=require('validator')  //isEmail mawjouda deja f west validator
const bcrypt=require("bcrypt")

const userSchema=new mongoose.Schema({
    userName:String,
    firstName:String,
    lastName:String,
    dateOfBirth:Date,
    gender:String,
    address:String,
    phoneNumber:String,
    email:{
        type:String,
        required:[true,'Please enter an email'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true,'Please enter an password'],
        minlength:[6,'Minimum password length is 6 characters']
    },
    confirmPassword:String,
    code:String,
    phoneNotVerif:String,
    role:{
        type:String,
        requried:true,
        enum:['doctor','patient'],
        default:'patient'
    },
    confirmed:{
        type:Boolean,
        defaultValue:false,
    },
    token:{
        type:String,
        default:''
    },
    secret:{
        type:String,
        default:'' 
     },
     status: {
      type: String,
      enum: ['active', 'blocked', 'archived'],
      default: 'active',
    },
     image:{
    type:String
     }

},{
    discriminatorKey: 'userType' // set discriminator key to 'userType'
})

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
  
    if (!user) {
      throw Error("incorrect email");
    }
  
    if (!user.confirmed) {
      throw Error("email not confirmed!");
    }

    if(user.role==='doctor' && user.IsValidated==false){
      throw Error("Sorry doctor ur not validated yet!");
    }
    if(user.status==='blocked'){
      throw Error("Sorry your account is blocked");
    }
    if(user.status==='archived'){
      throw Error("Sorry your account is archived");
    }
  
    const auth = await bcrypt.compare(password, user.password);
  
    if (auth) {
      return user;
    } else {
      throw Error("incorrect password");
    }
  };

const User = mongoose.model('User', userSchema);
module.exports=User;