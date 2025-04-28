const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

const books = [
    { id: 1, title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', year: 1997 },
    { id: 2, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
    { id: 3, title: '1984', author: 'George Orwell', year: 1949 },
    { id: 4, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
    { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', year: 1951 }
];

app.get('/public_users', function(req, res) {
    res.json(JSON.parse(JSON.stringify(books, null, 4)));
});

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: "Access Denied: No Token Provided" });
    }

    const tokenWithoutBearer = token.split(" ")[1];

    jwt.verify(tokenWithoutBearer, "your_jwt_secret_key", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid Token" });
        }
        req.user = decoded; 
        next(); 
    });
});
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
