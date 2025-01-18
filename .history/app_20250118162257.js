
const app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({ message: "API is running..." });
  });