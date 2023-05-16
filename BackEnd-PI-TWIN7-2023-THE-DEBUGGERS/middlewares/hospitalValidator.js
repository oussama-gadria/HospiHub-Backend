const yup=require("yup")
//const {findHospitalByEmail} =require("../controllers/HospitalController")
const HospitalModel=require("../models/Hospital")


async function validateHospital(req,res,next)
{
  try {
      const hospitalschema = yup.object().shape({
        AdminEmail: yup
          .string()
          .email('you must use email format' )
          .matches(/^Admin\.[a-zA-Z0-9]+@gmail\.com$/, 'Email address invalid you must have this format Admin+hospitalname+number+@gmail.com')
          .test('unique','email already exist!', async function(value) {
            if (!value) return true;
            try {
              const existingHospital= await HospitalModel.findOne({AdminEmail:value});
              return !existingHospital;
            } 
            catch (err) {
              return false;
            }
          })
          .required('email is required'),
      
        HospitalName:yup.string().required('hospital name is required'),
        HospitalAddress:yup.string().required(' Hospital Address  is required'),
        PhoneNumber:yup.number().min(8, 'The phone number must contain at least 8 characters').required(' phone number  is required'),
      
        PasswordAdmin:yup
          .string()
          .min(8, 'The password must contain at least 8 characters')
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])(?=.{8,})/,
            'The password must contain at least one lowercase, one uppercase, one number and one special character'
          )
          .required('password is required ')
      });

    
        await hospitalschema.validate(req.body, { abortEarly: false });
        next();
      }

      
      catch (error) {
        res.status(500).json({ message: error.message, errors: error.errors });
        console.log(error.message)
      }
      // ou bien je peux utiliser cette forme 
      //catch (error) {
      //   const errors = error.errors.map((err) => {
      //     return { message: err };
      //   });
      //   res.status(500).json(errors);
      // }
      //ou bien je peux utiliser cette forme 
      // catch (error) {
      //   const errors = {};
      //   if (error.inner) {
      //     for (let err of error.inner) {
      //       errors[err.path] = err.errors[0];
      //     }
      //   }
      //   res.status(400).json({ errors });
      // }
}

async function validateHospitalwhenUpdate(req,res,next)
{
  try {
      const hospitalschema = yup.object().shape({
        AdminEmail: yup
          .string()
          .email('you must use email format' )
          .matches(/^Admin\.[a-zA-Z0-9]+@gmail\.com$/, 'Email address invalid you must have this format Admin+hospitalname(number)+@gmail.com')
          .test('unique', 'Email address already exists', async function (value) {
            if (!value) return true;
            const existingHospital = await HospitalModel.findOne({ AdminEmail: value });
            if (existingHospital) {
              // Check if email was changed
              if (this.parent.AdminEmail === existingHospital.AdminEmail) {
                return true;
              }
              // If updating an existing record, allow the existing record's email address
              if (this.parent.isUpdate && existingHospital._id.equals(this.parent.id)) {
                return true;
              }
              return false;
            }
            return true;
          })
          .required('email is required'),
      
        HospitalName:yup.string().required('hospital name is required'),
        HospitalAddress:yup.string().required(' Hospital Address  is required'),
        PhoneNumber:yup.number().min(8, 'The phone number must contain at least 8 characters').required(' phone number  is required'),
      
      });

    
        await hospitalschema.validate(req.body, { abortEarly: false });
        next();
      }

      
      catch (error) {
        res.status(500).json({ message: error.message, errors: error.errors });
      }
  
}




module.exports={validateHospital,validateHospitalwhenUpdate}