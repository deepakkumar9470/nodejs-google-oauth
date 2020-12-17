const mongoose = require("mongoose");


const StorySchema = mongoose.Schema({
    title:{
        type:String,
        reuired:true,
        trim: true
    },
    body:{
        type:String,
        reuired:true
    },
    status:{
        type:String,
        default : 'public',
        enum : ['public', 'private']
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    createdDate:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model("Story", StorySchema);

