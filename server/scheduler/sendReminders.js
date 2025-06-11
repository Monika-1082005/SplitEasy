console.log("Scheduler started")
const cron = require('node-cron');
const Split = require('../models/Split');
const transporter = require('../mailer');
require('dotenv').config();
const EMAIL_USER = process.env.EMAIL_USER;

const sendRecurringReminders = async () => {
    const today = new Date();

    try {
        // Populate 'group' to get group members
        const splits = await Split.find({}).populate('group');

        for (const split of splits) {
            const notifyDays = split.notifyDays;
            if (!notifyDays) continue;  // Skip if notifyDays is not set
            const lastNotified = split.lastNotified || split.createdAt;

            const msSinceLastNotify = today - new Date(lastNotified);
            const daysSinceLastNotify = msSinceLastNotify / (1000 * 60 * 60 * 24);

            if (daysSinceLastNotify >= notifyDays) {
                // if (true) {
                // Collect emails to send reminders to:
                // 1) If split.contacts exists and non-empty, use that
                // 2) Else if split.group exists, get all member emails from group.members
                let emailsToNotify = [];

                if (split.contacts && split.contacts.length > 0) {
                    emailsToNotify = split.contacts;
                } else if (split.group && split.group.members && split.group.members.length > 0) {
                    emailsToNotify = split.group.members.map(member => member.email);
                }

                for (const email of emailsToNotify) {
                    await transporter.sendMail({
                        from: `"Split Reminder" <${EMAIL_USER}>`,
                        to: email,
                        subject: `Reminder: You owe ${split.currency} ${split.amount}`,
                        html: `
              <p>Hello,</p>
              <p>This is a gentle reminder that you owe <strong>${split.currency} ${split.amount}</strong> to the creator of the split titled <em>${split.title}</em>.</p>
              <p>Please make the payment and inform the group.</p>
              <p>Thanks,<br />Split App Team</p>
            `
                    });
                    console.log(`📧 Sent reminder to ${email} for split "${split.title}"`);
                }

                split.lastNotified = today;
                await split.save();
            }
        }
    } catch (error) {
        console.error("Error sending recurring reminders:", error);
    }
};


// Every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log("⏰ Cron running at:", new Date().toLocaleTimeString(), "(Scheduled for 9:00 AM)");
  try {
    await sendRecurringReminders();
  } catch (err) {
    console.error("💥 Cron job error:", err);
  }
});


// Run every minute (for testing)
// cron.schedule('* * * * *', sendRecurringReminders);
// cron.schedule('* * * * *', async () => {
//   console.log("⏰ Cron running at:", new Date().toLocaleTimeString());
//   try {
//     await sendRecurringReminders();
//   } catch (err) {
//     console.error("💥 Cron job error:", err);
//   }
// });

console.log("Cron job scheduled");

