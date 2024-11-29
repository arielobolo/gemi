const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true , index: true  },
  email: { type: String, required: true, unique: true , index: true  },
  password: { type: String, required: true },
  profileImage: { type: String, default: '/images/default-avatar.jpg' },
  role: { type: String, default: 'user' }, // Rol predeterminado "user"
  
  // Nueva propiedad carpetapersonal
  carpetapersonal: { type: String, default: '' }, // Ruta o ID de la carpeta personal del usuario
  
  // Campos de notificación push del usuario
  pushSubscription: {
    endpoint: { type: String },
    keys: {
      p256dh: { type: String },
      auth: { type: String }
    }
  },

  // Campos para controlar intentos de login fallidos
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Date },

  resetPasswordToken: { type: String },
  verificationToken: { type: String },
  resetPasswordExpires: { type: Date },



    // Nuevos campos para manejar el estado de presencia
    estadoDePresente: { type: String, default: 'ingreso' }, // Estado por defecto "ingreso"
    idDePresente: { type: mongoose.Schema.Types.ObjectId } // ID del registro de presente

});

// Método para verificar si el usuario está bloqueado
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Método para incrementar los intentos de login fallidos
userSchema.methods.incLoginAttempts = function () {
  // Si el bloqueo ha expirado, reseteamos los intentos
  if (this.lockUntil && this.lockUntil < Date.now()) {
    this.loginAttempts = 1;
    this.lockUntil = undefined;
  } else {
    // De lo contrario, aumentamos los intentos
    this.loginAttempts += 1;
  }

 // Si los intentos alcanzan 5, bloqueamos por 5 minutos
 if (this.loginAttempts >= 5 && !this.isLocked()) {
  this.lockUntil = Date.now() + 5 * 60 * 1000; // Bloqueo por 5 minutos
}

return this.save();
};

// Método para restablecer intentos fallidos en caso de éxito
userSchema.methods.resetLoginAttempts = function () {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  return this.save();
};

// Encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
