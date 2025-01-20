import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export default generateToken;
