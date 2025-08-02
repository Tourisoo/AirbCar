import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import nodemailer from 'nodemailer'
import crypto from 'crypto'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
})

export async function POST(request) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, we sent you a reset link.' },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Save reset token to database
    // First, delete any existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email }
    })

    // Then create a new reset token
    await prisma.passwordResetToken.create({
      data: {
        email,
        token: resetToken,
        expires: resetTokenExpiry,
      },
    })

    // Send email
    try {
      const transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      })

      const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Reset your password - Airbcar',
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="color: #f97316;">Reset Your Password</h2>
            <p>You requested to reset your password for your Airbcar account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // For development: Log the reset URL to console
      console.log('🔗 Reset Password URL (for development):', `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`)
    }

    return NextResponse.json(
      { message: 'If an account with that email exists, we sent you a reset link.' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
