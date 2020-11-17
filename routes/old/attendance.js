
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
        res.render('login', { 'message': true, 'msg': 'You Need to Login' })
    } else {   
        Employee.find((err, pfEmp) => {
            Emp_cash.find((err, cashEmp) => {
                Usr.find({ usr_name: req.session.user }, (err, usr) => {
                    res.render('attendance', { 'attendance': pfEmp, 'emp': cashEmp, 'isLoggedin': true,
                    'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
                })
            })
        })
    }
})

app.post('/pfAttendance', (req, res) => {
    let ttl_days = 30;
    Employee.findOne({ _id:req.body.id }, (err, emp) => {
        let salary = emp.emp_salary;
        let pf = emp.emp_pf_amt;
        let esic = emp.emp_esi_amt;
        let leaves = (ttl_days - req.body.leaves)
        if ( emp.emp_pay_method ==='PF' && req.body.leaves > 15 ) {
            salary = Math.round(((salary/30)*leaves)-(pf+esic));
            Employee.findByIdAndUpdate({ _id:req.body.id }, {
                $set: {
                    "emp_absent": leaves,
                    "emp_incentive": 0,
                    "emp_gr_amt": emp.emp_salary,
                    "emp_gr_value": salary,
                    "emp_gr_total": salary
                }
            }).then()
        } else if( emp.emp_pay_method ==='PF' && req.body.leaves <= 15 ) {
            salary = Math.round(((((salary/30)*32)/30)*leaves)-(pf+esic));
            per_day = Math.round((emp.emp_salary/30)*2);
            incentive = per_day+emp.emp_salary;
            Employee.updateOne({ _id:req.body.id }, {
                $set: {
                    "emp_absent": leaves,
                    "emp_incentive": per_day,
                    "emp_gr_amt": incentive,
                    "emp_gr_value": salary,
                    "emp_gr_total": salary
                }
            }).then()
        }
    })

    Employee.find().then( data => {
        Usr.find({ usr_name: req.session.user }, (err, usr) => {
            res.render('empreport', { 'emp' : data, 'isLoggedin': true, 'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
        })
    })
})

app.post('/noPfAttendance', (req, res) => {
    let ttl_days = 30;
    Emp_cash.findOne({ _id:req.body.id }, (err, emp) => {
        let salary = emp.emp_salary;
        let pf = emp.emp_pf_amt;
        let esic = emp.emp_esi_amt;
        let leaves = (ttl_days - req.body.leaves)
        if( emp.emp_pay_method ==='CASH' && req.body.leaves <= 15 ) {
            salary = Math.round((((salary/30)*32)/30)*leaves);
            per_day = Math.round((emp.emp_salary/30)*2);
            incentive = per_day+emp.emp_salary;
            Emp_cash.updateOne({ _id:req.body.id }, {
                $set: {
                    "emp_absent": leaves,
                    "emp_incentive": per_day,
                    "emp_gr_amt": incentive,
                    "emp_gr_value": salary,
                    "emp_gr_total": salary
                }
            }).then()
        } else if( emp.emp_pay_method ==='CASH' && req.body.leaves > 15 ) {
            salary = Math.round(((salary/30))*leaves);
            Emp_cash.updateOne({ _id:req.body.id }, {
                $set: {
                    "emp_absent": leaves,
                    "emp_incentive": 0,
                    "emp_gr_amt": emp.emp_salary,
                    "emp_gr_value": salary,
                    "emp_gr_total": salary
                }
            }).then()
        }
    })

    Employee.find().then( data => {
        Usr.find({ usr_name: req.session.user }, (err, usr) => {
            res.render('empreport', { 'emp' : data, 'isLoggedin': true, 'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
        })
    })
})

module.exports = app