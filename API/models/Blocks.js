const mongoose = require('mongoose');

const BlockSchema = new mongoose.Schema({
    pageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Page', required: true, },
    position: { x: { type: Number, required: true }, y: { type: Number, required: true }, width: { type: Number, required: true }, height: { type: Number, required: true }, zIndex: { type: Number, default: 1 }, },
    content: { type: mongoose.Schema.Types.Mixed, default: {}, },
    createdAt: { type: Date, default: Date.now, },
    updatedAt: { type: Date, default: Date.now, },
});

BlockSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Block', BlockSchema);
