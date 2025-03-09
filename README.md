# Index.js

## Resource

**Meal**

Attributes:

* Course (string)
* Dessert (string)
* Salad (string)
* Price (number)

  **User**

Attributes:

* Name (string)
* Last Name (string)
* Email (string)
* Password (string)

  **Kit**

Attributes:

* Name (string)
* Difficulty_level (number)
* Price (number)

## REST Endpoints

Name                           | Method | Path
-------------------------------|--------|------------------
Hello Response                 | GET    | /hello
Get all meals                  | GET    | /meals
Create new meal                | POST   | /meals
Add User                       | POST   | /users
Get a session                  | GET    | /session
Create a session               | POST   | /session
Delete a session               | DELETE | /session
Get all kits                   | GET    | /kits
Get the users kits             | GET    | /user/kits
Create a kit                   | POST   | /kits
Add a kit to a user            | PUT    | /user/addKit
