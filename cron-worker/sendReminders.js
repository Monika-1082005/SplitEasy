const path = require('path');
const transporter = require('./mailer');
const EMAIL_USER = process.env.EMAIL_USER;
const currencySymbol = require('./data/currencySymbols');


const sendRecurringReminders = async (SplitModel, GroupModel) => {
    if (!SplitModel || !GroupModel) {
        console.error("Models not assigned yet in sendRecurringReminders. This indicates a setup issue.");
        return;
    }

    const currentConnectionState = SplitModel.db.readyState;
    console.log(`Checking Mongoose connection state before query: ${currentConnectionState}`);

    if (currentConnectionState !== 1) {
        console.warn(`Mongoose connection not fully ready yet within sendRecurringReminders. State: ${currentConnectionState}. Retrying next minute.`);
        return;
    }

    const today = new Date();

    try {
        const splits = await SplitModel.find({ notifyDays: { $ne: null } })
            .populate('createdBy', 'username') // <-- add this line
            .populate({
                path: 'group',
                model: GroupModel,
                populate: {
                    path: 'members',
                    model: 'Users'
                }
            });


        console.log(`Found ${splits.length} splits due for reminders.`);


        for (const split of splits) {
            const notifyDays = split.notifyDays;
            if (!notifyDays) continue;
            if (split.status === 'paid' || split.settledManually === true) {
                console.log(`  ❌ Split "${split.title}" is settled. Skipping reminder.`);
                continue;
            }

            const lastNotified = split.lastNotified || split.createdAt;

            const msSinceLastNotify = today - new Date(lastNotified);
            const daysSinceLastNotify = msSinceLastNotify / (1000 * 60 * 60 * 24);
            const diffInDays = Math.floor(daysSinceLastNotify);

            console.log(`  Split ID: ${split._id}, Title: "${split.title}"`);
            console.log(`  - notifyDays: ${notifyDays}`);
            console.log(`  - lastNotified: ${new Date(lastNotified).toISOString()}`);
            console.log(`  - daysSinceLastNotify (raw): ${daysSinceLastNotify.toFixed(4)}`);
            console.log(`  - daysSinceLastNotify (floor): ${diffInDays}`);
            console.log(`  - Condition: ${diffInDays} >= ${notifyDays} -> ${diffInDays >= notifyDays}`);


            let emailsToNotify = [];

            if (split.splitDetails?.length > 0) {
                emailsToNotify = split.splitDetails
                    .filter(detail => !detail.isPaid)
                    .map(detail => detail.email);
            } else if (split.contacts && split.contacts.length > 0) {
                emailsToNotify = split.contacts;
            } else if (split.group?.members?.length > 0) {
                emailsToNotify = split.group.members.map(member => member.email);
            }

            console.log(`  - Emails to notify (unpaid only): ${emailsToNotify.join(', ')} (Count: ${emailsToNotify.length})`);

            if (diffInDays >= notifyDays) {
            // if(true){
                if (emailsToNotify.length > 0) {
                    for (const email of emailsToNotify) {
                        try {
                            await transporter.sendMail({
                                from: `"Split Reminder" <${EMAIL_USER}>`,
                                to: email,
                                subject: `Reminder: You owe ${currencySymbol[split.currency] || split.currency}${split.amount}`,
                                html: `
        <p>Hi there,</p>
        <p>This is a friendly reminder that you owe <strong>${currencySymbol[split.currency] || split.currency}${split.amount}</strong> to <strong>${split.createdBy?.username || 'the user'}</strong> for <em>${split.title}</em>.</p>
          ${split.description ? `<p><strong>A message from <span style="text-transform: capitalize;">${split.createdBy?.username || 'the user'}</span>:</strong> ${split.description}</p>` : ''}
        <p>Please make the payment at your earliest convenience and inform <strong>${split.createdBy?.username || 'the user'}</strong> once it’s done.</p>
        <p>Thanks,<br />The SplitEasy Team</p> 
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
                }
                else {
                    console.warn(`  No valid emails found for split "${split.title}" despite reminder criteria met.`);
                }
            }
            else {
                console.log(`  Reminder criteria not met for split "${split.title}". Skipping email.`);
            }
        }
    } catch (error) {
        console.error("Error sending recurring reminders:", error);
    }
};

module.exports = { sendRecurringReminders };
