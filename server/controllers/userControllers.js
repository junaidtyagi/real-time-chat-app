const jwt = require('jsonwebtoken')
const User = require('./../models/user')
const cloudinary = require('./../config/cloudinary')

exports.loggedInUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });

        return res.status(200).json({
            status: "success",
            message: "user fetched successfully ",
            data: user
        })

    } catch (error) {
        return res.status(400).json({
            status: "failled",
            message: "user does not exist "
        })

    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const userid = req.body.userId;
        const allUsers = await User.find({ _id: { $ne: userid } });

        res.status(200).json({
            status: "success",
            message: " all users fetched successfully ",
            data: [
                allUsers
            ]
        })

    } catch (error) {
        return res.status(400).json({
            status: "failled",
            message: "user does not exist "
        })

    }
}

exports.profilePicUpload = async (req, res) => {
    try {
        const image = req.body.image;
        // UPLOAD THE IMAGE URL IN CLOUDINARY 
        const uploadedImage = await cloudinary.uploader.upload(image, {
            folder: 'quick-chat'
        });


        // UPLOADE THE IMAGE AND UPDATE THE PROFILE PIC PROPERTY IN USER MODEL
        const user = await User.findByIdAndUpdate(
            { _id: req.body.userId },
            { profilePic: uploadedImage.secure_url },
            { new: true }
        );
        res.json({
            status: "success",
            message: "Pic uploaded Successfully ",
            data: user
        })
    } catch (error) {
        return res.status(400).json({
            status: "failled",
            message: "profile does not uploaded"
        })
    }
}