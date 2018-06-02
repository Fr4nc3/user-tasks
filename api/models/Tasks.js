var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
    Name: String,
    Description: String,
    Author: String,
    Status: {
        type: String,
        enum: ['NEW','COMPLETED'],
        default: 'NEW'
    },
    DueDate: Date,
    CreatedDate: {
        type: Date,
        default: Date.now
    }
}, {
    usePushEach: true 
});
mongoose.model('Task', TaskSchema);
