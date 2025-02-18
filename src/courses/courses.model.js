import { Schema, model } from 'mongoose';

const courseSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        maxLength: [25, 'Cant be overcome 50 characters.']
    },
    description: {
        type: String,
        required: [true, 'Description is required.'],
        maxLength: [100, 'Cant be overcome 100 characters.']
    },
    status: {
        type: Boolean,
        default: true
    }
});

export default model('Course', courseSchema);