const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

var corsOptions = {
    origin: "http://3.83.120.177:3000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api/test/teams', require('./app/routes/team.routes'))
app.use('/api/test/members', require('./app/routes/member.routes'))
app.use('/api/test/candidates', require('./app/routes/candidate.routes'))
// database
const db = require("./app/models");
const Role = db.role;

const mysql = require('mysql2')
const dbConfig = require('./app/config/db.config')

// create a connection variable
const con = mysql.createConnection({
    host: 'database', // server ip address
    port: '3306',
    user: 'dbuser', // user name
    password: 'dbuserpwd', // password
    database: 'teamformationassistant'
});

// connect to the database.
con.connect((err) => {
    if (err) throw err;
    // if connection successful
    console.log('connection successful!!!');
});

// simple route
app.get("/", (req, res) => {
    res.json({message: "Welcome to Teamformation Assistant."});
});
app.post('/add_member', (req, res) => {
    const records = [[req.body.name, req.body.hourlyrate, req.body.dob,
      req.body.languages, 0, req.body.memberrole, req.body.experience, req.body.skillscore, req.body.availablehoursperweek]];
    if (records[0][0] != null) {
      con.query('INSERT INTO Member (MemberName,HourlyRate,DOB,Languages,IsAssigned,MemberRole,Experience,SkillScore,AvailableHoursPerWeek) VALUES ?', [records], (err, res, fields) => {
        if (err) throw err;
  
        console.log(res);
      });
    }
    // res.json('Form received...Thank You for signing up :D');
    return res.redirect('http://3.83.120.177:3000/members');
  });


// routes



app.post('/ProjectDetails', (req, res) => {
    console.log(req.body);
    var records = [[req.body.name, req.body.enddate, req.body.teamsize, req.body.budget, req.body.tools, req.body.priority, 0]];
    console.log(records);
    if (records[0][0] != null) {
        con.query('INSERT INTO Project (ProjectName,ProjectEndDate,ProjectTeamSize,Budget,Tools,Priority,IsAssignmentComplete) VALUES ?', [records], (err, res, fields) => {
            if (err) throw err;

            console.log(res);
        });

        let i = 0;
        let colname = `languagepreferred${i}`;

        while (colname in req.body) {
            var records = [[req.body.languagepreferred0, Number(req.body.skill0), req.body.memberrole0, Number(req.body.availablehoursperweek0), Number(req.body.skillweight[i]), Number(req.body.experienceweight[i]), Number(req.body.hoursweight[i]), Number(req.body.languageweight[i]), Number(req.body.budgetweight[i])]];
            console.log(records);
            con.query('CALL populateRequirements ?', [records], (err, res, fields) => {
                if (err) throw err;

                console.log(res);
            });
            i += 1;
            colname = `languagepreferred${i}`;
        }
    }

    // res.json('Form received...Thank You for signing up :D');

    // execute the algorithm from here
    fetch('http://3.83.120.177:5000/executeAlgo');

    return res.redirect('http://3.83.120.177:3000/TeamFormationAssistant/ProjectDetails/Success');
});

app.post('/JobDetails', (req, res) => {
    console.log(req.body);
    var records = [[req.body.name, req.body.projectid, req.body.jobphone, req.body.jobrole, req.body.description, req.body.jobaddress]];
    console.log(records);
    if (records[0][0] != null) {
        con.query('INSERT INTO Job (JobName, ProjectId, JobPhone, JobRole, Description, JobAddress) VALUES ?', [records], (err, res, fields) => {
            if (err) throw err;

            console.log(res);
        });
    }

    // execute the algorithm from here
    fetch('http://3.83.120.177:5000/executeAlgo');

    return res.redirect('http://3.83.120.177:3000/TeamFormationAssistant/JobDetails/Success');
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

function initial() {
    Role.create({
        id: 1,
        name: "user"
    });

    Role.create({
        id: 2,
        name: "manager"
    });

    Role.create({
        id: 3,
        name: "admin"
    });
}