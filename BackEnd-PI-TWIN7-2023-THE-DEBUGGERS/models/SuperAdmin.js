const mongoose=require("mongoose");
const bcrypt=require("bcrypt")

const SuperAdminSchema=new mongoose.Schema({
    
    SuperAdminEmail: {
        type: String,
    },
    PasswordSuperAdmin:
    {
        type: String,
    },

   
});

SuperAdminSchema.statics.login=async function(SuperAdminEmail,PasswordSuperAdmin){          
    const superAdmin=await this.findOne({SuperAdminEmail})
    if (!superAdmin) {
        throw Error("incorrect superAdmin email");
    }
    const auth = await bcrypt.compare(PasswordSuperAdmin, superAdmin.PasswordSuperAdmin);

    if (auth) {
        return superAdmin;
    } else {
        throw Error("incorrect superAdmin password");
    }
}

const SuperAdmin=mongoose.model("SuperAdmin",SuperAdminSchema);
module.exports=SuperAdmin;