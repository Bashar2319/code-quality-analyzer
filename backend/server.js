const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { analyzeCode } = require('./analyzer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve static frontend files

// Configure multer for file uploads (in-memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/analyze', upload.single('codeFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileContent = req.file.buffer.toString('utf-8');
    const fileName = req.file.originalname;

    try {
        const metrics = analyzeCode(fileContent, fileName);
        res.json(metrics);
    } catch (error) {
        console.error("Error analyzing code:", error);
        res.status(500).json({ error: 'Error analyzing code' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
