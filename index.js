const answer = require('./app/index')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const path = require('path')
const exphbs = require('express-handlebars')


const jsonParser = bodyParser.json()

app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))

app.set('view engine', '.hbs')
app.set('viwes', path.join(__dirname, 'views'))

app.use((request, response, next) => {
    console.log(request.headers)
    next()
})

app.use((request, response, next) => {
    console.log('hits here')
    request.chance = Number.parseInt(Math.random()*10)
    next()
})

app.get('/', (request, response) => {
    response.render('home',{
        name: 'hemel',
        port: port,
        result: `The Sum of your Array is: ${answer.result}`
    })
})

// app.get('/', (request, response) => {
//     throw new Error('wrong')
// })

app.use((err, request, response, next)=>{
    //log the error, for now just console.log
    console.log(err)
    response.status(500).send('something broke!')
})

app.get('/test', (request, response) => {
    response.json({
        show:'this is for test purpose'
    })
})

app.listen(port)

// 'use strict'

// const pg = require('pg')
// //const conString = 'postgres://postgres:En@sis123@localhost/node_hero'

// const config = {
//     user: 'postgres',
//     database: 'node_hero',
//     password: 'En@sis123',
//     port: 5432                  //Default port, change it if needed
// };

// const pool = new pg.Pool(config)

// pool.connect(function(err, client, done){
//     if(err){
//         return console.error('error fetching client from pool', err)
//     }
//     console.log('Connection Successful.')
// })

// app.post('/users', function(req, res, next){
//     const user = req.body

//     pool.connect(function(err, client, done){
//         if(err){
//             // pass the error to the express error handler
//             return next(err)
//         }
//         client.query('INSERT INTO users(name, age) VALUES ($1, $2);', [user.name, user.age], function(err, result){
//             done() // this done callback signals the pg driver that the connection can be closed or returned to the connection pool
//             if(err){
//                 // pass the error to the express error handler 
//                 return next(err)
//             }
//             res.send(200)
//         })
//     })
// })

const { Sequelize, DataTypes, Model } = require('sequelize');
const e = require('express')

// const sequelize = new Sequelize('postgres://postgres:En@sis123:5432/node_hero')

const sequelize = new Sequelize('node_hero', 'postgres', 'En@sis123', {
    host: 'localhost',
    dialect: 'postgres'
});

try{
    sequelize.authenticate();
    console.log('Connection has been established successfully.')
} catch(error){
    console.error('Unable to connect to the database: ', error);
}

class Users extends Model{}

Users.init({
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    age:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},{
    sequelize,
    modelName: 'Users',
    timestamps: false,
    tableName: 'users'
})
//Users.sync({force:true})
Users.sync();
function CreateUsers(user){
    return Users.create({ name: user.name, age: user.age })
}

app.post('/createUsers', jsonParser, function(req, res, next){
    return  CreateUsers(req.body).then(function(data){
        if(data){ res.send("user has been created successfully.") }
        else { res.status(400).send('Error in insert new record') }
    })
})

app.get('/getUsers', function(req, res, next){
    return Users.findAll().then(function(data){
        if(data){
            res.send(data);
        }
        else { res.status(400).send('Error in insert new record') }
    })
})

