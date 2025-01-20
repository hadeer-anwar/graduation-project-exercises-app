import {Strategy  as GoogleStrategy} from 'passport-google-oauth20';
import passport from 'passport';
import dotenv from 'dotenv';
import User from './user/model/user.model.js';


dotenv.config();

// Configure Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL , 
            scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Find or create user
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    user = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0]?.value || "", 
                        password: "",
                        profilePic: profile.photos[0]?.value || null, 
                        googleId: profile.id,
                        age: null, 
                        height: null,
                        weight: null,
                        activityLevel: "",
                        fitnessGoal: "",
                        points: 0, // Default to zero points
                        achievements: [],
                        workoutHistory: [],
                    });
                }

                // Pass user to the done callback
                done(null, user);
            } catch (error) {
                console.error("Error in Google Strategy: ", error);
                done(error, null);
            }
        })
);

// Serialize user (stores user ID in session)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user (retrieves full user details from ID stored in session)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.error("Error deserializing user:", error);
        done(error, null);
    }
});
