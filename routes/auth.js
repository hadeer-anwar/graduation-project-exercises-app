import express from 'express'
import passport from 'passport'
import generateToken from '../utils/generateToken.js'

const router = express.Router();

const tokenOption = {
    httpOnly: true,     // Prevent XSS attacks
    secure: process.env.NODE_ENV === 'production', // Set secure cookie only in production
    sameSite: 'Strict', // Prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie valid for 7 days
};


// Login success route
router.get("/login/success", (req, res) => {
    const user = req.user
    if (user) {
        const token = generateToken(user); // Generate token
        res.status(200).cookie("token",token,tokenOption).json({
            success:true,
            message:"User Logged In",
            data:{
                user,
                token
            }
        });
    } else {
        res.status(403).json({
            error: true,
            message: "Not Authorized",
        });
    }
});

// Login failure route
router.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Login Failure",
    });
});

// Google OAuth route
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login/failed" }),
    (req, res) => {
        //console.log(req.user)
        const user = req.user
        const token = generateToken(user); // Generate token
        res.status(200).cookie("token",token,tokenOption).json({
            success:true,
            message:"User Logged In",
            data:{
                user,
                token
            }
        })
    }
);

// Logout route
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: true, message: "Logout failed" });
        }
        res
            .clearCookie("token") // Clear the JWT cookie
            .status(200)
            .json({ error: false, message: "Successfully logged out" });
    });
});

export default router;
