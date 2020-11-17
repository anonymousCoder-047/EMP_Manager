
const mongoose = require('mongoose')
const express = require('express')
const empSchema = require('../model/schema/Empschema')
const usrSchema = require('../model/schema/Userschema')
const app = express.Router()

const Employee = mongoose.model('pfs', empSchema)
const Emp_cash = mongoose.model('employee_details', empSchema)
const Usr = mongoose.model('signups', usrSchema)

app.get('/', (req, res) => {
    if(!req.session.user) {
        res.render('login', { 'message': true, 'msg': 'Please login' })
    } else {
        Employee.find((err, usr) => {
            let usr_data = []
            usr.forEach( u => {
                usr_data.push(u)
            })
            Emp_cash.find((err, usr) => {
                usr.forEach( u => {
                    usr_data.push(u)
                })
            })
            Usr.findOne({ usr_name:req.session.user }, (err, usr) => {
                res.render('modifyEMP', { 'emp': usr_data, 'isLoggedin': true, 'user_name': req.session.user, 
                'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
            })
        })
    }
})

app.post('/', (req, res) => {
    if( req.body.pay_method === 'PF' ) {
        Employee.updateOne({ _id:req.body.id }, {
            $set: {
                emp_incentive: req.body.incentive,
                emp_pf_amt: req.body.pf_amt,
                emp_esi_amt: req.body.esic_amt,
                emp_salary: req.body.salary
            }
        }, (err, data) => {
            Employee.find((err, usr) => {
                let usr_data = []
                usr.forEach( u => {
                    usr_data.push(u)
                })
                Emp_cash.find((err, usr) => {
                    usr.forEach( u => {
                        usr_data.push(u)
                    })
                })
                Usr.findOne({ usr_name:req.session.user }, (err, usr) => {
                    res.render('modifyEMP', { 'emp': usr_data, 'isLoggedin': true, 'user_name': req.session.user, 
                    'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
                })
            })
        })
    } else {
        Emp_cash.updateOne({ _id:req.body.id }, {
            $set: {
                emp_salary:req.body.salary,
                emp_incentive: req.body.incentive
            }
        }, (err, data) => {
            Employee.find((err, usr) => {
                let usr_data = []
                usr.forEach( u => {
                    usr_data.push(u)
                })
                Emp_cash.find((err, usr) => {
                    usr.forEach( u => {
                        usr_data.push(u)
                    })
                })
                Usr.findOne({ usr_name:req.session.user }, (err, usr) => {
                    res.render('modifyEMP', { 'emp': usr_data, 'isLoggedin': true, 'user_name': req.session.user, 
                    'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
                })
            })
        })
    }
})

app.post('/namechange', (req, res) => {
    if( req.body.pay_method === 'PF' ) {
        Employee.updateOne({ _id:req.body.id }, {
            $set: {
                emp_name: req.body.name
            }
        }, (err, data) => {
            Employee.find((err, usr) => {
                let usr_data = []
                usr.forEach( u => {
                    usr_data.push(u)
                })
                Emp_cash.find((err, usr) => {
                    usr.forEach( u => {
                        usr_data.push(u)
                    })
                })
                Usr.findOne({ usr_name:req.session.user }, (err, usr) => {
                    res.render('modifyEMP', { 'emp': usr_data, 'isLoggedin': true, 'user_name': req.session.user, 
                    'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
                })
            })
        })
    } else {
        Emp_cash.updateOne({ _id:req.body.id }, {
            $set: {
                emp_name:req.body.name
            }
        }, (err, data) => {
            Employee.find((err, usr) => {
                let usr_data = []
                usr.forEach( u => {
                    usr_data.push(u)
                })
                Emp_cash.find((err, usr) => {
                    usr.forEach( u => {
                        usr_data.push(u)
                    })
                })
                Usr.findOne({ usr_name:req.session.user }, (err, usr) => {
                    res.render('modifyEMP', { 'emp': usr_data, 'isLoggedin': true, 'user_name': req.session.user, 
                    'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
                })
            })
        })
    }
})

module.exports = app