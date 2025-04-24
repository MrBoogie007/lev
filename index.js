const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static HTML and CSS files
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection failed:', err));

// Schema for form data
const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  pincode: String,
  agreed: Boolean,
});
const Form = mongoose.model('Form', formSchema);

// POST route to handle form submissions
app.post('/api/form', async (req, res) => {
  try {
    const newForm = new Form(req.body);
    await newForm.save();
    res.status(200).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error('❌ Error saving form:', error);
    res.status(500).json({ message: 'Failed to submit form.' });
  }
});

// Serve index.html as homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
