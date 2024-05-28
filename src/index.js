const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const collection = require('./config')
const app = express();

const template_path = path.join(__dirname, '../views')

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.set('views', template_path)

app.get('/', (req, res) => {
    res.render('login');

})

app.get('/signUp', (req, res) => {
    res.render('signUp');
})


// Register User

app.post('/signup', async(req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    }

    //check if the user already existed or not
    const existingUser = await collection.findOne({email: data.email})

    if(existingUser){
        res.send('User already existed. Please choose a different Username')
    }else{
        // hash the password using bcrypt
        const saltRounds = 10 // Number of salt round for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds)

        data.password = hashedPassword  // Replace the hashed password with original password 

        const userdata = await collection.insertMany(data)
        // res.render('home')
        console.log(userdata) 
    }

})



//  Login 
app.post('/login', async (req, res) => {
    try {
        const checkUser = await collection.findOne({email: req.body.email})

        if(!checkUser){
            res.send('Username cannot found')
        }
        
        // compared the hash password from the database with plain text
        const isPasswordMatch = await bcrypt.compare(req.body.password, checkUser.password)
        if(isPasswordMatch){
            res.render('home')
        }else{
            res.send('wrong password')
        }

    } catch (error) {
        res.send('Wrong Details')
    }
})



const port = 3000
app.listen(port, ()=> {
    console.log(`Server running on post: ${port}` )
})


