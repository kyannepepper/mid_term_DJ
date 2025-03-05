const express = require('express');
const cors = require("cors");
const multer = require('multer');
const model = require('./model');
const session = require('express-session');
const meal = model.meal
const user = model.User

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false}));
app.use(cors());
app.use(multer().none());

// MIDDLEWARES

function authorizeUser(req, res, next) {
    console.log("Current user session:", req.session);
    if (req.session && req.session.userId) {
        // user is authenticated
       // ???
       model.User.findOne({
        _id: req.sessoin.userId
        }).then(function (user) {
            req.user = user;
            next();
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


app.listen(8080, function () {
    console.log('Server is running on port 8080');
})