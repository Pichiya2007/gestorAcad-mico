import { Schema, model } from 'mongoose';

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name in required.'],
        maxLengt: [25, 'Cant be overcome 25 characters.']
    },
    surname: {
        type: String,
        required: [true, 'Surname in required.'],
        maxLengt: [25, 'Cant be overcome 25 characters.']
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minLength: 8
    },
    role: {
        type: String,
        required: true,
        enum: ['TEACHER_ROLE', 'STUDENT_ROLE'],
        default: 'STUDENT_ROLE'
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course',
        default: []
    }],
    estado: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true, //Agrega el createAt y updateAt
        versionKey: false //No agrega el campo __v
    }
);

UserSchema.methods.toJSON = function(){
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model('User', UserSchema);