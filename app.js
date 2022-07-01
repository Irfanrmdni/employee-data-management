require('dotenv').config();
require('./utils/db');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const flash = require('connect-flash');
const controller = require('./controller/controller');
const { requireAuth } = require('./middleware/middleware');
const { validasiRegister, validasiAddEmployee, validasiUpdateEmployee } = require('./middleware/validasi');

const app = express();
const port = process.env.port || 3000;

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(flash());
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser('secret'));
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 6000 },
    resave: false,
    saveUninitialized: false,
}));

const authTokens = controller.authTokens;

app.use((req, res, next) => {
    const token = req.cookies['AuthToken'];
    req.user = authTokens[token];
    next();
});

//? Halaman Login
app.get('/login', controller.loginPage);

//* logic halaman login
app.post('/login/user', controller.login);

//? Halaman Register
app.get('/register', controller.registerPage);

//* logic untuk users register
app.post('/register/users', validasiRegister, controller.register);

//? delete auth token dan redirect ke halaman login
app.get('/logout', requireAuth, controller.logout);

//? Halaman Home
app.get('/', requireAuth, controller.homePage);

//? Halaman About
app.get('/about', requireAuth, controller.aboutPage);

//? Halaman employee
app.get('/employee', requireAuth, controller.employeePage);

//* Halaman add data employee
app.get('/addEmployee', requireAuth, validasiAddEmployee, controller.addEmployeePage);

//* add logic post data employee
app.post('/addEmployee/add', requireAuth, controller.addEmployee);

//? logic delete employee
app.delete('/employee', requireAuth, controller.deleteEmployee);

//? Halaman update employee
app.get('/updateEmployee/:_id', requireAuth, controller.updateEmployeePage);

//* Logic update employee
app.put('/update', requireAuth, validasiUpdateEmployee, controller.updateEmployee);

//? Halaman detail employee
app.get('/employee/:fullname', requireAuth, controller.detailEmployeePage);

//? Halaman Contact
app.get('/contact', requireAuth, controller.contactPage);

//? Halaman Team
app.get('/team', requireAuth, controller.teamPage);

app.listen(port, (err) => {
    if (err) {
        throw new Error('Server tidak dapat dijalankan!');
    }
    console.log(`Crud employee | Listening at http://localhost:${port}`);
});