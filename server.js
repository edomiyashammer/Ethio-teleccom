require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 80

// configuration
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.json())
app.use(express.static(__dirname + '/web'))

mongoose.connect('mongodb://127.0.0.1:27017/ethiotel')
.then(()=>{
    console.log('MongoDB Connected')
})
.catch(err => console.log(err.message))

const phoneNumberSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    phoneNumber : String,
    pukCode : Number,
    pinCode : String,
})

const wifiUserSchema = new mongoose.Schema({
    firstName : String,
    middleName : String,
    lastName : String,
    accountNumber : Number,
    serviceNumber : Number,
    customerCode : Number,
    address : String,
    receptNumber : Number,
    date : Date,
    fixed : Boolean,
})

const requestListSchema = new mongoose.Schema({
    user : wifiUserSchema,
    requestDate : Date,
    waitingNumber : Number,
    status : Boolean,
})

const PhoneNumber = mongoose.model('phoneNumbers',phoneNumberSchema)
const WifiUser = mongoose.model('wifiIssues', wifiUserSchema)
const RequestList = mongoose.model('list',requestListSchema)

app.get('/',(req,res)=>{
    res.sendFile('index.html')
})

app.get('/getpuk',(req,res)=>{
    const { phoneNumber } = req.body
    PhoneNumber.findOne({phoneNumber}).then(pn => {
        res.send(pn)
    })
})

app.get('/requestWifiIssue',(req,res)=>{
    let { serviceNumber } = req.body
    serviceNumber = parseInt(serviceNumber)
    WifiUser.findOne({serviceNumber},{_id:1}).then(result => {
        const user = result._id
        const date = new Date()
        const status = false
        let waitingNumber = 0

        RequestList.find({}).then(reqs => {
            waitingNumber = reqs.length
            const newReqList = new RequestList({user,date,status,waitingNumber})
            
            newReqList.save().then(success =>{
                res.send({success})
            }).catch(err => {
                res.send(err)
            })

        })
    })
})


// ? Demo data generators

// function generateRandomDbData(){
//     const generatePhoneNumber = () =>{
//         let phoneNumber = []
//         let pukCode = []
//         for(let i = 1 ; i <= 8; i++){
//             const randomNumber = Math.floor(Math.random() * 9)
//             phoneNumber.push(randomNumber)
//         }
    
//         for(let i = 0; i <= 7; i++){
//             const randNum = Math.floor(Math.random() * 9)
//             pukCode.push(randNum)
//         }
    
//         phoneNumber = phoneNumber.join('')
//         pukCode = pukCode.join('')
    
//         return {phoneNumber,pukCode}
//     }

//     const countryCode = +251
//     const pinCode = "0000"

//     let datas = []

//     const names = [
//         'mhcda eth',
//         'nati adawa',
//         'rani eth',
//         'bayu adwa',
//         'meky adwa',
//         'kiya eth',
//         'hammer eth'
//     ]

//     for(let name of names){
//         const [ firstName, lastName ] = name.split(' ')
//         let { phoneNumber, pukCode} = generatePhoneNumber()
//         phoneNumber = `+${countryCode}${phoneNumber}`
        
//         const data = {firstName,lastName,phoneNumber,pukCode,pinCode}
//         datas.push(data)
//     }
    
//     return {datas}
// }

// const  { datas } = generateRandomDbData()

// function generateRandomIssueData(){
//     // {
//     //     firstName : String,
//     //     middleName : String,
//     //     lastName : String,
//     //     accountNumber : Number,
//     //     serviceNumber : Number,
//     //     customerCode : Number,
//     //     address : String,
//     //     receptNumber : Number,
//     //     date : Date,
//     // }
//     const datas = []
//     const names = [
//         'beamlak mhcda eth',
//         'nati adawa 1888',
//         'rani eth mhcda',
//         'bayu adwa 1888',
//         'meky adwa 1888',
//         'kiya eth mhcda',
//         'hammer eth mhcda',
//     ].map(name => name.split(' '))

    
//     for(let name of names){
//         const [firstName, middleName, lastName] = name
//         const serviceNumber = generateRandomNumber({digit : 11})
//         const accountNumber = generateRandomNumber({digit : 9})
//         const customerCode = generateRandomNumber({digit : 9})
//         const receptNumber = generateRandomNumber({digit : 10})
//         const date = generateRandomDate()
//         let fixed = false
        
//         if((names.indexOf(name) % 2) === 0) fixed = true

//         const data = {firstName, middleName, lastName, serviceNumber, accountNumber, fixed, customerCode, receptNumber, date, address: 'Addis Ababa 15 0 0'}
//         datas.push(data)
//     }
    
// }

// const generateRandomNumber = ({digit}) => {
//     const result = []
//     for(let i = 0; i <= digit; i++){
//         const randomNumber = Math.floor(Math.random() * 9)
//         result.push(randomNumber)
//     }

//     return result.join('')
// }

// const generateRandomDate = () =>{
//     const year = Math.floor(Math.random() * 2015)
//     const month = Math.floor(Math.random() * 11)
//     const date = Math.floor(Math.random() * 30)

//     if(year < 2000){
//         return generateRandomDate()
//     }

//     return new Date(year,month,date)
// }
// generateRandomIssueData()

app.listen(port,()=>{
    console.log(`Listening on port *${port}`)
    
})

