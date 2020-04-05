const express = require('express');
const Doctor = require('../../models/doctors');

const getUsers = async (req, res, next) => {
    try {

        let doctors = await Doctor.find({});

        if (doctors.length > 0) {
            return res.status(200).json({
                'message': 'users fetched successfully',
                'data': doctors
            });
        }

        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No users found in the system'
        });
    } catch (error) {
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const getUserById = async (req, res, next) => {
    try {
        let doctors = await Doctor.findById(req.params.id);
        if (doctors) {
            return res.status(200).json({
                'message': `user with id ${req.params.id} fetched successfully`,
                'data': doctors
            });
        }

        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No users found in the system'
        });

    } catch (error) {

        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const createUser = async (req, res, next) => {
    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;

        if (name === undefined || name === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'name is required',
                'field': 'name'
            });
        }

        if (email === undefined || email === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'email is required',
                'field': 'email'
            });
        }

        if (password === undefined || password === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'password is required',
                'field': 'password'
            });
        }


        let isEmailExists = await Doctor.findOne({
            "email": email
        });

        if (isEmailExists) {
            return res.status(409).json({
                'code': 'ENTITY_ALREAY_EXISTS',
                'description': 'email already exists',
                'field': 'email'
            });
        }

        const temp = {
            name: name,
            email: email,
            password: password,
            role : role ? role : 'doctor',
            status : false
        }

        let newUser = await Doctor.create(temp);

        if (newUser) {
            return res.status(201).json({
                'message': 'user created successfully',
                'data': newUser
            });
        } else {
            throw new Error('something went worng');
        }
    } catch (error) {
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}


const loginUser = async ( req, res, next) =>{
    console.log(req);
    try{

        const {
            email,
            password
        } = req.body;

        if (email === undefined || email === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'email is required',
                'field': 'email'
            });
        }

        if (password === undefined || password === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'password is required',
                'field': 'password'
            });
        }

        let user = await User.findOne({
            "email": email
        });

        console.log(user);

        if (user) {
            if(user.password === password){
                return res.status(200).json({
                    'message' : 'user logged in successfully',
                    'data': {'email':user.email,'name':user.name, 'role':user.role}
                });
            }else{
                return res.status(401).json({
                    'message' : 'Unauthorised Loggin',
                    'message': 'Please enter the correct username and password'
                });
            }
        }else{
            return res.status(401).json({
                'message' : 'Unauthorised Loggin',
                'message': 'Please enter the correct username and password'
            });
        }

    }catch(error){
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        let isUserExists = await Doctor.findById(userId);

        if (!isUserExists) {
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No user found in the system'
            });
        }
        console.log(isUserExists)
        
        isUserExists.status = !isUserExists.status;

        let updateUser = await Doctor.findByIdAndUpdate(userId, isUserExists, {
            new: true
        });

        if (updateUser) {
            return res.status(200).json({
                'message': 'user updated successfully',
                'data': updateUser
            });
        } else {
            throw new Error('something went worng');
        }
    } catch (error) {

        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const deleteUser = async (req, res, next) => {
    try {
        let user = await Doctor.findByIdAndRemove(req.params.id);
        if (user) {
            return res.status(204).json({
                'message': `user with id ${req.params.id} deleted successfully`
            });
        }

        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No users found in the system'
        });

    } catch (error) {

        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

module.exports = {
    getUsers: getUsers,
    getUserById: getUserById,
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    loginUser: loginUser
}