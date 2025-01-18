
const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(morgan("dev"));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "API is running..." });
  });

  app.use(errorHandler);
  
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "This resource is not available"
  });
});

export default app;