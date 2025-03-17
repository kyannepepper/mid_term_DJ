
Vue.createApp(  {
    
    data: function (){
        return {
            //all your data
            name: 'green',
            color: "green",
            meals: [],
            kits: [],
            usersKits: [],
            newCourse: '',
            newDessert: '',
            newSalad: '',
            newPrice: 0,
            total: 0,
            currentPage: 'signIn',
            view: 'kits',
            signIn: true,
            new_first_name: '',
            new_last_name: '',
            new_email: '',
            new_password: '',
            errors: {},
            email: '',
            password: '',
            loggedIn: false,
            usersName: 'HI',
            new_kit_name: '',
            new_kit_difficulty: 0,
            new_kit_price: 0,
        }
    },

    methods: {
        signYouIn: function () {
            fetch("http://localhost:8080/session").then((response) => {
                if (response.status == 200) {
                    this.currentPage = 'kits';
                    console.log("kits");
                    this.loadKitsFromAPI();
                    this.loggedIn = true;
                } else {
                    this.currentPage = 'home';
                    console.log("signIn");
                    this.loggedIn = false;
                }
                response.json().then((user) => {
                    this.usersName = user.firstName + " " + user.lastName;
                    console.log( "THIS IS THE USER " + this.usersName);
                });
            });
        },
        signYouOut: function () {
            fetch("http://localhost:8080/session", { 
                
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                
                }).then( (response) => {
                    if (response.status == 200) {
                        this.currentPage = 'signIn';
                        console.log("home");
                        this.loggedIn = false;
                    }         
            })
        },
        redirectToHome: function () {
            this.currentPage = 'home';
            console.log("home");
        },
        redirectToKits: function () {
            this.currentPage = 'kits';
            console.log("kits");
            console.log(usersName);
        },
        redirectToClasses: function () {
            this.currentPage = 'classes';
            console.log("classes");
        },
        redirectToSignin: function () {
            this.currentPage = 'signIn';
            console.log("signIn");
        },
        login: function () {
            this.signIn = true;
            this.signYouIn();
        },
        signup: function () {
            this.signIn = false;
        },
        loadMealsFromAPI: function () {
            console.log("loading meals");
            fetch("http://localhost:8080/meals").then((response) => {
                response.json().then((meals) => {
                    this.meals = meals;
                    console.log(meals);
                });
            })
        },
        loadKitsFromAPI: function () {
            console.log("loading kits");
            fetch("http://localhost:8080/kits").then((response) => {
                response.json().then((kits) => {
                    this.kits = kits;
                    this.view = 'kits'
                    console.log(kits);
                });
            })
        },
        loadYourKitsFromAPI: function () {
            console.log("loading kits");
            fetch("http://localhost:8080/user/kits").then((response) => {
                response.json().then((kits) => {
                    this.usersKits = kits;
                    console.log("KITS", kits);
                    this.view = 'usersKit'
                    console.log(this.view);
                });
            })
        },
        loadFilteredMealsFromAPI: function (minRating) {
            let query = '';
            if (minRating) {
                query = '?minRating=${endcodeURIComponent(minRating)}';
            }
            fetch("http://localhost:8080/meals${query}").then((response) => {
                response.json().then((meals) => {
                    this.meals = meals;
                });
            })
        },
        pizza: function () {
            console.log(this)
        },
        addToCart: function (kit) {
            console.log("YOU WANT TO ADD: " + kit._id);;
            fetch("http://localhost:8080/user/addKit", { 
                
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ kitId: kit._id })
                
                }).then( (response) => {
                    if (response.status == 201) {
                        console.log("YOU JUST ADDED THIS KIT: " + kit._id);
                        this.loadKitsFromAPI();
                    }
                    
                    
                    
            })
        },
        redirectToAddKit: function () {
            this.view = 'addKit';
        },
        addKit: function () {
            const newKit = {
                name: this.new_kit_name,
                difficulty_level: this.new_kit_difficulty,
                price: this.new_kit_price,
            };
            console.log(newKit);
            fetch("http://localhost:8080/kits", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newKit)
            }).then((response) => {
                if (response.status == 201) {
                    console.log("Kit added successfully");
                } else {
                    console.error("Failed to add kit:", response.status);
                }
            })
        },
        validateVeggie: function () {
            if (this.newVegiesName.length == 0) {
                this.errors.name = 'Please enter a veggie name';
            }
            if (this.newVegiesColor.length == 0) {
                return false;
            }
            if (this.newVegiesSize.length == 0) {
                return false;
            }
        },
        addMeal: function () {
            // if (!this.validateVeggie()) {
            //     console.error("Veggie validation not authorized")
            // }
            console.log("hi")
            console.log("Added", this.newCourse, this.newDessert, this.newSalad, this.newPrice)
            newMeal = {
                course: this.newCourse,
                dessert: this.newDessert,
                salad: this.newSalad,
                price: this.newPrice
            }
            console.log(newMeal)
            fetch("http://localhost:8080/meals", { 
                
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newMeal)
                
                }).then( (response) => {
                    if (response.status == 201) {
                        console.log(meals);
                        this.loadMealsFromAPI();
                    }
                    
                    
                    
            })
            
            console.log("loaded")
        },
        logIn: function () {
            user = {
                email: this.email,
                plainPassword: this.password,
            };
            
            fetch("http://localhost:8080/session", { 
                
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
                
                }).then( (response) => {
                    if (response.status == 201) {
                        this.currentPage = 'kits';
                        this.loggedIn = true;
                        console.log("kits");
                        this.loadKitsFromAPI();
                    }
            });
            console.log("loggedIn")
            this.signYouIn();
            console.log(this.usersName)
        },
        deleteMeal: function (meal) {
            console.log("delete meal", meal._id);
            fetch('{$API_URL}/meals/${meal._id}', {
                method: 'DELETE',
                credentials: 'include'
            }).then (response => {
                this.loadMealsFromAPI();
            });
        },
        createAccount: function () {
            newUser = {
                firstName: this.new_first_name,
                lastName: this.new_last_name,
                email: this.new_email,
                plainPassword: this.new_password,
                kits: [],
            };
            
            fetch("http://localhost:8080/users", { 
                
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
                
                }).then( (response) => {
                    if (response.status == 201) {
                        console.log("didin't work")
                    };
            });
        },
    }, 
    created: function () {
        console.log("your app", this.name)
        this.loadMealsFromAPI();
        this.loadKitsFromAPI();
        this.signYouIn();
    }


 }).mount('#app');