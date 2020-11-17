
const mongoose = require('mongoose')
const express = require('express')
const empSchema = require('../model/schema/Empschema')
const usrSchema = require('../model/schema/Userschema')
const app = express.Router()

const Employee = mongoose.model('employee_details', empSchema)
const Usr = mongoose.model('signups', usrSchema)

app.get('/', (req, res) => {
    if(!req.session.user) {
        res.render('login', { 'message': true, 'msg': 'Please login' })
    }
    Employee.find().then( data => {
        Usr.find({ usr_name: req.session.user }, (err, u) => {
            u.forEach( usr => {
                res.render('empreport_cash', { 'emp' : data, 'isLoggedin': true, 'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
            })
        })
    })
})

app.post('/updateAcct', (req, res) => {
    Employee.findById({ _id:req.body.id }, (err, emp) => {
        let acct = req.body.acct;
        Employee.updateOne({ _id:req.body.id }, {
            $set: { emp_acct: acct }
        }).then(Employee.find().then( data => {
            Usr.findOne({ usr_name: req.session.user }, (err, usr) => {
                res.render('empreport_cash', { 'emp' : data, 'isLoggedin': true, 'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
            })
        }))
    })
})

app.post('/updateName', (req, res) => {
    Employee.updateOne({ _id:req.body.id }, {
        $set: { emp_name: req.body.name }
    }).then(Employee.find().then( data => {
        Usr.findOne({ usr_name: req.session.user }, (err, usr) => {
            res.render('empreport_cash', { 'emp' : data, 'isLoggedin': true, 'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
        })
    }))
})

app.post('/updateSalary', (req, res) => {
    Employee.updateOne({ _id:req.body.id }, {
        $set: { emp_salary: req.body.salary }
    }).then(Employee.find().then( data => {
        Usr.findOne({ usr_name: req.session.user }, (err, usr) => {
            res.render('empreport_cash', { 'emp' : data, 'isLoggedin': true, 'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
        })
    }))
}) 

app.post('/updateIncentive', (req, res) => {
    Employee.findById({ _id:req.body.id }, (err, emp) => {
        let incentive = Math.round(req.body.incentive);
        Employee.updateOne({ _id:req.body.id }, {
            $set: { emp_incentive: incentive }
        }).then(Employee.find().then( data => {
            Usr.findOne({ usr_name: req.session.user }, (err, usr) => {
                res.render('empreport_cash', { 'emp' : data, 'isLoggedin': true, 'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
            })
        }))
    })
})

app.post('/updateGramt', (req, res) => {
    Employee.findById({ _id:req.body.id }, (err, emp) => {
        let gr_amt = req.body.gr_amt;
        Employee.updateOne({ _id:req.body.id }, {
            $set: { emp_gr_amt: gr_amt }
        }).then(Employee.find().then( data => {
            Usr.findOne({ usr_name: req.session.user }, (err, usr) => {
                res.render('empreport_cash', { 'emp' : data, 'isLoggedin': true, 'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
            })
        }))
    })
})

app.post('/updateAbsent', (req, res) => {
    Employee.findById({ _id:req.body.id }, (err, emp) => {
        let ttl_days = 30;
        let leaves = ttl_days - req.body.absent;
        let salary = emp.emp_salary;

        if( emp.emp_pay_method ==='CASH' && req.body.absent <= 15 ) {
            salary = Math.round((((salary/30)*32)/30)*leaves);
            per_day = Math.round((emp.emp_salary/30)*2);
            incentive = per_day+emp.emp_salary;
            Employee.update({ _id:req.body.id }, {
                $set: {
                    "emp_absent": leaves,
                    "emp_incentive": per_day,
                    "emp_gr_amt": incentive,
                    "emp_gr_value": salary,
                    "emp_gr_total": salary
                }
            }).then(res.end())
        } else if( emp.emp_pay_method ==='CASH' && req.body.absent > 15 ) {
            salary = Math.round(((salary/30))*leaves);
            Employee.updateOne({ _id:req.body.id }, {
                $set: {
                    "emp_absent": leaves,
                    "emp_incentive": 0,
                    "emp_gr_amt": emp.emp_salary,
                    "emp_gr_value": salary,
                    "emp_gr_total": salary
                }
            }).then(res.end())
        }
    })
})

app.post('/updateGrvalue', (req, res) => {
    Employee.findById({ _id:req.body.id }, (err, emp) => {
        let gr_value = req.body.gr_value;
        Employee.updateOne({ _id:req.body.id }, {
            $set: { emp_gr_value: gr_value }
        }).then(Employee.find().then( data => {
            Usr.findOne({ usr_name: req.session.user }, (err, usr) => {
                res.render('empreport_cash', { 'emp' : data, 'isLoggedin': true, 'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
            })
        }))
    })
})

app.post('/updateAdvance', (req, res) => {
    Employee.findById({ _id:req.body.id }, (err, emp) => {
        let salary = Math.round(emp.emp_gr_value - req.body.advance);
        Employee.updateOne({ _id:req.body.id }, {
            $set: { 
                    "emp_advance": req.body.advance,
                    "emp_gr_total": salary 
                }
        }).then(Employee.find().then( data => {
            Usr.find({ usr_name: req.session.user }, (err, usr) => {
                res.render('empreport_cash', { 'emp' : data, 'isLoggedin': true, 'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
            })
        }))
    })
})

app.post('/updateGrttl', (req, res) => {
    Employee.findById({ _id:req.body.id }, (err, emp) => {
        let ttl_amt = Math.round(req.body.ttl_amt);
        Employee.updateOne({ _id:req.body.id }, {
            $set: { emp_gr_total: ttl_amt }
        }).then(Employee.find().then( data => {
            Usr.findOne({ usr_name: req.session.user }, (err, usr) => {
                res.render('empreport_cash', { 'emp' : data, 'isLoggedin': true, 'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
            })
        }))
    })
})

module.exports = app