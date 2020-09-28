/*bcrypt hashing uses two functions
   genSalt() which generated a random string that is appended to the hashed password and takes it's length as parameter
   hash() takes password and hashes  it and concatinates it with genalated salt 
*/
const bcrypt = require('bcrypt')
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(5)
    const hashed = await bcrypt.hash(password,salt)
    // console.log(salt)
    // console.log(hashed)
    return hashed
}
// hashPassword('1234')
module.exports = hashPassword