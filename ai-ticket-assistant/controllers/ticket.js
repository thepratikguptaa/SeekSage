import { inngest } from "../inngest/client.js";
import Ticket from "../models/ticket.js";

export const createTicket = async (req, res) => {
    try {
        const {title, description} = req.body
        if (title || description) {
            return res.status(400).json({error: "Title and description are required"})
        }
        const newTicket = await Ticket.create({title, description, createdBy: req.user._id.toString()})

        await inngest.send({
            name: "ticket/created",
            data: {
                ticketId: newTicket._id.toString(),
                title,
                description,
                createdBy: req.user._id.toString()
            }
        })
        return res.status(201).json({
            message: "Ticket created successfully",
            ticket: newTicket
        })

    } catch (error) {
        console.error("❌ Error in Ticket Create Function:", error.message);
        return res.status(500).json({error: "Ticket creation failed", message: error.message});
        
    }
}

export const getTickets = async (req, res) => {
    try {
        const user = req.user
        let tickets = []
        if(user.role !== "user") {
            tickets = await Ticket.find({})
            .populate("assignedTo", ["email", "_id"])
            .sort({createdAt: -1})
        } else {
            tickets = await Ticket.find({createdBy: user._id})
                .select("title description status createdAt")
                .sort({createdAt: -1})
        }
        return res.status(200).json(tickets)

    } catch (error) {
        console.error("❌ Error in Ticket Get Function:", error.message);
        return res.status(500).json({error: "Get tickets failed", message: error.message})
    
    }
}

export const getTicket = async (req, res) => {
    try {
        const user = req.user
        let ticket;
        if (user.role !== "user") {
            ticket = Ticket.findById(req.params.id).populate("assignedTo", ["email", "_id"])
        } else {
            ticket = Ticket.findOne({
                createdBy: user._id,
                _id: req.params.id
            }).select("title description status createdAt")
        }

        if (!ticket) {
            return res.status(404).json({error: "Ticket not found"})
        }
        return res.status(200).json(ticket)
        
    } catch (error) {
        console.error("❌ Error in Ticket Get Function:", error.message);
        return res.status(500).json({error: "Get ticket failed", message: error.message})
    }
}