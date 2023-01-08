

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//  adding database
mongoose.set('strictQuery', false);
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
}


const article_schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,"no name given"]
      },
  
    content:{
      type: String
    }
  });
  
  const article_model=mongoose.model("Article",article_schema);
  const article1=new article_model({
    "title" : "REST",
    "content" : "REST is short for REpresentational State Transfer. IIt's an architectural style for designing APIs."
})

const article2=new article_model({
    "title" : "API",
    "content" : "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer."
})


const article3=new article_model({
    "title" : "Bootstrap",
    "content" : "This is a framework developed by Twitter that contains pre-made front-end templates for web design"
})


const article4=new article_model({
    "title" : "DOM",
    "content" : "The Document Object Model is like an API for interacting with our HTML"
})

// const arr=[article1,article2,article3,article4];

// article_model.insertMany(arr,function(err,docs){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("succcess");
//     }
// });

app.route("/articles")
.get((req, res) => {
    article_model.find(function(err,docs){
        if(err){
            console.log(err);
        }
        else{
            res.send(docs);
        }
    });
  })
  .post((req, res) => {
    const new_article=new article_model({
        "title" : req.body.title,
        "content" : req.body.content
    });
    new_article.save(function(err){
        if(err){
            res.send(err);
        }
        else{
            res.send("success post request");
        }
    });
  })
  .delete((req, res) => {
    article_model.deleteMany(function(err){
        if(err){
            res.send(err);
        }
        else{
            res.send("success delete request");
        }
    });
  })


app.route('/articles/:article_name')
  .get((req, res) => {
    article_model.findOne({title:req.params.article_name},function(err,docs){
        if(err){
            console.log(err);
        }
        else{
            res.send(docs);
        }
    });
  })
  .put((req, res) => {
    article_model.findOneAndUpdate(
        { title: req.params.article_name },
        { title: req.body.title, content: req.body.content },
        // this overwrite will even change the schema of the doc
        { overwrite: true },
        (err) => {
          if (!err) {
            res.send("Seccessfully updated article.");
          }
        }
      );
  })
  .patch((req, res) => {
    article_model.findOneAndUpdate(

        {title: req.params.article_name},
    // imp to use set as it updates only a single value
        {$set: req.body},
    
        function(err){
    
          if (!err){
    
            res.send("The patch was updated Successfully")
    
          }
    
        }
    
      )
  })

  .delete((req, res) => {
    article_model.deleteOne({title:req.params.article_name},function(err){
        if(err){
            console.log(err);
        }
        else{
            res.send("article deleted successfully");
        }
    });
  })
app.listen(3000, function() {
  console.log("Server started on port 3000");
});