const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter
const createTransporter = () => {
    // Check if email is configured
    const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;
    
    if (!isEmailConfigured) {
        console.warn('⚠️  Email service not configured. Emails will be logged to console only.');
        return null;
    }

    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD // For Gmail, use App Password
        }
    });
};

/**
 * Send password reset email to doctor
 * @param {string} email - Doctor's email address
 * @param {string} resetToken - Password reset token
 * @param {string} doctorName - Doctor's name
 * @returns {Promise<boolean>} - Success status
 */
const sendPasswordResetEmail = async (email, resetToken, doctorName) => {
    try {
        const transporter = createTransporter();
        
        // Generate reset URL
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/doctor/reset-password?token=${resetToken}`;
        
        const mailOptions = {
            from: `"Medisched Healthcare" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Request - Medisched',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            line-height: 1.6;
                            color: #333;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background: white;
                            border-radius: 10px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                        }
                        .content {
                            padding: 30px;
                        }
                        .button {
                            display: inline-block;
                            padding: 12px 30px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            margin: 20px 0;
                        }
                        .footer {
                            background: #f8f9fa;
                            padding: 20px;
                            text-align: center;
                            font-size: 12px;
                            color: #666;
                        }
                        .warning {
                            background: #fff3cd;
                            border-left: 4px solid #ffc107;
                            padding: 15px;
                            margin: 20px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Password Reset Request</h1>
                        </div>
                        <div class="content">
                            <p>Hello Dr. ${doctorName},</p>
                            <p>We received a request to reset your password for your Medisched doctor account.</p>
                            <p>Click the button below to reset your password:</p>
                            <center>
                                <a href="${resetUrl}" class="button">Reset Password</a>
                            </center>
                            <p>Or copy and paste this link into your browser:</p>
                            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
                            <div class="warning">
                                <strong>⚠️ Security Notice:</strong>
                                <ul style="margin: 10px 0;">
                                    <li>This link will expire in 1 hour</li>
                                    <li>If you didn't request this reset, please ignore this email</li>
                                    <li>Never share this link with anyone</li>
                                </ul>
                            </div>
                        </div>
                        <div class="footer">
                            <p>© 2024 Medisched - Intelligent Healthcare Appointment Scheduling System</p>
                            <p>This is an automated email, please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        if (transporter) {
            // Send email
            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Password reset email sent:', info.messageId);
            return true;
        } else {
            // Email not configured - log to console for development
            console.log('\n' + '='.repeat(80));
            console.log('📧 PASSWORD RESET EMAIL (Development Mode)');
            console.log('='.repeat(80));
            console.log(`To: ${email}`);
            console.log(`Doctor: ${doctorName}`);
            console.log(`Reset URL: ${resetUrl}`);
            console.log('='.repeat(80) + '\n');
            return true;
        }
    } catch (error) {
        console.error('❌ Error sending password reset email:', error);
        // Still log to console as fallback
        console.log('\n⚠️  Email failed, but here\'s the reset link:');
        console.log(`Reset URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/doctor/reset-password?token=${resetToken}\n`);
        return false;
    }
};

/**
 * Send welcome email to newly registered doctor
 * @param {string} email - Doctor's email address
 * @param {string} doctorName - Doctor's name
 * @returns {Promise<boolean>} - Success status
 */
const sendWelcomeEmail = async (email, doctorName) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"Medisched Healthcare" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Welcome to Medisched - Registration Successful',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            line-height: 1.6;
                            color: #333;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background: white;
                            border-radius: 10px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                        }
                        .content {
                            padding: 30px;
                        }
                        .footer {
                            background: #f8f9fa;
                            padding: 20px;
                            text-align: center;
                            font-size: 12px;
                            color: #666;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to Medisched! 🎉</h1>
                        </div>
                        <div class="content">
                            <p>Dear Dr. ${doctorName},</p>
                            <p>Congratulations! Your registration with Medisched has been successfully completed.</p>
                            <p>You can now:</p>
                            <ul>
                                <li>Manage your appointment slots</li>
                                <li>View patient appointments</li>
                                <li>Update your profile and professional details</li>
                                <li>Access patient feedback</li>
                            </ul>
                            <p>Your account is currently pending verification. Our team will review your credentials and notify you once your account is verified.</p>
                            <p>If you have any questions, please don't hesitate to contact our support team.</p>
                        </div>
                        <div class="footer">
                            <p>© 2024 Medisched - Intelligent Healthcare Appointment Scheduling System</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        if (transporter) {
            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Welcome email sent:', info.messageId);
            return true;
        } else {
            console.log(`📧 Welcome email would be sent to: ${email} (Dr. ${doctorName})`);
            return true;
        }
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
        return false;
    }
};

module.exports = {
    sendPasswordResetEmail,
    sendWelcomeEmail
};
