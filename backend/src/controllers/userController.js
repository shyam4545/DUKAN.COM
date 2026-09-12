const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── POST /api/user/feedback ──────────────────────────────────────────────────
const submitFeedback = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Feedback text is required.' });
    }

    const feedback = await prisma.feedback.create({
      data: {
        text,
        userId,
      },
    });

    return res.status(201).json({ message: 'Feedback submitted successfully.', feedback });
  } catch (err) {
    console.error('Submit feedback error:', err);
    return res.status(500).json({ message: 'Failed to submit feedback.' });
  }
};

module.exports = { submitFeedback };
