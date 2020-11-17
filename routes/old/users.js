
const express = require('express')
const mongoose = require('mongoose')
const app = express.Router()

const empSchema = require('../model/schema/Empschema')
const usrSchema = require('../model/schema/Userschema')
const Employee = mongoose.model('pfs', empSchema)
const Usr = mongoose.model('signups', usrSchema)
const Emp_cash = mongoose.model('employee_details', empSchema)

app.get('/', (req, res) => {
    if(!req.session.user) {
        res.render('login', { 'message': true, 'msg': 'Please Login' })
    } else {
        let usr_data = []
        let uData = []
        Employee.find((err, eData) => {
            eData.forEach( e => {
                usr_data.push(e)
            })
        })
        Emp_cash.find((err, e_data) => {
            e_data.forEach( e => {
                usr_data.push(e)
            })
        })
        Usr.find((err, usr) => {
            usr.forEach( u => {
                uData.push(u)
            })
        })
        Usr.find({ usr_name: req.session.user }, (err, usr) => {
            res.render('users', { 'emp': usr_data, 'isLoggedin': true, 'user_name': req.session.user, 
                'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager, 'usr': uData })
        })
    }
})

app.post('/nameUpdate', (req, res) => {
    let usr_data = []
    let uData = []
    Usr.updateOne({ _id:req.body.id }, {
        $set: {
            usr_name: req.body.name
        }
    }, (err, user) => {
        console.log(user)
    })
    Usr.find((err, usr) => {
        usr.forEach( u => {
            uData.push(u)
        })
    })
    Employee.find((err, usr) => {
        usr.forEach( u => {
            usr_data.push(u)
        })
    })
    Emp_cash.find((err, usr) => {
        usr.forEach( u => {
            usr_data.push(u)
        })
    })
    Usr.findOne({ usr_name:req.session.user }, (err, usr) => {
        res.render('users', { 'emp': usr_data, 'isLoggedin': true, 'user_name': req.session.user, 
        'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager, 'usr': usr })
    })
})

app.post('/updateAdminPermission', (req, res) => {
    console.log(req.body)
    Usr.updateOne({ _id:req.body.id }, {
        $set: {
            is_Admin: req.body.make_admin
        }
    }, (err, user) => {
        let usr_data = []
        let uData = []
        Employee.find((err, usr) => {
            usr.forEach( u => {
                usr_data.push(u)
            })  
        })
        Emp_cash.find((err, usr) => {
            usr.forEach( u => {
                usr_data.push(u)
            })
        })
        Usr.find((err, usr) => {
            usr.forEach( u => {
                uData.push(u)
            })
        })
        Usr.findOne({ usr_name:req.session.user }, (err, usr) => {
            res.render('users', { 'emp': usr_data, 'isLoggedin': true, 'user_name': req.session.user, 
            'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager, 'usr': usr })
        })
    })
})

app.post('/updateManagerPermission', (req, res) => {
    console.log(req.body)
    Usr.updateOne({ _id:req.body.id }, {
        $set: {
            is_Manager: req.body.manager
        }
    }, (err, user) => {
        let usr_data = []
        let uData = []
        Employee.find((err, usr) => {
            usr.forEach( u => {
                usr_data.push(u)
            })  
        })
        Emp_cash.find((err, usr) => {
            usr.forEach( u => {
                usr_data.push(u)
            })
        })
        Usr.find((err, usr) => {
            usr.forEach( u => {
                uData.push(u)
            })
        })
        Usr.findOne({ usr_name:req.session.user }, (err, usr) => {
            res.render('users', { 'emp': usr_data, 'isLoggedin': true, 'user_name': req.session.user, 
            'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager, 'usr': usr })
        })
    })
})

app.post('/updateEmpPermission', (req, res) => {
    console.log(req.body)
    Usr.updateOne({ _id:req.body.id }, {
        $set: {
            can_add_emp: req.body.add_emp
        }
    }, (err, user) => {
        let usr_data = []
        let uData = []
        Employee.find((err, usr) => {
            usr.forEach( u => {
                usr_data.push(u)
            })  
        })
        Emp_cash.find((err, usr) => {
            usr.forEach( u => {
                usr_data.push(u)
            })
        })
        Usr.find((err, usr) => {
            usr.forEach( u => {
                uData.push(u)
            })
        })
        Usr.findOne({ usr_name:req.session.user }, (err, usr) => {
            res.render('users', { 'emp': usr_data, 'isLoggedin': true, 'user_name': req.session.user, 
            'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager, 'usr': usr })
        })
    })
})


module.exports = app