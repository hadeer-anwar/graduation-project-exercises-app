import asyncWrapper from '../../middlewares/asyncWrapper.js'
import bcrypt from 'bcryptjs'
import { addUser, changeRole, deleteUserById, getAllUsers, getUserById,
   userLogin, userUpdate, userUpdatePassword } from '../service/user.service.js'

const tokenOption = {
  httpOnly: true,     // prevent xss attack
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',   // prevent csrf attack
  maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie valid for 7 days
}

export const userSignup= asyncWrapper(async(req, res, next) => {
    let userData= {
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      passwordChangedAt: req.body.passwordChangedAt,
      googleId:req.body.googleId,
      profilePic: req.body.profilePic,
      age: req.body.age,
      height:req.body.height,
      weight: req.body.weight,
      fitnessGoal: req.body.fitnessGoal,
      activityLevel: req.body.activityLevel,
      achievements: req.body.achievements,
      workoutHistory: req.body.workoutHistory,
      role: req.body.role
    }
    const {user,token} = await addUser(userData);

    res.status(201).cookie("token",token,tokenOption).json({
        success:true,
        message:"User Registered successfully ",
        data:{
            user,
            token
        }
    })
  })


  export const userSignin = asyncWrapper(async (req, res , next) => {
    const {email, password} = req.body;
  const {user,token} = await userLogin(email, password);
  
    res.status(200).cookie("token",token,tokenOption).json({
        success:true,
        message:"User Logged In",
        data:{
            user,
            token
        }
    })
  });



  export const updateUser = asyncWrapper (async (req,res, next)=>{
     const {id} = req.params;
     let user = {
      name: req.body.name,
      email: req.body.email,
      profilePic: req.body.profilePic,
      age: req.body.age,
      height: req.body.height,
      weight: req.body.weight,
      fitnessGoal: req.body.fitnessGoal,
      activityLevel: req.body.activityLevel,
      points: req.body.points,
      achievements: req.body.achievements,
      workoutHistory: req.body.workoutHistory,
     }
     user = await userUpdate(id, user, {new: true});
     res.status(200).json({
      data: user,
      success: true,
      error:false,
      message: 'User updated successfully'
    });
  })

  export const changePassword = asyncWrapper (async (req, res, next)=>{
    
    const userData = {
      password: await bcrypt.hash(req.body.password,10),
      passwordChangedAt: Date.now(),
    }

    const {user, token} = await userUpdatePassword(req.params.id, userData, {new: true});
    
    res.status(200).cookie("token",token,tokenOption).json({
      success:true,
      message: "Password updated successfully",
      data:{
          user,
          token
      }
  })
  })

  // get all users
export const getUsers = asyncWrapper (async(req,res,next)=>{
  const usersList = await getAllUsers();
  res.status(200).json({
    data: usersList,
    success: true,
    error:false,
    message: 'All Users'
  });
})

// get user by id 
export const getOneUser = asyncWrapper(async (req, res, next)=>{
  const user = await getUserById(req.params.id)

  res.status(200).json({
    data: user,
    success: true,
    error:false,
    message: ''
  });
})

// delete user
export const deleteOneUser = asyncWrapper( async (req, res, next )=>{
  const user = await deleteUserById(req.params.id)

  res.status(200).json({
    data: user,
    success: true,
    error:false,
    message: 'User Deleted successfully'
  });
})

export const changeUserRole = asyncWrapper (async (req, res, next)=>{

  const user = await  changeRole(req.params.id, {role: req.body.role});
  res.status(200).json({
    data: user,
    success: true,
    error:false,
    message: 'Role changed successfully'
  });
})

export const getMyProfile = asyncWrapper(async (req, res, next)=>{
  console.log("from my profile")
  const {_id} = req.user;
  console.log("user id ", _id)
  const user = await getUserById(_id);

  res.status(200).json({
    data: user,
    success: true,
    error:false,
    message: ''
  });

})



// export const logoutUser = asyncWrapper (async(req, res, next)=>{
  
//     res.cookie("token", "", {
//       httpOnly: true, // Prevent XSS
//       secure: process.env.NODE_ENV === "production", // Secure in production
//       sameSite: "Strict", // Prevent CSRF
//       expires: new Date(0), // Expire immediately
//     });
//     res.status(200).json({
//       data:"",
//       success: true,
//       error:false,
//       message: 'Logged out successfully'
//     });
  
// })