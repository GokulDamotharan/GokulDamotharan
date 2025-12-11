const router = require("express").Router();
const doctors = require("../models/doctor.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const appointmentImport = require("../models/appointment.model");
const { Doctor, Slot, DateSchedule } = doctors;
const { Appointment, Feedback } = appointmentImport;
const bcrypt = require('../bcrypt/bcrypt');
const upload = require('../middleware/upload.middleware');

function createDate(date) {
	return new DateSchedule({
		date: date,
		slots: [
			new Slot({
				time: "09:00:00",
				isBooked: false,
			}),
			new Slot({
				time: "12:00:00",
				isBooked: false,
			}),
			new Slot({
				time: "15:00:00",
				isBooked: false,
			}),
		],
	});
}

// To get all the doctors
// **ONLY FOR TESTING**
router.route("/").get((req, res) => {
	Doctor.find()
		.then((doctors) => {
			res.json(doctors);
		})
		.catch((err) => {
			res.status(400).json(`Error : ${err}`);
		});
});

// To add a doctor
router.route("/add").post(async (req, res) => {
	try {
		const username = req.body.username; // Required.. can't be undefined
		const password = req.body.password;
		const name = req.body.name;
		const phoneNumber = req.body.phoneNumber;
		const specialization = req.body.specialization;
		const feesPerSession = req.body.feesPerSession;
        const email = req.body.email;
        
        // Personal Details
        const dateOfBirth = req.body.dateOfBirth;
        const gender = req.body.gender;
        const address = req.body.address; // Object with street, city, state, country, postalCode
        
        // Location Information
        const location = req.body.location; // Object with city, state, country, coordinates
        const timezone = req.body.timezone || 'Asia/Kolkata';
        
        // Professional Details
        const qualification = req.body.qualification;
        const experience = req.body.experience;
        
        // License Information
        const licenseNumber = req.body.licenseNumber;
        const issuingAuthority = req.body.issuingAuthority;
        const licenseExpiryDate = req.body.licenseExpiryDate;

		// Check for duplicate email
		const existingDoctorByEmail = await Doctor.findOne({ email: email.toLowerCase().trim() });
		if (existingDoctorByEmail) {
			return res.status(409).json({ 
				message: "A doctor with this email already exists in our platform. Please login or use a different email.",
				field: "email"
			});
		}

		// Check for duplicate phone number (if provided)
		if (phoneNumber) {
			const existingDoctorByPhone = await Doctor.findOne({ phoneNumber: phoneNumber });
			if (existingDoctorByPhone) {
				return res.status(409).json({ 
					message: "A doctor with this phone number already exists in our platform. Please login or use a different phone number.",
					field: "phoneNumber"
				});
			}
		}

		// Hash the password before storing
		const passwordSalt = process.env.PASSWORD_SALT;
		const hashedPassword = bcrypt.hash(password, passwordSalt);

		const newDoctor = new Doctor({
			username,
			password: hashedPassword, // Store the hashed password
			name,
			phoneNumber,
			specialization,
			feesPerSession,
            email: email.toLowerCase().trim(),
            
            // Personal Details
            dateOfBirth,
            gender,
            address,
            
            // Location
            location,
            timezone,
            
            // Professional
            qualification,
            experience,
            
            // License
            licenseNumber,
            issuingAuthority,
            licenseExpiryDate,
            verificationStatus: 'pending' // Default to pending verification
		});

		await newDoctor.save();
		
		// Send welcome email (optional, non-blocking)
		const emailService = require('../utils/emailService');
		emailService.sendWelcomeEmail(email, name).catch(err => {
			console.error('Failed to send welcome email:', err);
		});
		
		res.json("Doctor added successfully");
	} catch (err) {
		console.log(err);
		// Handle MongoDB duplicate key error
		if (err.code === 11000) {
			const field = Object.keys(err.keyPattern)[0];
			return res.status(409).json({ 
				message: `A doctor with this ${field} already exists in our platform.`,
				field: field
			});
		}
		res.status(400).json(`Error : ${err}`);
	}
});

// To update a doctor
router.route("/update").put((req, res) => {
	const username = req.body.username; // Required.. can't be undefined

	Doctor.findOne({ username: username }).then((doctor) => {
		if (doctor) {
			doctor.name = req.body.name;
			doctor.phoneNumber = req.body.phoneNumber;
			doctor.specialization = req.body.specialization;
			doctor.feesPerSession = req.body.feesPerSession;

			doctor
				.save()
				.then(() => {
					res.json("Doctor updated");
					// console.log(`${doctor} updated!`)
				})
				.catch((err) => {
					res.status(400).json(`Error : ${err}`);
					// console.log(err);
				});
		}
	});
});

// Doctor login
router.route("/login").post(async (req, res) => {
	try {
		const emailOrUsername = req.body.email || req.body.username; // Accept both email and username for backward compatibility
		const plainTextPassword = req.body.password;
		const passwordSalt = process.env.PASSWORD_SALT;

		if (!emailOrUsername || !plainTextPassword) {
			return res.status(400).json({ message: "Email and password are required" });
		}

		// Try to find doctor by email first, then by username (for backward compatibility)
		let doctor = await Doctor.findOne({ email: emailOrUsername.toLowerCase().trim() });
		
		if (!doctor) {
			// Fallback to username for existing users
			doctor = await Doctor.findOne({ username: emailOrUsername });
		}

		if (!doctor) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		// Compare the entered password with the stored hashed password
		const isPasswordValid = bcrypt.compare(plainTextPassword, doctor.password, passwordSalt);

		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		// Password is correct, return the token
		const token = jwt.sign(
			JSON.stringify(doctor),
			process.env.KEY, 
			{
				algorithm: process.env.ALGORITHM,
			}
		);

		return res.status(200).json({ token: token.toString() });

	} catch (err) {
		console.log(err);
		return res.status(400).json(err);
	}
});

// Get doctor details by ID
router.route("/getDoctorDetails/:id").get(async (req, res) => {
	try {
		const doctorId = req.params.id;
		const doctor = await Doctor.findById(doctorId).select('-password'); // Exclude password
		
		if (!doctor) {
			return res.status(404).json({ message: "Doctor not found" });
		}
		
		return res.status(200).json(doctor);
	} catch (err) {
		console.log(err);
		return res.status(400).json(err);
	}
});

// To get the slots available for the date
router.route("/get-slots").post(async (req, res) => {
	try {
		const id = req.body.doctorId; // Doctor's id
		const date = req.body.date; // Date to book

		const doctor = await Doctor.findOne({ _id: id });

		// Doctor not found
		if (doctor === null) {
			console.log("Doctor not found in the database!");
			return res.status(201).json({
				message: "Doctor not found in the database!",
			});
		}

		// Doctor found
		// Find the date
		let count = 0;
		for (const i of doctor.dates) {
			if (i.date === date) {
				return res.status(200).json(i);
			}
			count++;
		}

		const oldLength = count;

		// Add new slots if date not found in the db
		const dateSchedule = createDate(date);
		const updatedDoctor = await Doctor.findOneAndUpdate(
			{ _id: doctor._id },
			{ $push: { dates: dateSchedule } },
			{ new: true }
		);

		if (updatedDoctor) {
			return res.status(200).json(updatedDoctor.dates[oldLength]);
		} else {
			const err = { err: "an error occurred!" };
			throw err;
		}
	} catch (err) {
		console.log(err);
		return res.status(400).json({
			message: err,
		});
	}
});

router.route("/book-slot").post((req, res) => {
	const patientId = req.body.googleId; // Patient's google id
	const patientName = req.body.patientName; // Patient's name
	const doctorId = req.body.doctorId; // Doctor's id 606460d2e0dd28cc76d9b0f3 
	const slotId = req.body.slotId; // Id of that particular slot
	const dateId = req.body.dateId; // Id of that particular date
	const meetLink = "";

	Doctor.findOne({ _id: doctorId }).then((doctor) => {
		const date = doctor.dates.id(dateId);
		const slot = date.slots.id(slotId);
		slot.isBooked = true;
		doctor
			.save()
			.then(() => {
				// Create an entry in the appointment database
				const newAppointment = new Appointment({
					doctorId,
					dateId,
					slotId,
					patientId,
					date: date.date,
					slotTime: slot.time,
					doctorName: doctor.name,
					doctorEmail: doctor.email,
					patientName: patientName,
					googleMeetLink: meetLink,
					feedback: new Feedback()
				});

				console.log(newAppointment);

				newAppointment
					.save()
					.then((appointment) => {
						return res.status(200).json(appointment);
					})
					.catch((err) => {
						console.log(err);
						res.status(400).json(err);
					});
			})
			.catch((err) => {
				console.log(err);
				res.status(400).json({
					message: `An error occurred : ${err}`,
				});
			});
	});
});

router.route("/appointments").post(async (req, res) => {
	try {
		const doctorId = req.body.doctorId;
		const appointments = await Appointment.find({
			doctorId: doctorId,
		});
		// res.status(200).json(appointments);
		const sortedAppointments = appointments.sort((a, b) => {
			return (
				Date.parse(b.date + "T" + b.slotTime) -
				Date.parse(a.date + "T" + a.slotTime)
			);
		});

		res.status(200).json(sortedAppointments);
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
});

router.route("/appointment/:id").get(async (req, res) => {
	try {
		const appointmentId = req.params.id;
		const appointment = await Appointment.findOne({
			_id: appointmentId,
		});

		res.status(200).json(appointment);
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
});

router.route('/todays-appointments').post(async (req, res) => {
	try {
		const date = new Date()
		let currDate = date.getFullYear().toString()
		const month = date.getMonth() + 1
		const day = date.getDate()

		currDate += month < 10 ? ('-0' + month.toString()) : '-' + month.toString()
		currDate += day < 10 ? ('-0' + day.toString()) : '-' + day.toString()

		const doctorId = req.body.doctorId;

		const appointments = await Appointment.find({ doctorId: doctorId, date: currDate });

		const sortedAppointments = appointments.sort((a, b) => {
			return (
				Date.parse(a.date + "T" + a.slotTime) - Date.parse(b.date + "T" + b.slotTime)
			);
		});

		res.status(200).json(sortedAppointments);
	}
	catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
})

router.route('/previous-appointments').post(async (req, res) => {
	try {
		const doctorId = req.body.doctorId;

		const appointments = await Appointment.find({ doctorId: doctorId });

		// Get current dateTime
		const date = new Date()
		let currDateTime = date.getFullYear().toString()
		const month = date.getMonth() + 1
		const day = date.getDate()
		const hour = date.getHours()
		const minutes = date.getMinutes()
		const seconds = date.getSeconds()

		currDateTime += month < 10 ? ('-0' + month.toString()) : '-' + month.toString()
		currDateTime += day < 10 ? ('-0' + day.toString()) : '-' + day.toString()
		currDateTime += hour < 10 ? ('T0' + hour.toString()) : 'T' + hour.toString()
		currDateTime += minutes < 10 ? (':0' + minutes.toString()) : ':' + minutes.toString()
		currDateTime += seconds < 10 ? (':0' + seconds.toString()) : ':' + seconds.toString()

		const filteredAppointments = appointments.filter((appointment) => {
			return Date.parse(currDateTime) >= Date.parse(appointment.date + 'T' + appointment.slotTime)
		})

		const sortedAppointments = filteredAppointments.sort((a, b) => {
			return Date.parse(b.date + 'T' + b.slotTime) - Date.parse(a.date + 'T' + a.slotTime)
		})

		res.status(200).json(sortedAppointments);
	}
	catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
})

// Upload license document
router.route('/upload-license').post(upload.single('licenseDocument'), async (req, res) => {
	try {
		const doctorId = req.body.doctorId;
		
		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded' });
		}
		
		const filePath = req.file.path;
		
		// Update doctor record with file path
		const doctor = await Doctor.findByIdAndUpdate(
			doctorId,
			{ licenseDocument: filePath },
			{ new: true }
		);
		
		if (!doctor) {
			return res.status(404).json({ message: 'Doctor not found' });
		}
		
		res.status(200).json({ 
			message: 'License document uploaded successfully',
			filePath: filePath
		});
	} catch (err) {
		console.log(err);
		res.status(400).json({ message: `Error: ${err}` });
	}
});

// Verify doctor license (Admin endpoint)
router.route('/verify-license').post(async (req, res) => {
	try {
		const doctorId = req.body.doctorId;
		const verificationStatus = req.body.verificationStatus; // 'verified', 'rejected', 'expired'
		const verificationNotes = req.body.verificationNotes;
		
		const doctor = await Doctor.findByIdAndUpdate(
			doctorId,
			{
				verificationStatus: verificationStatus,
				verificationDate: new Date(),
				verificationNotes: verificationNotes
			},
			{ new: true }
		);
		
		if (!doctor) {
			return res.status(404).json({ message: 'Doctor not found' });
		}
		
		res.status(200).json({
			message: 'Verification status updated successfully',
			doctor: doctor
		});
	} catch (err) {
		console.log(err);
		res.status(400).json({ message: `Error: ${err}` });
	}
});

// Get doctors by location
router.route('/by-location').get(async (req, res) => {
	try {
		const city = req.query.city;
		const state = req.query.state;
		const country = req.query.country;
		
		let query = { verificationStatus: 'verified' }; // Only show verified doctors
		
		if (city) {
			query['location.city'] = new RegExp(city, 'i'); // Case-insensitive search
		}
		if (state) {
			query['location.state'] = new RegExp(state, 'i');
		}
		if (country) {
			query['location.country'] = new RegExp(country, 'i');
		}
		
		const doctors = await Doctor.find(query).select('-password');
		
		res.status(200).json(doctors);
	} catch (err) {
		console.log(err);
		res.status(400).json({ message: `Error: ${err}` });
	}
});

// Update doctor profile (enhanced)
router.route('/update-profile').put(async (req, res) => {
	try {
		const doctorId = req.body.doctorId;
		
		// Fields that can be updated by doctor
		const updateFields = {
			name: req.body.name,
			phoneNumber: req.body.phoneNumber,
			specialization: req.body.specialization,
			feesPerSession: req.body.feesPerSession,
			dateOfBirth: req.body.dateOfBirth,
			gender: req.body.gender,
			address: req.body.address,
			location: req.body.location,
			timezone: req.body.timezone,
			qualification: req.body.qualification,
			experience: req.body.experience
		};
		
		// Remove undefined fields
		Object.keys(updateFields).forEach(key => 
			updateFields[key] === undefined && delete updateFields[key]
		);
		
		const doctor = await Doctor.findByIdAndUpdate(
			doctorId,
			updateFields,
			{ new: true }
		).select('-password');
		
		if (!doctor) {
			return res.status(404).json({ message: 'Doctor not found' });
		}
		
		res.status(200).json({
			message: 'Profile updated successfully',
			doctor: doctor
		});
	} catch (err) {
		console.log(err);
		res.status(400).json({ message: `Error: ${err}` });
	}
});

// ============================================
// SLOT MANAGEMENT ENDPOINTS FOR DOCTORS
// ============================================

// Add time slots for a specific date
router.route("/add-slots").post(async (req, res) => {
	try {
		const { doctorId, date, slots } = req.body;

		if (!doctorId || !date || !slots || !Array.isArray(slots)) {
			return res.status(400).json({ message: "Invalid request data" });
		}

		const doctor = await Doctor.findById(doctorId);
		if (!doctor) {
			return res.status(404).json({ message: "Doctor not found" });
		}

		// Find if date already exists
		let dateEntry = doctor.dates.find(d => d.date === date);

		if (dateEntry) {
			// Date exists, add new slots (avoid duplicates)
			const existingTimes = dateEntry.slots.map(s => s.time);
			const newSlots = slots.filter(slot => !existingTimes.includes(slot.time));
			
			if (newSlots.length === 0) {
				return res.status(409).json({ message: "All slots already exist for this date" });
			}

			dateEntry.slots.push(...newSlots.map(slot => ({
				time: slot.time,
				isBooked: false,
				isAvailable: true
			})));

			await doctor.save();
			return res.status(200).json({
				message: "Slots added successfully",
				dateId: dateEntry._id,
				addedSlots: newSlots.length
			});
		} else {
			// Date doesn't exist, create new date entry
			const newDate = {
				date: date,
				slots: slots.map(slot => ({
					time: slot.time,
					isBooked: false,
					isAvailable: true
				}))
			};

			doctor.dates.push(newDate);
			await doctor.save();

			const addedDate = doctor.dates[doctor.dates.length - 1];
			return res.status(200).json({
				message: "Date and slots created successfully",
				dateId: addedDate._id,
				addedSlots: slots.length
			});
		}
	} catch (err) {
		console.error("Error adding slots:", err);
		return res.status(400).json({ message: `Error: ${err.message}` });
	}
});

// Toggle slot availability (enable/disable)
router.route("/toggle-slot-availability").put(async (req, res) => {
	try {
		const { doctorId, dateId, slotId, isAvailable } = req.body;

		if (!doctorId || !dateId || !slotId || typeof isAvailable !== 'boolean') {
			return res.status(400).json({ message: "Invalid request data" });
		}

		const doctor = await Doctor.findById(doctorId);
		if (!doctor) {
			return res.status(404).json({ message: "Doctor not found" });
		}

		const dateEntry = doctor.dates.id(dateId);
		if (!dateEntry) {
			return res.status(404).json({ message: "Date not found" });
		}

		const slot = dateEntry.slots.id(slotId);
		if (!slot) {
			return res.status(404).json({ message: "Slot not found" });
		}

		// Cannot modify booked slots
		if (slot.isBooked) {
			return res.status(403).json({ 
				message: "Cannot modify availability of booked slot",
				patientName: slot.patientName
			});
		}

		slot.isAvailable = isAvailable;
		await doctor.save();

		return res.status(200).json({
			message: `Slot ${isAvailable ? 'enabled' : 'disabled'} successfully`,
			slot: slot
		});
	} catch (err) {
		console.error("Error toggling slot availability:", err);
		return res.status(400).json({ message: `Error: ${err.message}` });
	}
});

// Remove a slot (with cancellation reason if booked)
router.route("/remove-slot").delete(async (req, res) => {
	try {
		const { doctorId, dateId, slotId, cancellationReason } = req.body;

		if (!doctorId || !dateId || !slotId) {
			return res.status(400).json({ message: "Invalid request data" });
		}

		const doctor = await Doctor.findById(doctorId);
		if (!doctor) {
			return res.status(404).json({ message: "Doctor not found" });
		}

		const dateEntry = doctor.dates.id(dateId);
		if (!dateEntry) {
			return res.status(404).json({ message: "Date not found" });
		}

		const slot = dateEntry.slots.id(slotId);
		if (!slot) {
			return res.status(404).json({ message: "Slot not found" });
		}

		// If slot is booked, require cancellation reason
		if (slot.isBooked) {
			if (!cancellationReason || cancellationReason.trim().length < 10) {
				return res.status(400).json({ 
					message: "Cancellation reason is required (minimum 10 characters) for booked slots"
				});
			}

			// Store cancellation info in appointment
			const Appointment = require('../models/appointment.model');
			try {
				const appointment = await Appointment.findOne({
					doctorId: doctorId,
					date: dateEntry.date,
					slotTime: slot.time,
					status: { $ne: 'cancelled' }
				});

				if (appointment) {
					appointment.status = 'cancelled';
					appointment.cancellationReason = cancellationReason;
					appointment.cancelledBy = 'doctor';
					appointment.cancelledAt = new Date();
					await appointment.save();

					// TODO: Send notification to patient
					// This could be email, SMS, or in-app notification
					console.log(`Appointment cancelled for patient: ${slot.patientName}`);
					console.log(`Reason: ${cancellationReason}`);
				}
			} catch (err) {
				console.error("Error updating appointment:", err);
			}
		}

		// Remove the slot using pull() method
		dateEntry.slots.pull(slotId);
		await doctor.save();

		return res.status(200).json({
			message: slot.isBooked 
				? "Appointment cancelled and slot removed successfully" 
				: "Slot removed successfully",
			wasBooked: slot.isBooked,
			patientName: slot.patientName,
			remainingSlots: dateEntry.slots.length
		});
	} catch (err) {
		console.error("Error removing slot:", err);
		return res.status(400).json({ message: `Error: ${err.message}` });
	}
});

// Get doctor's slots for a date range or specific date
router.route("/my-slots").get(async (req, res) => {
	try {
		const { doctorId, date, startDate, endDate } = req.query;

		if (!doctorId) {
			return res.status(400).json({ message: "Doctor ID is required" });
		}

		const doctor = await Doctor.findById(doctorId);
		if (!doctor) {
			return res.status(404).json({ message: "Doctor not found" });
		}

		let filteredDates = doctor.dates;

		// Filter by specific date
		if (date) {
			filteredDates = doctor.dates.filter(d => d.date === date);
		}
		// Filter by date range
		else if (startDate && endDate) {
			filteredDates = doctor.dates.filter(d => {
				return d.date >= startDate && d.date <= endDate;
			});
		}

		// Sort by date
		filteredDates.sort((a, b) => new Date(a.date) - new Date(b.date));

		return res.status(200).json({
			doctorId: doctor._id,
			doctorName: doctor.name,
			dates: filteredDates
		});
	} catch (err) {
		console.error("Error fetching doctor slots:", err);
		return res.status(400).json({ message: `Error: ${err.message}` });
	}
});

// ============================================
// PASSWORD RESET ENDPOINTS
// ============================================

// Forgot Password - Request password reset
router.route("/forgot-password").post(async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ message: "Email is required" });
		}

		// Find doctor by email
		const doctor = await Doctor.findOne({ email: email.toLowerCase().trim() });

		if (!doctor) {
			// Don't reveal if email exists or not (security best practice)
			return res.status(200).json({ 
				message: "If an account with that email exists, a password reset link has been sent." 
			});
		}

		// Generate reset token
		const crypto = require('crypto');
		const resetToken = crypto.randomBytes(32).toString('hex');
		
		// Hash token before storing (security best practice)
		const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

		// Set token and expiration (1 hour)
		doctor.passwordResetToken = hashedToken;
		doctor.passwordResetExpires = Date.now() + 3600000; // 1 hour

		await doctor.save();

		// Send email with reset link
		const emailService = require('../utils/emailService');
		await emailService.sendPasswordResetEmail(email, resetToken, doctor.name);

		return res.status(200).json({ 
			message: "If an account with that email exists, a password reset link has been sent." 
		});

	} catch (err) {
		console.error("Error in forgot password:", err);
		return res.status(500).json({ message: "An error occurred. Please try again later." });
	}
});

// Reset Password - Complete password reset
router.route("/reset-password").post(async (req, res) => {
	try {
		const { token, newPassword } = req.body;

		if (!token || !newPassword) {
			return res.status(400).json({ message: "Token and new password are required" });
		}

		// Validate password strength
		if (newPassword.length < 6) {
			return res.status(400).json({ message: "Password must be at least 6 characters long" });
		}

		// Hash the token to compare with stored hash
		const crypto = require('crypto');
		const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

		// Find doctor with valid token
		const doctor = await Doctor.findOne({
			passwordResetToken: hashedToken,
			passwordResetExpires: { $gt: Date.now() } // Token not expired
		});

		if (!doctor) {
			return res.status(400).json({ 
				message: "Password reset token is invalid or has expired. Please request a new password reset." 
			});
		}

		// Hash new password
		const passwordSalt = process.env.PASSWORD_SALT;
		const hashedPassword = bcrypt.hash(newPassword, passwordSalt);

		// Update password and clear reset token
		doctor.password = hashedPassword;
		doctor.passwordResetToken = undefined;
		doctor.passwordResetExpires = undefined;

		await doctor.save();

		return res.status(200).json({ 
			message: "Password has been reset successfully. You can now login with your new password." 
		});

	} catch (err) {
		console.error("Error in reset password:", err);
		return res.status(500).json({ message: "An error occurred. Please try again later." });
	}
});

module.exports = router;

