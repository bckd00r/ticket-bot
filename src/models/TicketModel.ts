import { Schema, model, Document } from "mongoose";

export interface ITicketModel extends Document {
    channelId: string | undefined;
    type: string;
	owner: {
        ownerID: string;
        messages?: {
            createdAt: Date;
            editedAt: Date;
            message: string;
        }[]
    };
    admins?: {
        adminID: string;
        messages: {
            createdAt: Date;
            editedAt: Date;
            message: string;
        }[]
    }[];
    closed?: boolean;
    createdAt: Date;
    savedAt?: Date;
}

export const TicketSchema = new Schema<ITicketModel>({
    channelId: {
		type: String,
		required: true,
	},
    type: {
		type: String,
		required: true,
	},
    owner: {
		type: Object,
		required: true,
	},
    admins: Object,
    closed: {
        type: Boolean,
        default: false,
    },
    createdAt: Date,
    savedAt: Date,
});

export const TicketModel = model<ITicketModel>(
	"ticketModel",
	TicketSchema,
	"TICKET_COLLECTION",
);
