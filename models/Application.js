const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    application_id: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    student_id: {
        type: Number,
        required: true,
        ref: 'Student',
        index: true
    },
    scholarship_id: {
        type: Number,
        required: true,
        ref: 'Scholarship',
        index: true
    },
    application_date: {
        type: String,
        default: () => new Date().toISOString().split('T')[0]
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    remarks: {
        type: String,
        default: 'Application submitted'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Enforce unique application per student and scholarship
applicationSchem1a.index({ student_id: 1, scholarship_id: 1 }, { unique: true });

// Virtual aliases
applicationSchema.virtual('id').get(function () {
    return this.application_id;
});

applicationSchema.virtual('date').get(function () {
    return this.application_date;
});

module.exports = mongoose.model('Application', applicationSchema);
