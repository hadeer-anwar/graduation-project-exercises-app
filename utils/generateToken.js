import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

export default generateToken;
