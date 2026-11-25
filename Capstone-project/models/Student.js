const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    student_id: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Student email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    course: {
        type: String,
        required: true,
        trim: true
    },
    year_of_study: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    family_income: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['General', 'OBC', 'SC', 'EWS']
    },
    cgpa: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual aliases for frontend compatibility
studentSchema.virtual('id').get(function () {
    return this.student_id;
});

studentSchema.virtual('year').get(function () {
    return this.year_of_study;
});

studentSchema.virtual('income').get(function () {
    return this.family_income;
});

module.exports = mongoose.model('Student', studentSchema);
