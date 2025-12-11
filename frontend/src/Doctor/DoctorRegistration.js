import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Mail, Lock, Calendar, MapPin, Stethoscope, 
    Award, DollarSign, FileText, Upload, CheckCircle,
    ArrowRight, ArrowLeft, AlertCircle
} from 'lucide-react';
import Navbar from '../Basic/Navbar';
import '../index.css';

const DoctorRegistration = () => {
    const history = useHistory();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Account Credentials
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        
        // Step 2: Personal Details
        name: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
        address: {
            street: '',
            city: '',
            state: '',
            country: '',
            postalCode: ''
        },
        
        // Step 3: Professional Details
        specialization: '',
        qualification: '',
        experience: '',
        feesPerSession: '',
        
        // Step 4: Location Information
        location: {
            city: '',
            state: '',
            country: '',
            coordinates: {
                latitude: '',
                longitude: ''
            }
        },
        timezone: 'Asia/Kolkata',
        
        // Step 5: License Verification
        licenseNumber: '',
        issuingAuthority: '',
        licenseExpiryDate: '',
        licenseDocument: null
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const totalSteps = 5;

    const issuingAuthorities = [
        'Medical Council of India (MCI)',
        'National Medical Commission (NMC)',
        'State Medical Council',
        'American Medical Association (AMA)',
        'General Medical Council (GMC)',
        'Other'
    ];

    const specializations = [
        'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics',
        'Pediatrics', 'Psychiatry', 'General Medicine', 'Surgery',
        'Gynecology', 'Ophthalmology', 'ENT', 'Other'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else if (name.includes('coordinates.')) {
            const coord = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    coordinates: {
                        ...prev.location.coordinates,
                        [coord]: value
                    }
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({ 
                    ...prev, 
                    licenseDocument: 'Only PDF, JPG, and PNG files are allowed' 
                }));
                return;
            }
            
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ 
                    ...prev, 
                    licenseDocument: 'File size must be less than 5MB' 
                }));
                return;
            }
            
            setFormData(prev => ({ ...prev, licenseDocument: file }));
            setErrors(prev => ({ ...prev, licenseDocument: '' }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};
        
        switch(step) {
            case 1:
                if (!formData.username) newErrors.username = 'Username is required';
                if (!formData.email) newErrors.email = 'Email is required';
                if (!formData.password) newErrors.password = 'Password is required';
                if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Passwords do not match';
                }
                break;
            case 2:
                if (!formData.name) newErrors.name = 'Name is required';
                if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
                if (!formData.address.city) newErrors['address.city'] = 'City is required';
                if (!formData.address.state) newErrors['address.state'] = 'State is required';
                if (!formData.address.country) newErrors['address.country'] = 'Country is required';
                break;
            case 3:
                if (!formData.specialization) newErrors.specialization = 'Specialization is required';
                if (!formData.qualification) newErrors.qualification = 'Qualification is required';
                if (!formData.feesPerSession) newErrors.feesPerSession = 'Fees per session is required';
                break;
            case 4:
                if (!formData.location.city) newErrors['location.city'] = 'City is required';
                if (!formData.location.state) newErrors['location.state'] = 'State is required';
                if (!formData.location.country) newErrors['location.country'] = 'Country is required';
                break;
            case 5:
                if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
                if (!formData.issuingAuthority) newErrors.issuingAuthority = 'Issuing authority is required';
                if (!formData.licenseExpiryDate) newErrors.licenseExpiryDate = 'License expiry date is required';
                break;
            default:
                break;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateStep(currentStep)) {
            return;
        }
        
        setIsSubmitting(true);
        setErrors({}); // Clear previous errors
        
        try {
            // First, register the doctor
            const registrationData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                address: formData.address,
                location: formData.location,
                timezone: formData.timezone,
                specialization: formData.specialization,
                qualification: formData.qualification,
                experience: parseInt(formData.experience) || 0,
                feesPerSession: formData.feesPerSession,
                licenseNumber: formData.licenseNumber,
                issuingAuthority: formData.issuingAuthority,
                licenseExpiryDate: formData.licenseExpiryDate
            };
            
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL || 'http://localhost:5001'}/doctors/add`,
                registrationData
            );
            
            // If there's a license document, upload it
            if (formData.licenseDocument && response.data) {
                // We need to get the doctor ID from login or another way
                // For now, we'll show success and ask them to upload after login
                alert('Registration successful! Please login and upload your license document from your profile.');
            } else {
                alert('Registration successful! Please login to continue.');
            }
            
            history.push('/doctorlogin');
            
        } catch (err) {
            console.error(err);
            
            // Handle duplicate registration errors
            if (err.response?.status === 409) {
                const errorData = err.response.data;
                const errorMessage = errorData.message || 'This information is already registered.';
                const errorField = errorData.field;
                
                // Set error for specific field
                if (errorField === 'email') {
                    setErrors({ email: errorMessage });
                    setCurrentStep(1); // Go back to step 1 where email is
                } else if (errorField === 'phoneNumber') {
                    setErrors({ phoneNumber: errorMessage });
                    setCurrentStep(2); // Go back to step 2 where phone is
                } else {
                    alert(errorMessage);
                }
            } else {
                // Generic error
                const errorMessage = err.response?.data?.message || err.response?.data || 'Registration failed. Please try again.';
                alert(errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch(currentStep) {
            case 1:
                return (
                    <div className="row">
                        <div className="col-12 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                <User size={18} className="me-2" />Username *
                            </label>
                            <input
                                type="text"
                                name="username"
                                className="form-control glass-input"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Choose a username"
                            />
                            {errors.username && <small className="text-danger">{errors.username}</small>}
                        </div>
                        
                        <div className="col-12 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                <Mail size={18} className="me-2" />Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="form-control glass-input"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="your.email@example.com"
                            />
                            {errors.email && <small className="text-danger">{errors.email}</small>}
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                <Lock size={18} className="me-2" />Password *
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="form-control glass-input"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                            />
                            {errors.password && <small className="text-danger">{errors.password}</small>}
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                <Lock size={18} className="me-2" />Confirm Password *
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control glass-input"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                        </div>
                    </div>
                );
                
            case 2:
                return (
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                <User size={18} className="me-2" />Full Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="form-control glass-input"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Dr. John Doe"
                            />
                            {errors.name && <small className="text-danger">{errors.name}</small>}
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                <Calendar size={18} className="me-2" />Date of Birth
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                className="form-control glass-input"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                            />
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                Gender
                            </label>
                            <select
                                name="gender"
                                className="form-control glass-input"
                                value={formData.gender}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                className="form-control glass-input"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="+91 1234567890"
                            />
                            {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber}</small>}
                        </div>
                        
                        <div className="col-12 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                <MapPin size={18} className="me-2" />Street Address
                            </label>
                            <input
                                type="text"
                                name="address.street"
                                className="form-control glass-input"
                                value={formData.address.street}
                                onChange={handleInputChange}
                                placeholder="123 Main Street"
                            />
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                City *
                            </label>
                            <input
                                type="text"
                                name="address.city"
                                className="form-control glass-input"
                                value={formData.address.city}
                                onChange={handleInputChange}
                                placeholder="Mumbai"
                            />
                            {errors['address.city'] && <small className="text-danger">{errors['address.city']}</small>}
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                State *
                            </label>
                            <input
                                type="text"
                                name="address.state"
                                className="form-control glass-input"
                                value={formData.address.state}
                                onChange={handleInputChange}
                                placeholder="Maharashtra"
                            />
                            {errors['address.state'] && <small className="text-danger">{errors['address.state']}</small>}
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                Country *
                            </label>
                            <input
                                type="text"
                                name="address.country"
                                className="form-control glass-input"
                                value={formData.address.country}
                                onChange={handleInputChange}
                                placeholder="India"
                            />
                            {errors['address.country'] && <small className="text-danger">{errors['address.country']}</small>}
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                Postal Code
                            </label>
                            <input
                                type="text"
                                name="address.postalCode"
                                className="form-control glass-input"
                                value={formData.address.postalCode}
                                onChange={handleInputChange}
                                placeholder="400001"
                            />
                        </div>
                    </div>
                );
                
            case 3:
                return (
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                <Stethoscope size={18} className="me-2" />Specialization *
                            </label>
                            <select
                                name="specialization"
                                className="form-control glass-input"
                                value={formData.specialization}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Specialization</option>
                                {specializations.map(spec => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                            {errors.specialization && <small className="text-danger">{errors.specialization}</small>}
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                <Award size={18} className="me-2" />Qualification *
                            </label>
                            <input
                                type="text"
                                name="qualification"
                                className="form-control glass-input"
                                value={formData.qualification}
                                onChange={handleInputChange}
                                placeholder="MBBS, MD"
                            />
                            {errors.qualification && <small className="text-danger">{errors.qualification}</small>}
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                Experience (Years)
                            </label>
                            <input
                                type="number"
                                name="experience"
                                className="form-control glass-input"
                                value={formData.experience}
                                onChange={handleInputChange}
                                placeholder="5"
                                min="0"
                            />
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                <DollarSign size={18} className="me-2" />Fees Per Session *
                            </label>
                            <input
                                type="number"
                                name="feesPerSession"
                                className="form-control glass-input"
                                value={formData.feesPerSession}
                                onChange={handleInputChange}
                                placeholder="500"
                                min="0"
                            />
                            {errors.feesPerSession && <small className="text-danger">{errors.feesPerSession}</small>}
                        </div>
                    </div>
                );
                
            case 4:
                return (
                    <div className="row">
                        <div className="col-12 mb-3">
                            <div className="alert" style={{ 
                                background: 'var(--glass-bg)',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--color-text-secondary)'
                            }}>
                                <AlertCircle size={18} className="me-2" />
                                This location will be used to help patients find doctors near them.
                            </div>
                        </div>
                        
                        <div className="col-md-4 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                <MapPin size={18} className="me-2" />City *
                            </label>
                            <input
                                type="text"
                                name="location.city"
                                className="form-control glass-input"
                                value={formData.location.city}
                                onChange={handleInputChange}
                                placeholder="Mumbai"
                            />
                            {errors['location.city'] && <small className="text-danger">{errors['location.city']}</small>}
                        </div>
                        
                        <div className="col-md-4 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                State *
                            </label>
                            <input
                                type="text"
                                name="location.state"
                                className="form-control glass-input"
                                value={formData.location.state}
                                onChange={handleInputChange}
                                placeholder="Maharashtra"
                            />
                            {errors['location.state'] && <small className="text-danger">{errors['location.state']}</small>}
                        </div>
                        
                        <div className="col-md-4 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                Country *
                            </label>
                            <input
                                type="text"
                                name="location.country"
                                className="form-control glass-input"
                                value={formData.location.country}
                                onChange={handleInputChange}
                                placeholder="India"
                            />
                            {errors['location.country'] && <small className="text-danger">{errors['location.country']}</small>}
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                Latitude (Optional)
                            </label>
                            <input
                                type="number"
                                name="coordinates.latitude"
                                className="form-control glass-input"
                                value={formData.location.coordinates.latitude}
                                onChange={handleInputChange}
                                placeholder="19.0760"
                                step="any"
                            />
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                Longitude (Optional)
                            </label>
                            <input
                                type="number"
                                name="coordinates.longitude"
                                className="form-control glass-input"
                                value={formData.location.coordinates.longitude}
                                onChange={handleInputChange}
                                placeholder="72.8777"
                                step="any"
                            />
                        </div>
                    </div>
                );
                
            case 5:
                return (
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                <FileText size={18} className="me-2" />License Number *
                            </label>
                            <input
                                type="text"
                                name="licenseNumber"
                                className="form-control glass-input"
                                value={formData.licenseNumber}
                                onChange={handleInputChange}
                                placeholder="MCI-12345"
                            />
                            {errors.licenseNumber && <small className="text-danger">{errors.licenseNumber}</small>}
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                Issuing Authority *
                            </label>
                            <select
                                name="issuingAuthority"
                                className="form-control glass-input"
                                value={formData.issuingAuthority}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Authority</option>
                                {issuingAuthorities.map(auth => (
                                    <option key={auth} value={auth}>{auth}</option>
                                ))}
                            </select>
                            {errors.issuingAuthority && <small className="text-danger">{errors.issuingAuthority}</small>}
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                <Calendar size={18} className="me-2" />License Expiry Date *
                            </label>
                            <input
                                type="date"
                                name="licenseExpiryDate"
                                className="form-control glass-input"
                                value={formData.licenseExpiryDate}
                                onChange={handleInputChange}
                            />
                            {errors.licenseExpiryDate && <small className="text-danger">{errors.licenseExpiryDate}</small>}
                        </div>
                        
                        <div className="col-12 mb-3">
                            <label className="form-label" style={{ color: 'var(--color-text-primary)' }}>
                                <Upload size={18} className="me-2" />Upload License Certificate (Optional)
                            </label>
                            <input
                                type="file"
                                className="form-control glass-input"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <small style={{ color: 'var(--color-text-light)' }}>
                                Accepted formats: PDF, JPG, PNG (Max 5MB)
                            </small>
                            {formData.licenseDocument && (
                                <div className="mt-2" style={{ color: 'var(--color-teal)' }}>
                                    <CheckCircle size={16} className="me-2" />
                                    {formData.licenseDocument.name}
                                </div>
                            )}
                            {errors.licenseDocument && <small className="text-danger d-block">{errors.licenseDocument}</small>}
                        </div>
                        
                        <div className="col-12">
                            <div className="alert" style={{ 
                                background: 'var(--glass-bg)',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--color-text-secondary)'
                            }}>
                                <AlertCircle size={18} className="me-2" />
                                Your license will be verified by our team. You can upload the document now or later from your profile.
                            </div>
                        </div>
                    </div>
                );
                
            default:
                return null;
        }
    };

    const stepTitles = [
        'Account Credentials',
        'Personal Details',
        'Professional Details',
        'Location Information',
        'License Verification'
    ];

    return (
        <div className="min-vh-100" style={{ background: 'var(--bg-primary)' }}>
            <Navbar />
            
            <div className="container py-5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="row justify-content-center"
                >
                    <div className="col-lg-8">
                        {/* Header */}
                        <div className="text-center mb-4">
                            <h2 className="font-weight-bold" style={{ color: 'var(--color-text-primary)' }}>
                                Doctor Registration
                            </h2>
                            <p style={{ color: 'var(--color-text-secondary)' }}>
                                Join our platform and start helping patients
                            </p>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="glass-panel p-3 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                {stepTitles.map((title, index) => (
                                    <div 
                                        key={index}
                                        className="text-center"
                                        style={{ flex: 1 }}
                                    >
                                        <div 
                                            className="rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center"
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                background: currentStep > index + 1 
                                                    ? 'var(--gradient-primary)' 
                                                    : currentStep === index + 1 
                                                    ? 'var(--gradient-secondary)' 
                                                    : 'var(--glass-bg)',
                                                border: '2px solid var(--glass-border)',
                                                color: currentStep >= index + 1 ? 'white' : 'var(--color-text-light)'
                                            }}
                                        >
                                            {currentStep > index + 1 ? (
                                                <CheckCircle size={20} />
                                            ) : (
                                                <span>{index + 1}</span>
                                            )}
                                        </div>
                                        <small 
                                            style={{ 
                                                color: currentStep === index + 1 
                                                    ? 'var(--color-text-primary)' 
                                                    : 'var(--color-text-light)',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {title}
                                        </small>
                                    </div>
                                ))}
                            </div>
                            <div className="progress" style={{ height: '4px', background: 'var(--glass-bg)' }}>
                                <div 
                                    className="progress-bar"
                                    style={{ 
                                        width: `${(currentStep / totalSteps) * 100}%`,
                                        background: 'var(--gradient-primary)'
                                    }}
                                />
                            </div>
                        </div>
                        
                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="glass-panel p-4 mb-4">
                                <h5 className="mb-4" style={{ color: 'var(--color-text-primary)' }}>
                                    {stepTitles[currentStep - 1]}
                                </h5>
                                
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {renderStepContent()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            
                            {/* Navigation Buttons */}
                            <div className="d-flex justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={handlePrevious}
                                    disabled={currentStep === 1}
                                    style={{
                                        opacity: currentStep === 1 ? 0.5 : 1
                                    }}
                                >
                                    <ArrowLeft size={18} className="me-2" />
                                    Previous
                                </button>
                                
                                {currentStep < totalSteps ? (
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={handleNext}
                                        style={{
                                            background: 'var(--gradient-primary)',
                                            color: 'white',
                                            border: 'none'
                                        }}
                                    >
                                        Next
                                        <ArrowRight size={18} className="ms-2" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="btn"
                                        disabled={isSubmitting}
                                        style={{
                                            background: 'var(--gradient-primary)',
                                            color: 'white',
                                            border: 'none'
                                        }}
                                    >
                                        {isSubmitting ? 'Registering...' : 'Complete Registration'}
                                        <CheckCircle size={18} className="ms-2" />
                                    </button>
                                )}
                            </div>
                        </form>
                        
                        {/* Login Link */}
                        <div className="text-center mt-4">
                            <p style={{ color: 'var(--color-text-secondary)' }}>
                                Already have an account?{' '}
                                <a 
                                    href="/doctorlogin" 
                                    style={{ 
                                        color: 'var(--color-primary)', 
                                        textDecoration: 'none',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Login here →
                                </a>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DoctorRegistration;
