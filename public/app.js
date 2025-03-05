
Vue.createApp(  {
    
    data: function (){
        return {
            //all your data
            name: 'green',
            color: "green",
            meals: [],
            newCourse: '',
            newDessert: '',
            newSalad: '',
            newPrice: 0,
            total: 0,
            currentPage: 'home',
            signIn: true,
            new_first_name: '',
            new_last_name: '',
            new_email: '',
            new_password: '',
            errors: {},
            email: '',
            password: '',
        }
    },

    methods: {
        redirectToHome: function () {
            this.currentPage = 'home';
            console.log("home");
        },
        redirectToKits: function () {
            this.currentPage = 'kits';
            console.log("kits");
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
        },
        signup: function () {
            this.signIn = false;
        },
        loadMealsFromAPI: function () {
            fetch("http://localhost:8080/meals").then((response) => {
                response.json().then((meals) => {
                    this.meals = meals;
                });
            })
        },
        pizza: function () {
            console.log(this)
        },
        addToCart: function (meal) {
            this.total += meal.price
            var rounded = Math.ceil(this.total * 100)/100;
            this.total = rounded;
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
            if (!this.validateVeggie()) {
                console.error("Veggie validation not authorized")
            }
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
            };
            
            fetch("http://localhost:8080/users", { 
                
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
                
                }).then( (response) => {
                    if (response.status == 201) {
                        
                    }
            });
        },
        signIn: function () {
            user = {
                email: this.email,
                plainPassword: this.password,
            };
            
            fetch("http://localhost:8080/session", { 
                
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
                
                }).then( (response) => {
                    if (response.status == 201) {
                        
                    }
            });
            console.log("loggedIn")
        },
    }, 

    created: function () {
        console.log("your app", this.name)
        this.loadMealsFromAPI();
    }


 }).mount('#app');