
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
    }
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
        Usr.find((err, u) => {
            u.forEach(usr => {
                res.render('pay_slip', { 'emp': usr_data, 'isLoggedin': true, 'user_name': req.session.user, 
            'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager, 'usr': usr })
            })
        })
    })
})

module.exports = app