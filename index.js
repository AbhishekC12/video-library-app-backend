import express from "express";
import cors from "cors";

var conString = "mongodb+srv://abhishekchungade12:8208322540@cluster0.osuuxaw.mongodb.net/projectdb";

import { MongoClient } from "mongodb";

const mongoClient = new MongoClient("mongodb+srv://abhishekchungade12:8208322540@cluster0.osuuxaw.mongodb.net/projectdb");

try {
  await mongoClient.connect();
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
} finally {
  await mongoClient.close();
}


var app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get("/users", (req, res)=>{
    mongoClient.connect(conString).then((clientObj)=>{
        var database = clientObj.db("projectdb");
        database.collection("tblusers").find({}).toArray().then((docs)=>{
            res.send(docs);
            res.end();
        })
    })
});

app.get("/admin", (req, res)=>{
    mongoClient.connect(conString).then((clientObj)=>{
        var database = clientObj.db("projectdb");
        database.collection("tbladmin").find({}).toArray().then((docs)=>{
            res.send(docs);
            res.end();
        })
    })
});

app.get("/videos", (req, res)=>{
    mongoClient.connect(conString).then((clientObj)=>{
        var database = clientObj.db("projectdb");
        database.collection("tblvideos").find({}).toArray().then((docs)=>{
            res.send(docs);
            res.end();
        })
    })
});

app.get("/video/:id", (req, res)=>{
    var id = parseInt(req.params.id);
    mongoClient.connect(conString).then((clientObj)=>{
        var database = clientObj.db("projectdb");
        database.collection("tblvideos").find({VideoId:id}).toArray().then((docs)=>{
            res.send(docs);
            res.end();
        })
    })
});


app.post("/adduser", (req, res)=>{
     var user = {
        UserId: req.body.UserId,
        UserName: req.body.UserName,
        Password: req.body.Password,
        Email: req.body.Email,
        Mobile: req.body.Mobile
     };
     mongoClient.connect(conString).then((clientObj)=>{
        var database = clientObj.db("projectdb");
        database.collection("tblusers").insertOne(user).then(()=>{
            console.log("User Added Successfully.");
            res.redirect("/users");
            res.end();
        })
     })
});

app.post("/addvideo", (req, res)=>{
    var video = {
       VideoId: parseInt(req.body.VideoId),
       Title: req.body.Title,
       Url: req.body.Url,
       Likes: parseInt(req.body.Likes),
       Dislikes: parseInt(req.body.Dislikes),
       Comments: req.body.Comments
    };
    mongoClient.connect(conString).then((clientObj)=>{
       var database = clientObj.db("projectdb");
       database.collection("tblvideos").insertOne(video).then(()=>{
           console.log("Videos Added Successfully.");
           res.redirect("/videos");
           res.end();
       })
    })
});

app.put("/updatevideo/:id", (req, res)=>{
    var id = parseInt(req.params.id);

    mongoClient.connect(conString).then((clientObj)=>{
         var database = clientObj.db("projectdb");
         database.collection("tblvideos").updateOne({VideoId:id},{$set:{ VideoId: parseInt(req.body.VideoId),
            Title: req.body.Title,
            Url: req.body.Url,
            Likes: parseInt(req.body.Likes),
            Dislikes: parseInt(req.body.Dislikes),
            Comments: req.body.Comments}}).then(()=>{
                console.log("Video Updated");
                res.end();
            })
    })
});

app.delete("/deletevideo/:id", (req, res)=>{
    var id = parseInt(req.params.id);
    mongoClient.connect(conString).then((clientObj)=>{
         var database = clientObj.db("projectdb");
         database.collection("tblvideos").deleteOne({VideoId:id}).then(()=>{
             console.log("Video Deleted");
             res.end();
         })
    })
})

var port = process.env.PORT || 3300;
app.listen(port, () => {
    console.log(`Server Started : http://127.0.0.1:${port}`);
});





