const Patient=require('../models/Patient');
const EMAIL_SECRET = 'asdf1093KMnzxcvnkljvasdu09123nlasdasdf';

emailVaidationFunction= async (req, res) => {
    try {
      const { user: { id } } = jwt.verify(req.params.token, EMAIL_SECRET);
      await Patient.update({ confirmed: true }, { where: { id } });
    } catch (e) {
      res.send('error');
    }
  };

module.exports={emailVaidationFunction};