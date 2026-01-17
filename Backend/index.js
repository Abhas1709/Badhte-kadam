const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const jobRoutes = require("./routes/jobRoutes");
const chatRoutes = require("./routes/chatRoutes");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Chat = require("./Models/chat");
const Job = require("./Models/job");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/chat", chatRoutes);

const port = process.env.PORT || 5000;

function roomKey(jobId, applicantId) {
  return `chat:${jobId}:${applicantId}`;
}

async function ensureAccess(userId, jobId, applicantId) {
  const job = await Job.findById(jobId);
  if (!job) return false;
  const isRecruiter = job.createdBy.toString() === userId;
  const isApplicant = applicantId.toString() === userId;
  const app = (job.applications || []).find((a) => a.applicant.toString() === applicantId.toString());
  if (!app) return false;
  const allowedStatuses = ["shortlisted", "accepted", "hired"];
  if (!allowedStatuses.includes(app.status)) return false;
  return isRecruiter || isApplicant;
}

connectDb()
  .then(() => {
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: { origin: "*", methods: ["GET", "POST"] },
    });

    io.use((socket, next) => {
      try {
        const token = socket.handshake.auth?.token || "";
        const secret = process.env.JWT_SECRET;
        const payload = jwt.verify(token, secret);
        socket.user = { id: payload.id, roles: payload.roles };
        next();
      } catch (err) {
        next(new Error("unauthorized"));
      }
    });

    io.on("connection", (socket) => {
      socket.on("chat:join", async ({ jobId, applicantId }) => {
        if (!jobId || !applicantId) return;
        const ok = await ensureAccess(socket.user.id, jobId, applicantId);
        if (!ok) return;
        const key = roomKey(jobId, applicantId);
        socket.join(key);
        const chat = await Chat.findOne({ jobId, applicantId });
        socket.emit("chat:init", { messages: chat?.messages || [] });
      });

      socket.on("chat:message", async ({ jobId, applicantId, text }) => {
        if (!jobId || !applicantId || !text || typeof text !== "string") return;
        const ok = await ensureAccess(socket.user.id, jobId, applicantId);
        if (!ok) return;
        let chat = await Chat.findOne({ jobId, applicantId });
        if (!chat) {
          chat = await Chat.create({
            jobId,
            applicantId,
            participants: [applicantId, socket.user.id],
            messages: [],
          });
        }
        chat.messages.push({ sender: socket.user.id, text });
        await chat.save();
        io.to(roomKey(jobId, applicantId)).emit("chat:message", { sender: socket.user.id, text });
      });
    });

    server.listen(port, () => {
      console.log("Server listening on port", port);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
