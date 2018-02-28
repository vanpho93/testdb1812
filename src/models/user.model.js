const mongoose = require('mongoose');
const { hash, compare } = require('bcrypt');

const { sign } = require('../lib/jwt');
const MyError = require('../lib/MyError');
const { CANNOT_FIND_USER, INVALID_PASSWORD, EMAIL_EXISTED, INVALID_SIGN_UP_INFO } = require('../lib/errorCode');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

const UserModel = mongoose.model('User', userSchema);

class User extends UserModel {
    static async signUp(email, password, name, phone) {
        if (typeof password !== 'string') throw new MyError('Password is required.', INVALID_PASSWORD, 400);
        const encrypted = await hash(password, 8);
        const user = new UserModel({ name, email, password: encrypted, phone });
        await user.save()
        .catch(error => {
            if (error.code === 11000) throw new MyError('Email existed.', EMAIL_EXISTED, 400);
            throw new MyError('Invalid sign up info.', INVALID_SIGN_UP_INFO, 400);
        });
        const userInfo = user.toObject();
        delete userInfo.password;
        return userInfo;
    }
    
    static async signIn(email, password) {
        const user = await User.findOne({ email });
        if (!user) throw new MyError('Cannot find user.', CANNOT_FIND_USER, 404);
        const same = await compare(password, user.password)
        .catch(() => { throw new MyError('Invalid password.', INVALID_PASSWORD, 400); });
        if (!same) throw new MyError('Invalid password.', INVALID_PASSWORD, 400);
        const userInfo = user.toObject();
        const token = await sign({ _id: user._id });
        userInfo.token = token;
        delete userInfo.password;
        return userInfo;
    }
}

module.exports = User;
