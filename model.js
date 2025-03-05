const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb+srv://se4200:owGA5TUxFXNvCppA@cluster0.xwhye.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    dbName: 'meals'
});

const meal = mongoose.model('Meal', { 
    course: String,
    dessert: String,
    salad: String,
    price: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const userSchema = new mongoose.Schema( {
    firstName: String,
    lastName: String,
    email: String,
    encryptedPassword: String,
    
});

userSchema.methods.setEncryptedPassword = function (plainPassword) {
    return new Promise((resolve, reject) => {
        // this is the promise function
        // resolve and reject are also functions  
        bcrypt.hash(plainPassword, 12).then((hash) => {
            console.log('hashed pw:', hash);
            // this is the user INSTANCE
            this.encryptedPassword = hash;
            resolve();
        }).catch(err => reject(err));
    });
    // this is THE moment this function returns
    // return the prmise for future eggs
};
userSchema.methods.verifyEncryptedPassword = function (plainPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, this.encryptedPassword).then(result => {
            resolve(result).catch(err => reject(err));;
        })
    });

}
const User = mongoose.model('User', userSchema);

module.exports = {
    meal, // shorthand for meal: meal
    User
};