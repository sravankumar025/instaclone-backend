const mongoose=require('mongoose');

const PostSchema=mongoose.Schema({
    username:{type:String,require:true},
    address:{type:String,require:true,defaul:'Hyderabad'},
    image_file:{type:String,require:true},
    description:{type:String,require:true},
    likes:Number,
    date:String
},{timestamps:true});

module.exports={IPost:mongoose.model("InstaPost",PostSchema)};