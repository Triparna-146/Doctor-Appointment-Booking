import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'

// API to register user
const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body

        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "enter a strong email" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: 'User does not exist' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
             res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getProfile = async (req, res) => {
    
    try {
        
        const { userId } = req.body
        console.log(userId)
        const userData = await userModel.findById(userId).select('-password')
        console.log('userData')

        res.json({success:true, userData})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

const updateProfile = async (req, res) => {

    try {
        
        const { userId, name, phone, address, dob, gender } = req. body
        const imageFile = req.file
        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }
 
        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender})

        if(imageFile){
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
            const imageUrl = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, {image:imageUrl})
        }

        res.json({success: true, message:'Profile Updated'})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to book appointment
const bookAppointment = async (req, res) => {

    try {
        
        const {userId, docId, slotDate, slotTime} = req.body;

        const docData = await doctorModel.findById(docId).select('-password');

        if(!docData.available){
            return res.json({success: false, message: "Doctor Not Available"});
        }

        let slots_booked = docData.slots_booked
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success: false, message: "Slot Not Available"});
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password');

        delete docData.slots_booked;

        const appointmentData = {
            
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

export { registerUser, loginUser, getProfile, updateProfile }