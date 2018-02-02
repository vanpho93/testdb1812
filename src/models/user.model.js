const mongoose = require('mongoose');
const { hash, compare } = require('bcrypt');
const { sign } = require('../lib/jwt');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    name: { type: String, required: true },
    phone: { type: String, required: true }
});

const UserModel = mongoose.model('User', userSchema);

class User extends UserModel {
    static async signUp(email, password, name, phone) {
        const encrypted = await hash(password, 8);
        const user = new UserModel({ name, email, password: encrypted, phone });
        await user.save();
        const userInfo = user.toObject();
        delete userInfo.password;
        return userInfo;
    }
    static async signIn(email, password) {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Cannot find user.');
        const same = await compare(password, user.password)
        .catch(() => { throw new Error('Invalid password.'); });
        if (!same) throw new Error('Invalid password.');
        const userInfo = user.toObject();
        const token = await sign({ _id: user._id });
        userInfo.token = token;
        delete userInfo.password;
        return userInfo;
    }
}

module.exports = User;
