const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const Split = require("../models/Split"); // Make sure this path is correct

router.get("/history", async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        const userEmail = req.headers["x-user-email"];

        if (!userId || !userEmail) {
            return res.status(400).json({ error: "Missing user ID or email in headers" });
        }

        const groups = await Group.find({ createdBy: userId }).lean();
        const groupMap = Object.fromEntries(groups.map(g => [g._id.toString(), g.name]));

        // Fetch splits. The .lean() is important for performance.
        // The query needs to include splits where the user is the creator
        // OR where the user's email is found in any splitDetail.
        // We also explicitly populate 'paymentLog' as it's our new source for history.
        const splits = await Split.find({
            $or: [
                { createdBy: userId },
                { "splitDetails.email": userEmail }
            ],
        }).lean();

        const allEvents = [];

        // 1. Add group creation events
        groups.forEach(g => {
            allEvents.push({
                id: g._id.toString(),
                timestamp: g.createdAt.toISOString(),
                type: "group_created",
                message: `Created group "${g.name}"`,
                icon: "👥",
            });
        });

        // 2. Process splits and their payment logs for historical events
        splits.forEach(split => {
            const splitGroupName = split.group ? groupMap[split.group.toString()] : null;

            // Add the initial split creation event
            // This is still derived from 'createdAt' as it's the split's birth event
            if (split.createdBy.toString() === userId) {
                const message = splitGroupName
                    ? `Created split "${split.title}" for group "${splitGroupName}"`
                    : `Created split "${split.title}"`;
                allEvents.push({
                    id: `${split._id}_split_created_${Date.parse(split.createdAt)}`,
                    timestamp: split.createdAt.toISOString(),
                    type: "split_created",
                    message,
                    icon: "📃",
                });
            }

            // Iterate through the NEW paymentLog to get all historical split-related events
            if (split.paymentLog && Array.isArray(split.paymentLog)) {
                split.paymentLog.forEach(logEntry => {
                    const isoTimestamp = new Date(logEntry.timestamp).toISOString();

                    let event = null;

                    switch (logEntry.action) {
                        case 'member_paid':
                            // Only include if the current user is the creator OR the specific member who was paid
                            // This prevents showing 'member_marked_paid' events for everyone in the group
                            if (split.createdBy.toString() === userId || logEntry.memberEmail === userEmail) {
                                event = {
                                    id: `${split._id}_${logEntry.action}_${logEntry.memberEmail || "no-email"}_${Date.parse(isoTimestamp)}`,
                                    timestamp: isoTimestamp,
                                    type: "member_marked_paid",
                                    message: `${split.createdBy.toString() === userId ? 'You marked' : logEntry.memberEmail} "${logEntry.memberEmail}" as paid for split "${split.title}"`,
                                    icon: "🤝",
                                };
                            }
                            break;
                        case 'member_unpaid':
                            // Only include if the current user is the creator OR the specific member who was marked unpaid
                            if (split.createdBy.toString() === userId || logEntry.memberEmail === userEmail) {
                                event = {
                                    id: `${split._id}_${logEntry.action}_${logEntry.memberEmail || "no-email"}_${Date.parse(isoTimestamp)}`,
                                    timestamp: isoTimestamp,
                                    type: "member_marked_unpaid", // New event type for clarity
                                    message: `${split.createdBy.toString() === userId ? 'You marked' : logEntry.memberEmail} "${logEntry.memberEmail}" as unpaid for split "${split.title}"`,
                                    icon: "⚠️",
                                };
                            }
                            break;
                        case 'split_settled_manual':
                            // Only show if the current user is the creator (who initiated the manual settlement)
                            if (split.createdBy.toString() === userId) {
                                event = {
                                    id: `${split._id}_${logEntry.action}_${logEntry.memberEmail || "no-email"}_${Date.parse(isoTimestamp)}`,
                                    timestamp: isoTimestamp,
                                    type: "split_settled", // Reusing this type
                                    message: `Split "${split.title}" has been manually settled`,
                                    icon: "✅",
                                };
                            }
                            break;
                        case 'split_settled_auto':
                            // Only show if the current user is the creator (whose split became fully paid)
                            if (split.createdBy.toString() === userId) {
                                event = {
                                    id: `${split._id}_${logEntry.action}_${logEntry.memberEmail || "no-email"}_${Date.parse(isoTimestamp)}`,
                                    timestamp: isoTimestamp,
                                    type: "split_settled", // Reusing this type
                                    message: `Split "${split.title}" has been fully settled automatically`,
                                    icon: "✅",
                                };
                            }
                            break;
                        case 'split_unsettled':
                            // Only show if the current user is the creator (who unsettled the split)
                            if (split.createdBy.toString() === userId) {
                                event = {
                                    id: `${split._id}_${logEntry.action}_${logEntry.memberEmail || "no-email"}_${Date.parse(isoTimestamp)}`,
                                    timestamp: isoTimestamp,
                                    type: "split_unsettled",
                                    message: `Marked split "${split.title}" as unsettled`,
                                    icon: "⚠️",
                                };
                            }
                            break;
                    }

                    if (event) {
                        allEvents.push(event);
                    }
                });
            }
        });

        // Combine all events and sort them chronologically (most recent first)
        const sortedEvents = allEvents.sort((a, b) => b.timestamp - a.timestamp);

        // Group events by date
        const grouped = sortedEvents.reduce((acc, event) => {
            const dateKey = new Date(event.timestamp).toLocaleDateString();
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(event);
            return acc;
        }, {});

        // Format into the final history array
        const history = Object.entries(grouped).map(([date, events]) => ({
            date,
            events,
        }));

        res.json(history);
    } catch (err) {
        console.error("Error fetching history:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
