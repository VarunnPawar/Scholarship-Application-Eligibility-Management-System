const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
    scholarship_id: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    scholarship_name: {
        type: String,
        required: [true, 'Scholarship name is required'],
        trim: true
    },
    min_cgpa: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    max_income: {
        type: Number,
        required: true,
        min: 0
    },
    eligible_category: {
        type: String,
        required: true,
        default: 'All'
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    funding_type: {
        type: String,
        required: true,
        enum: ['National', 'International', 'State Government', 'Private', 'Corporate']
    },
    institution_type: {
        type: String,
        required: true,
        enum: ['All Universities', 'Private Universities Only', 'Government Colleges Only']
    },
    deadline: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual aliases for frontend compatibility
scholarshipSchema.virtual('id').get(function () {
    return this.scholarship_id;
});

scholarshipSchema.virtual('name').get(function () {
    return this.scholarship_name;
});

scholarshipSchema.virtual('category').get(function () {
    return this.eligible_category;
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
