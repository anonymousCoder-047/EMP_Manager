
const express = require('express')
const app = express.Router()
const mongoose = require('mongoose')

const usrSchema = require('../model/schema/Userschema')
const empSchema = require('../model/schema/Empschema')
const attendanceSchema = require('../model/schema/AttendanceSchema')

const Usr = mongoose.model('signup', usrSchema, 'signup')
const Emp = mongoose.model('employees', empSchema)
const Attendance = mongoose.model('attendance', attendanceSchema)

app.get('/', (req, res) => {
    Emp.find({ emp_gender:/^male$/i }, (err, male) => {
        Emp.find({ emp_gender:/^female$/i }, (err, female) => {
            Usr.findOne({ _id: req.session.empId }, (err, usr) => {
                if( usr.is_Admin === 'true' ) {
                    res.render('attendance', { 'message':true, 'msg':"Add Attendance", 'is_Loggedin': true, 'is_Admin': true, 'is_Manager': false, 'male':male, 'female':female })
                } else if( usr.is_Manager === 'true' ) {
                    res.render('attendance', { 'message':true, 'msg':"Add Attendance", 'is_Loggedin': true, 'is_Admin': false, 'is_Manager': true, 'male':male, 'female':female })
                } else {
                    res.render('home', { 'is_Loggedin': true, 'is_Admin': false, 'is_Manager': false })
                }
            })
        })
    })
})

app.get('/get_attendance', (req, res) => {
    Attendance.find((err, attendance) => {
        res.send(attendance)
    })
})

app.post('/', (req, res) => {
    let attendance;
    if(req.body.present < 30 || req.body.present < 31) {
        attendance = new Attendance({
            month:req.body.month,
            day:req.body.day,
            fn_time:req.body.fn_time,
            an_time:req.body.an_time,
            total_leaves:req.body.present
        })
        attendance.save((err, docs) => {
            res.send(docs)
        })
    } else {
        res.send('sorry you have exceeded the value!')
    }
})

module.exports = app