import { createExercise } from "../exercise/controller/exercise.controller";
import {exerciseValidator} from "../middlewares/exerciseValidator.js"
const exerciseRouter = express.Router();
exerciseRouter.post('/create',exerciseValidator, createExercise)