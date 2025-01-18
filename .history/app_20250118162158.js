
const app = express();
app.options('*', cors());
app.use(express.json());
app.use(morgan("dev"));