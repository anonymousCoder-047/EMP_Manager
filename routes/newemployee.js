
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const app = express.Router()

const usrSchema = require('../model/schema/Userschema')
const empSchema = require('../model/schema/Empschema')
const Employee = mongoose.model('employees', empSchema)
const Usr = mongoose.model('signup', usrSchema)

app.use(bodyParser.urlencoded({ extended: false }))
app.get('/', (req, res) => {
    if(!req.session.user) {
        res.render('login', { 'message': message, 'msg': msg, 'is_Loggedin': false, 'is_Admin': false, 'is_Manager': false })
    } else {
        Usr.findOne({ _id:req.session.empId }, (err, usr) => {
            if( usr.is_Admin === 'true' ) {
                res.render('newEmployee', { 'message': true, 'msg': 'Insert Employee', 'is_Loggedin': true, 'is_Admin': true, 'is_Manager': false })
            } else {
                res.render('newEmployee', { 'message': true, 'msg': 'Insert Employee', 'is_Loggedin': true, 'is_Admin': false, 'is_Manager': true })
            } 
        })
    }
})

app.post('/', (req, res) => {
    if( req.body.emp_pay_method === 'cash') {
        
        const emp = new Employee({
            emp_id: req.body.emp_id,
            emp_acct: req.body.emp_acct,
            emp_name: req.body.emp_name,
            emp_phone: req.body.emp_phone,
            emp_email: req.body.emp_mail, 
            emp_gender: req.body.emp_gender,
            emp_dob: req.body.emp_dob,
            emp_join_date: req.body.emp_join_date,
            emp_blood_group: req.body.emp_blood_group,
            emp_address: req.body.emp_address,
            emp_counter: req.body.emp_counter,
            emp_job_role: req.body.emp_job_role,
            emp_salary: req.body.emp_salary,
            emp_pay_method: req.body.emp_pay_method,
            emp_gr_total: req.body.emp_ttl_salary
        })
        emp.save() 
        
    } else if( req.body.emp_pay_method === 'pf' && req.body.emp_salary <= 15000 ) {

        let salary = req.body.emp_salary;
        let pf_amt = pf_calculate(salary, req.body.emp_pf_per);
        let esic_amt = pf_calculate(salary, req.body.emp_esic_per);

        const emp = new Employee({
            emp_id: req.body.emp_id,
            emp_acct: req.body.emp_acct,
            emp_name: req.body.emp_name,
            emp_phone: req.body.emp_phone,
            emp_email: req.body.emp_email,
            emp_gender: req.body.emp_gender,
            emp_dob: req.body.emp_dob,
            emp_join_date: req.body.emp_join_date,
            emp_blood_group: req.body.emp_blood_group,
            emp_address: req.body.emp_address,
            emp_counter: req.body.emp_counter,
            emp_job_role: req.body.emp_job_role,
            emp_salary: req.body.emp_salary,
            emp_pay_method: req.body.emp_pay_method,
            emp_pf_amt: pf_amt,
            emp_esi_amt: esic_amt,
            emp_pf_rate: req.body.emp_pf_per,
            emp_esic_rate: req.body.emp_esic_per,
            emp_gr_total: req.body.emp_ttl_salary
        })
        emp.save()

    } else if( req.body.emp_pf === 'on' && req.body.emp_salary > 15000 ) {
        emp_method = 'PF';
        let salary = (req.body.emp_salary - 200);

        const EmployeePF = mongoose.model('pf', empSchema)
        let pf_amt = pf_calculate(salary, req.body.emp_pf_per);
        let esic_amt = esic_calculate(salary, req.body.emp_esic_per);
        const emp = new EmployeePF({
            emp_id: req.body.emp_id,
            emp_acct: req.body.emp_acct,
            emp_name: req.body.emp_name,
            emp_phone: req.body.emp_phone,
            emp_email: req.body.emp_email,
            emp_gender: req.body.emp_gender,
            emp_dob: req.body.emp_dob,
            emp_join_date: req.body.emp_join_date,
            emp_blood_group: req.body.emp_blood_group,
            emp_address: req.body.emp_address,
            emp_counter: req.body.emp_counter,
            emp_job_role: req.body.emp_job_role,
            emp_salary: salary,
            emp_pay_method: req.body.emp_pay_method,
            emp_pf_amt: pf_amt,
            emp_esi_at: esic_amt,
            emp_pf_rate: req.body.emp_pf_per,
            emp_esic_rate: req.body.emp_esic_per
        })
        emp.save()
    }
})

function pf_calculate(salary, pf){
    return Math.round(salary*pf/100);
}

function esic_calculate(salary, esic){
    return Math.round(salary*esic/100);
}

module.exports = app