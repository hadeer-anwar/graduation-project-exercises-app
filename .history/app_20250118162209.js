
const app = express();
app.use(cors())
app.options('*', cors());
app.use(express.json());
app.use(morgan("dev"));