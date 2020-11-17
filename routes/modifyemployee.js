
const express = require('express')
const app = express.Router()
const mongoose = require('mongoose')

const empSchema = require('../model/schema/Empschema')
const usrSchema = require('../model/schema/Userschema')

const Usr = mongoose.model('signup', usrSchema, 'signup')
const Emp = mongoose.model('employees', empSchema)

app.get('/', (req, res) => {
    if( !req.session.user ) {
        message = true,
        msg = 'Please Login'
        res.render('login', { 'message': message, 'msg': msg, 'is_Loggedin': false, 'is_Admin': false, 'is_Manager': false })
    } else {
        Usr.findOne({ _id: req.session.empId }, (err, usr) => {
            if( usr.is_Admin === 'true' ) {
                Emp.find((err, emp) => {
                    res.render('edit_employee', { 'message': true, 'msg': 'Manage Employee', 'is_Loggedin': true, 'is_Admin': true, 'is_Manager': false, 'emp':emp })
                })
            } else {
                res.render('home', { 'is_Loggedin': true, 'is_Admin': false, 'is_Manager': false })
            }
        })
    }
})

app.get('/employees', (req, res) => {
    if( !req.session.user ) {
        message = true,
        msg = 'Please Login'
        res.render('login', { 'message': message, 'msg': msg, 'is_Loggedin': false, 'is_Admin': false, 'is_Manager': false })
    } else {
        Usr.findOne({ _id: req.session.empId }, (err, usr) => {
            if( usr.is_Admin === 'true' ) {
                Emp.find((err, emp) => {
                    res.send(emp)
                })
            } else {
                res.render('home', { 'is_Loggedin': true, 'is_Admin': false, 'is_Manager': false })
            }
        })
    }
})

app.post('/', (req, res) => {
    Emp.findOneAndUpdate({ _id:req.body.db_id }, {
        $set:{
            emp_acct:req.body.emp_acct,
            emp_name:req.body.emp_name,
            emp_gender:req.body.emp_gender,
            emp_dob:req.body.emp_dob,
            emp_join_date:req.body.emp_join_date,
            emp_blood_group:req.body.emp_blood_group,
            emp_address:req.body.emp_address,
            emp_counter:req.body.emp_counter,
            emp_job_role:req.body.emp_job_role,
            emp_salary:req.body.emp_salary,
            emp_pay_method:req.body.emp_pay_method,
            emp_pf_rate:req.body.emp_pf_per,
            emp_esic_rate:req.body.emp_esic_per,
            emp_pf_tax:req.body.emp_pf_tax,
            emp_gr_total:req.body.emp_ttl_salary,
            emp_gr_value:req.body.emp_ttl_salary
        }
    }, (err, doc) => {
        Usr.findOne({ _id: req.session.empId }, (err, usr) => {
            if( usr.is_Admin === 'true' ) {
                Emp.find((err, emp) => {
                    res.render('edit_employee', { 'message': true, 'msg': 'Manage Employee', 'is_Loggedin': true, 'is_Admin': true, 'is_Manager': false, 'emp':emp })
                })
            } else {
                res.render('home', { 'is_Loggedin': true, 'is_Admin': false, 'is_Manager': false })
            }
        })
    })
})

module.exports = app