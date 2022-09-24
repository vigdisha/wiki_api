const express = require("express");
const { response } = require("express");
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

//mongodb connection
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true})
const articleSchema = {
    title:String,
    content:String

}
const Article = mongoose.model("Article", articleSchema);
///////////////Requests targeting all Articles/////////////////////

//chained route handlers
 app.route("/articles")
 .get(function(req, res){
    //query the database
    Article.find(function(err, foundArticles){
        if(!err){
res.send(foundArticles);
    }else{
        res.send(err);
    }
    });
})
.post(function(req, res){
    const viewArticle = new Article({
      title:req.query.title,
      content:req.query.content
    })
  
    viewArticle.save(function(err){
      if(!err){
  res.send("successfully added");
      }else{
         res.send(err);
      }
    });
  })
  .delete(function(err){
    Article.deleteMany(function(err){
        if(!err){
            res.send("successfully added");
                }else{
                   res.send(err);
                }
    });
  });
///////////////Requests a single all Articles/////////////////////
app.route("/articles/:articleTitle")
.get(function(req, res){
    
Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
        res.send(foundArticle);
    }else{
        res.send("no article matching the title was found");
    }
})
})
.put(function(req, res){
Article.replaceOne(
    {title:req.params.articleTitle},
    {
       title:req.query.title,
       content:req.query.content
    }, function(err){
        if(!err){res.send("successfully updated")}else{
            res.send(err);
        }
    })
})
.patch(function(req, res){
Article.updateOne(
{title:req.params.articleTitle},
{$set:req.query},
function(err){
    if(!err){
        res.send("the article update successfully")
    }else{
        res.send(err)
    }
});
})
.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.title},
        function(err){
            if(!err){
            res.send("successfully deleted");
        }else{
            res.send(err);
        }
        });
});

app.listen(3000, function(){
    console.log("server started on localhost 3000")
});
