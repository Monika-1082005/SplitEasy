const cron = require('node-cron');
const path = require('path');
const transporter = require('./mailer');
const EMAIL_USER = process.env.EMAIL_USER;

let _SplitModel;
let _GroupModel;

const sendRecurringReminders = async () => {
    if (!_SplitModel || !_GroupModel) {
        console.error("Models not assigned yet in sendRecurringReminders. This indicates a setup issue.");
        return;
    }

    const currentConnectionState = _SplitModel.db.readyState;
    console.log(`Checking Mongoose connection state before query: ${currentConnectionState}`);

    if (currentConnectionState !== 1) {
        console.warn(`Mongoose connection not fully ready yet within sendRecurringReminders. State: ${currentConnectionState}. Retrying next minute.`);
        return;
    }

    const today = new Date();

    try {
        const splits = await _SplitModel.find({}).populate({
            path: 'group',
            model: _GroupModel,
            populate: { 
                path: 'members',
                model: 'Users'
            }
        });

        console.log(`Found ${splits.length} splits due for reminders.`);

        for (const split of splits) {
            const notifyDays = split.notifyDays;
            if (!notifyDays) continue; // Skip if notifyDays is not set
            const lastNotified = split.lastNotified || split.createdAt; // Use createdAt if never notified

            const msSinceLastNotify = today - new Date(lastNotified);
            const daysSinceLastNotify = msSinceLastNotify / (1000 * 60 * 60 * 24);

            console.log(`  Split ID: ${split._id}, Title: "${split.title}"`);
            console.log(`  - notifyDays: ${notifyDays}`);
            console.log(`  - lastNotified: ${new Date(lastNotified).toISOString()}`);
            console.log(`  - daysSinceLastNotify: ${daysSinceLastNotify.toFixed(2)}`);
            console.log(`  - Condition: ${daysSinceLastNotify.toFixed(2)} >= ${notifyDays} -> ${daysSinceLastNotify >= notifyDays}`);

            if (daysSinceLastNotify >= notifyDays) {
                // if(true){
                let emailsToNotify = [];

                if (split.contacts && split.contacts.length > 0) {
                    emailsToNotify = split.contacts;
                } else if (split.group && split.group.members && split.group.members.length > 0) {
                    emailsToNotify = split.group.members.map(member => member.email);
                }

                console.log(`  - Emails determined for notification: ${emailsToNotify.join(', ')} (Count: ${emailsToNotify.length})`);

                if (emailsToNotify.length > 0) {
                    for (const email of emailsToNotify) {
                        try {
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
                        } catch (mailError) {
                            console.error(`❌ Failed to send email to ${email} for split "${split.title}":`, mailError);
                        }
                    }

                    split.lastNotified = today;
                    await split.save();
                    console.log(`✅ Updated lastNotified for split "${split.title}" to ${today.toISOString()}`);
                } else {
                    console.warn(`  No valid emails found for split "${split.title}" despite reminder criteria met.`);
                }
            } else {
                console.log(`  Reminder criteria not met for split "${split.title}". Skipping email.`);
            }
        }
    } catch (error) {
        console.error("Error sending recurring reminders:", error);
    }
};

const startCronJobs = (Split, Group) => {
    _SplitModel = Split;
    _GroupModel = Group;
    console.log("Cron job scheduled (after DB connection and models assigned).");

    // cron.schedule('* * * * *', async () => {
    //     console.log("⏰ Cron running at:", new Date().toLocaleTimeString());
    //     try {
    //         await sendRecurringReminders();
    //     } catch (err) {
    //         console.error("💥 Cron job error:", err);
    //     }
    // });

    cron.schedule('0 9 * * *', async () => { // Every day at 9 AM
        console.log("⏰ Cron running at:", new Date().toLocaleTimeString(), "(Scheduled for 9:00 AM)");
        try {
            await sendRecurringReminders();
        } catch (err) {
            console.error("💥 Cron job error:", err);
        }
    });
};

module.exports = { sendRecurringReminders, startCronJobs };