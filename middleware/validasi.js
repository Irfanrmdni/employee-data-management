const { body, check } = require('express-validator');
const Employee = require('../model/employee');
const Users = require('../model/user');

const validasiRegister = [
    body('username').custom(async (value) => {
        const duplicate = await Users.findOne({ username: value });

        if (duplicate) {
            throw new Error('invalid username dan username sudah digunakan!');
        }

        return true;
    }).isEmail(),
    check('password', 'Password minimal 6 karakter dan harus memiliki angka!')
        .isLength({ min: 6 })
        .isAlphanumeric()
        .notEmpty(),
];

const validasiAddEmployee = [
    body('fullname').custom(async (value, { req }) => {
        const duplicate = await Employee.findOne({ fullname: value });
        if (duplicate) {
            throw new Error('Nama sudah tersedia! gunakan nama lain.');
        }

        return true;
    }),
    check('nip', 'Nip harus berisi 6 angka').isLength({ max: 6 }),
    check('email', 'Email tidak valid!').isEmail(),
    check('phone', 'Nomor HP tidak valid').isMobilePhone('id-ID')
];
const validasiUpdateEmployee = [
    body('fullname').custom(async (value, { req }) => {
        const duplicate = await Employee.findOne({ fullname: value });
        if (value !== req.body.oldFullname && duplicate) {
            throw new Error('Nama sudah tersedia! gunakan nama lain.');
        }

        return true;
    }),
    check('nip', 'Nip harus berisi 6 angka').isLength({ min: 6 }),
    check('email', 'Email tidak valid!').isEmail(),
    check('phone', 'Nomor HP tidak valid').isMobilePhone('id-ID')
];

module.exports = {
    validasiRegister,
    validasiAddEmployee,
    validasiUpdateEmployee
};