// Including and cinfig env file here
const dotenv = require("dotenv");
const color = require("colors");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const methodOverride = require("method-override")
const session = require("express-session");
const MongoStore = require("connect-mongo")(session)
const PORT = process.env.PORT || 5000
// Importing routes
const router = require("./routes/index");
const authRoute = require("./routes/auth");
const storyRoute = require("./routes/stories")

//Load config
dotenv.config({path: './config/config.env'});

// Passport config
require('./config/passport')(passport);
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

 //Method Override
 app.use(methodOverride((req, res) =>{
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  }))

//Logging
if(process.env.NODE_ENV === 'development'){      
    app.use(morgan('dev'))
}

// Handlebar helpers

const {formatDate,truncate,stripTags,editIcon, select} = require('./helpers/hbs');



// View engine 
app.engine('.hbs', exphbs({helpers:
     {
         formatDate, truncate, stripTags,editIcon,select
    },
    defaultLayout:'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
 
// Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store : new MongoStore({mongooseConnection : mongoose.connection})
  
  }))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global var

app.use((req, res, next)=>{
    res.locals.user = req.user || null
    next()
})

//static files
app.use(express.static(path.join(__dirname , 'public')))


app.use(cors());

// Routes
app.use('/', router);
app.use('/auth', authRoute);
app.use('/stories', storyRoute);


// Connection to MongoDB here
mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser:true, useUnifiedTopology:true , useFindAndModify: true})

const db = mongoose.connection
db.on("error", (err)=>{
    console.log(err);
})
db.once("open", ()=>{
    console.log("MongoDB Connection Successful..".magenta.bold);
})

app.listen(PORT, (req, res)=>{
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}.`.yellow.bold);
})