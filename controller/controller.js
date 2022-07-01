const fetch = require('node-fetch');
const { getHashPassword, generateAuthToken } = require('../middleware/middleware');
const { validationResult } = require('express-validator');

//? model atau collection database
const Employee = require('../model/employee');
const Users = require('../model/user');

//? untuk mendapatkan token
const authTokens = {};

const loginPage = (req, res) => {
    res.status(200);

    if (req.user) {
        res.redirect('/');
    } else {
        res.render('login', {
            layout: 'layouts/mainLayout',
            title: 'Login Account',
        });
    }
};

const login = async (req, res) => {
    res.status(200);
    const { username, password } = req.body;
    const hashedPassword = getHashPassword(password);

    const login = await Users.findOne({
        username: username,
        password: hashedPassword,
    });

    if (login) {
        const authToken = generateAuthToken();
        authTokens[authToken] = login;
        res.cookie('AuthToken', authToken);
        res.redirect('/');
    } else {
        res.render('login', {
            layout: 'layouts/mainLayout',
            title: 'Login Account',
        });
    }
};

const registerPage = (req, res) => {
    res.status(200);

    if (req.user) {
        res.redirect('/');
    } else {
        res.render('register', {
            layout: 'layouts/mainLayout',
            title: 'Register Account'
        });
    }
};

const register = async (req, res) => {
    res.status(200);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('register', {
            layout: 'layouts/mainLayout',
            title: 'Register Account',
            errors: errors.array(),
        });
    } else {
        const hashPassowrd = getHashPassword(req.body.password);
        Users.insertMany({
            name: req.body.name,
            username: req.body.username,
            password: hashPassowrd,
        }, (error, result) => {
            req.flash('msgRegister', 'Register account successfully!');
            res.redirect('/login');
        });
    }
};

const logout = (req, res) => {
    res.status(200);
    res.clearCookie('AuthToken');
    res.redirect('/login');
};

const homePage = (req, res) => {
    res.status(200);

    res.render('index', {
        layout: 'layouts/mainLayout',
        title: 'Home',
        user: req.user.name,
    });
};

const aboutPage = (req, res) => {
    res.status(200);

    res.render('about', {
        layout: 'layouts/mainLayout',
        title: 'About',
        user: req.user.name,
    });
};

const employeePage = async (req, res) => {
    res.status(200);
    const employee = await Employee.find();
    let active = [];
    let inactive = [];
    let suspended = [];

    employee.map((data) => {
        const { status } = data;
        if (status === 'active') {
            return active.push(status);
        } else if (status === 'inactive') {
            return inactive.push(status);
        } else if (status === 'suspended') {
            return suspended.push(status);
        }
        return;
    });

    res.render('employee', {
        layout: 'layouts/mainLayout',
        title: 'Employee',
        user: req.user.name,
        msgAdd: req.flash('messageAdd'),
        msgUpdate: req.flash('msgUpdate'),
        msgDelete: req.flash('msgDelete'),
        msgRegister: req.flash('msgRegister'),
        active: active.length,
        inactive: inactive.length,
        suspended: suspended.length,
        employee,
    });
};

const addEmployeePage = (req, res) => {
    res.status(200);

    res.render('addEmployee', {
        layout: 'layouts/mainLayout',
        title: 'Add Employee',
        user: req.user.name,
    });
};

const addEmployee = async (req, res) => {
    res.status(200);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('addEmployee', {
            layout: 'layouts/mainLayout',
            title: 'Add Employee',
            user: req.user.name,
            errors: errors.array(),
        });
    } else {
        const getData = req.body;
        Employee.insertMany(getData, (error, result) => {
            req.flash('messageAdd', 'Data employee berhasil ditambahkan!');
            res.redirect('/employee');
        });
    }
};

const deleteEmployee = (req, res) => {
    res.status(200);

    Employee.deleteOne({ fullname: req.body.fullname, }, (error, result) => {
        req.flash('msgDelete', 'Data employee berhasil di delete!');
        res.redirect('/employee');
    });
};

const updateEmployeePage = async (req, res) => {
    res.status(200);
    const id = req.params._id;
    const employee = await Employee.findOne({ _id: id });

    res.render('update', {
        layout: 'layouts/mainLayout',
        title: 'Update Employee',
        user: req.user.name,
        employee
    });
};

const updateEmployee = (req, res) => {
    res.status(200);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.render('update', {
            title: 'Update Employee',
            layout: 'layouts/mainLayout',
            user: req.user.name,
            errors: errors.array(),
            employee: req.body
        });
    } else {
        Employee.updateOne(
            {
                _id: req.body._id
            },
            {
                $set: {
                    fullname: req.body.fullname,
                    nip: req.body.nip,
                    phone: req.body.phone,
                    email: req.body.email,
                    address: req.body.address,
                    status: req.body.status,
                    date: req.body.date,
                }
            }
        ).then((error, result) => {
            req.flash('msgUpdate', 'Data employee berhasil di update!');
            res.redirect('/employee');
        });
    }
};

const detailEmployeePage = async (req, res) => {
    res.status(200);

    const detail = await Employee.findOne({
        fullname: req.params.fullname,
    });

    res.render('detail', {
        layout: 'layouts/mainLayout',
        title: 'Detail Employee',
        user: req.user.name,
        detail,
    });
};

const contactPage = (req, res) => {
    res.status(200);

    res.render('contact', {
        layout: 'layouts/mainLayout',
        title: 'Contact',
        user: req.user.name,
    });
};

const teamPage = async (req, res) => {
    res.status(200);

    const users = await fetch('https://jsonplaceholder.typicode.com/users')
        .then((res) => res.json())
        .then((res) => res);

    res.render('team', {
        layout: 'layouts/mainLayout',
        title: 'Team',
        user: req.user.name,
        users: users
    });
};

module.exports = {
    loginPage,
    login,
    registerPage,
    register,
    logout,
    homePage,
    aboutPage,
    employeePage,
    addEmployeePage,
    addEmployee,
    deleteEmployee,
    updateEmployeePage,
    updateEmployee,
    detailEmployeePage,
    contactPage,
    teamPage,
    authTokens,
}