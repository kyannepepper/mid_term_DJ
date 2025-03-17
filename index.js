const express = require('express');
const cors = require("cors");
const multer = require('multer');
const model = require('./model');
const session = require('express-session');
const meal = model.meal
const user = model.User
const kit = model.kit

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false}));
app.use(cors());
app.use(multer().none());

// MIDDLEWARES

/// 

/// app.get("/meals", authorizeUser, function (req, res) {
//      let filter = {
//      user: req.user._id
// };
//      let sort = {};
//   if (req.query.minRating) {
//      filter.rating = { $gte: req.query.minRating };
//      }
// if (req.query.sortBy == 'rating') {
//  sortBy.rating = -1;
//  }
//     meal.find(filter.sort(sort).then((veggies) => {
 //   res.json(veggies);
//      });
//    });
//       
// });



function authorizeUser(req, res, next) {
    console.log("Current user session:", req.session);
    if (req.session && req.session.userId) {
        // user is authenticated
       // ???
    //    model.User.findOne({
    //     _id: req.sessoin.userId
    //     }).then(function (user) {
    //         req.user = user;
    //         next();
    //     });

    user.findById(req.session.userId).then(user => {
        if (!user) {
            return res.status(401).send("Unauthorized");
        }
        req.user = user;
        next();
    }).catch(err => {
        console.error("Authorization error:", err);
        res.status(500).send("Internal Server Error");
    });
        
    } else {
        // user is NOT authenticated
        res.sendStatus(401);
    }
}

function getRandomNumber() {
    const random = Math.random() * (30 - 10) + 10;
    return Number(random.toFixed(2));
}
app.use(session({
    secret: "alksdjfieqwurpadsjfalksdfjewoiqprualdskfjasdfk",
    saveUninitialized: true,
    resave: false,
}))
app.get('/whateveryouwant', function (req, res) {
    res.send("hello world");
});
app.get("/meals", authorizeUser, function (req, res) {
    meal.find({
        user: req.user._id
    }).then((meals) => {
        res.json(meals);
    })
});
app.post('/meals', authorizeUser, function (req, res) {    
    let randomNumber = getRandomNumber()
    console.log(randomNumber)
    console.log(req.body)
    let newMeal = new meal({
        course: req.body.course,
        dessert: req.body.dessert,
        salad: req.body.salad,
        price: randomNumber,
    });
    newMeal.save().then(() => {
        // the meal was saved to the DB
        res.status(201).send("Created");
    }).catch((error) => {
        if (error.errors) {
            let errorMessagse = {};
            for (let field in error.errors) {
                errorMessages[field] = error.errors[field].message;
            }
            res.status(422).json(errorMessagse);
        } else {
            console.error("FAILED TO CREATE", error)
            res.status(500).send("Failed to create");
        }
    });
    console.log(newMeal)
    // MEALS.push(newMeal);
    
});

app.delete('/meals/:mealID', function (req, res) {
    // does the veggie even exist???
    model.Meal.findOne({ _id: req.params.mealId }).then(function (meal) {
        if (meal) {
            model.Meal.deleteOne({
                _id: req.params.mealId
            }).then(function () {
                res.status(200).send("Deleted Successfully");
            })
        } else {
            res.status(404).send("Nothing was Deleted");
        }
    });
});

app.post('/users', function (req,res) {
    let newUser = new user({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        kits: req.body.kits,
    });

    newUser.setEncryptedPassword(req.body.plainPassword).then(function () {
        // eggs have been fulfilled
        newUser.save().then(() => {
            console.log(user);
            res.status(201).send("created");
        }).catch((error => {
            console.error("failed to save user", error);
        }));
    }).catch(function () {
        if (error.errors) {
            let errorMessagse = {};
            for (let field in error.errors) {
                errorMessages[field] = error.errors[field].message;
            }
            res.status(422).json(errorMessagse);
        } else if (error.code == 11000) {
            res.status(422).jsn({
                email: 'User with email already exists'
            });
        } else {
            console.error("FAILED TO CREATE", error)
            res.status(500).send("Failed to create");
        }
        // prmise could not be fulfilled
    });
});

app.get('/session', authorizeUser, function (req, res) {
    res.json(req.user);
})

//LOG IN
app.post('/session', function (req, res) {
    // 1. check if the user exists (by email)
    model.User.findOne({
        email: req.body.email
    }).then(async function (user) {
        if (user) {
            let verified = await user.verifyEncryptedPassword(req.body.plainPassword);
            if (verified) {
                req.session.userId = user._id;
                console.log("YOU DID IT!")
                res.status(201).send("Password was verified");
            } else {
                console.log("WRONG PASSWORD")
                res.status(404).send("The password was incorrect");
            }
        } else {
            console.log("COULDN'T FIND USER")
            res.status(404).send("Could not find user");
        }
    })
        // 2. if yes, verify hashed password in DB matches given pw
            // 3. if verified, record user into the session (Authenticated)
        // if not, return status 401 
});
//LOG OUT
app.delete('/session', authorizeUser, function (req, res) {
    delete req.session.userId;
    res.sendStatus(200);
});










// app.get("/kits", authorizeUser, function (req, res) {
//     kit.find({
//         user: req.user._id
//     }).then((kits) => {
//         res.json(kits);
//     })
// });
app.get("/kits", function (req, res) {
    kit.find({}).then((kits) => {
        res.json(kits);
    })
});
app.get("/user/kits", authorizeUser, function (req, res) {
    model.User.findOne({ _id: req.session.userId }).then(function (user) {
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        let usersKits = [];
        kit.find({}).then((kits) => {
            kits.forEach((kit) => {
                if (user.kits.includes(kit._id.toString())) {
                    usersKits.push(kit);
                }
            });
            console.log(usersKits);
            res.json(usersKits);
        }).catch((err) => {
            console.error("Error finding kits:", err);
            res.status(500).json({ error: "Internal Server Error" });
        });
    }).catch((err) => {
        console.error("Error finding user:", err);
        res.status(500).json({ error: "Internal Server Error" });
    });
});

app.post('/kits', authorizeUser, function (req, res) {    
    console.log(req.body)
    let newKit = new kit({
        name: req.body.name,
        difficulty_level: req.body.difficulty_level,
        price: req.body.price,
    });
    newKit.save().then(() => {
        // the kit was saved to the DB
        res.status(201).send("Created");
    }).catch((error) => {
        if (error.errors) {
            let errorMessagse = {};
            for (let field in error.errors) {
                errorMessages[field] = error.errors[field].message;
            }
            res.status(422).json(errorMessagse);
        } else {
            console.error("FAILED TO CREATE", error)
            res.status(500).send("Failed to create");
        }
    });
    console.log(newKit)
    // MEALS.push(newMeal);
    
});




app.put('/user/addKit', authorizeUser, function (req, res) {  
    model.User.findOne({ _id: req.session.userId }).then(function (user) {
        console.log("THESE ARE YOUR USERS KITS: " + user.kits);
        let kitExists = false;
        console.log("THIS IS THE KIT YOU WANT TO ADD: " + req.body.kitId);
        if (user.kits.includes(req.body.kitId)) {
            kitExists = true;
        }
        if (kitExists) {
            console.log("KIT ALREADY EXISTS");
            return res.status(400).send("Kit already in User");
        } else {
            model.User.updateOne(
                { _id: (req.session.userId) },
                { $push: { kits: req.body.kitId } }
        
                ).then(function () {
                console.log("THESE ARE NOW YOUR USERS KITS" + user.kits);
                res.status(200).send("Added Kit to User");
            });
        }
     

        
});
});










app.delete('/kits/:kitID', function (req, res) {
    // does the veggie even exist???
    model.Meal.findOne({ _id: req.params.kitId }).then(function (kit) {
        if (kit) {
            model.Meal.deleteOne({
                _id: req.params.mealId
            }).then(function () {
                res.status(200).send("Deleted Successfully");
            })
        } else {
            res.status(404).send("Nothing was Deleted");
        }
    });
});








app.listen(8080, function () {
    console.log('Server is running on port 8080');
})