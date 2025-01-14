const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// create a connection variable
const con = mysql.createConnection({
    // host: 'database', // server ip address
    host: '3.83.120.177',
    port: '3306',
    user: 'dbuser', // user name
    password: 'dbuserpwd', // password
    // database: 'teamformationassistant', // database name
    database: 'teamformation'
});

// connect to the database.
con.connect((err) => {
    if (err) throw err;
    // if connection successful
    console.log('connection successful!!!');
});
router.get('/', (req, res) => {
    con.query('SELECT * from Member', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log('Error while performing Query.');
        }
    });
});

router.post('/', (req, res) => {
    const records = [[req.body.name, req.body.hourlyrate, req.body.dob,
      req.body.languages, 0, req.body.memberrole, req.body.experience, req.body.skillscore, req.body.availablehoursperweek]];
    if (records[0][0] != null) {
      con.query('INSERT INTO Member (MemberName,HourlyRate,DOB,Languages,IsAssigned,MemberRole,Experience,SkillScore,AvailableHoursPerWeek) VALUES ?', [records], (err, res, fields) => {
        if (err) throw err;
  
        console.log(res);
      });
    }
    // res.json('Form received...Thank You for signing up :D');
    return res.redirect('http://localhost:3000/add_member_success');
  });

module.exports = router;