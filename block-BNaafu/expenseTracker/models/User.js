var mongoose = require(`mongoose`);
var Schema = mongoose.Schema;
var bcrypt = require(`bcrypt`);

var userSchema = new Schema(
  {
    name: { type: String },
    username: { type: String },
    email: { type: String, unique: true },
    password: { type: String, minlength: 5 },
    age: Number,
    phone: Number,
    country: String,
    profilePic: String,
    //isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre(`save`, function (next) {
  if (this.password && this.isModified(`password`)) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) return next(err);
      this.password = hashed;
      return next();
    });
  } else {
    return next();
  }
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};

var User = mongoose.model(`User`, userSchema);

module.exports = User;
