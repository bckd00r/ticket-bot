import { User, MessageEmbed, TextChannel, Guild, APIMessageContentResolvable, MessageAdditions, MessageOptions } from "discord.js";
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";
import { TicketModel } from "../models/TicketModel";
import * as fs from "fs";

export async function addTicket(guild: Guild, member: User, topic: string): Promise<void> {
    if (!guild || !member) return;
    const ticketCounts = (await TicketModel.find()).length;
    const supportRoles = (process.env.SUPPORT_ROLES as string).split(', ');
    await guild?.channels.create(`${topic}-${ticketCounts}`, {
        permissionOverwrites: [
            {
                id: guild.id,
                deny: ['VIEW_CHANNEL']
            },
            {
                id: member.id,
                allow: ['VIEW_CHANNEL']
            }
        ]
    }).then(async (channel: TextChannel) => {
        for (const id of supportRoles) {
            await channel?.createOverwrite(id, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
            })
        };
        const embed = new MessageEmbed()
            .setDescription(`User Tag: **${member.tag}**\nType: \`${topic.toLowerCase()}\``)
            .setColor('RED')
            .setTimestamp()
            .setFooter(`${member.tag}`, process.env.ICON)
        await channel?.send(embed).then((msg) => msg.react('🔒'));
        await TicketModel.create({
            channelId: channel?.id,
            owner: {
                ownerID: member.id,
            },
            type: topic.toLowerCase(),
            createdAt: new Date(),
        })
        sendLog(guild, `**${member.tag}** named user created a ticket, ticket sequence \`${ticketCounts}\``)
    });
    return;
}

export async function requestToCloseTicket(channel: TextChannel, author: User): Promise<void> {
    if (!channel || !author) return;
    const ticketModel = await TicketModel.findOne({ channelId: channel.id });
    if (ticketModel.closed || !ticketModel) return;
    await TicketModel.updateOne({ channelId: channel.id }, {
        closed: true,
    });
    const ticketMessages = [];
    const ticketImages = [];
    for (let message of channel.messages.cache) {
        if (message[1].attachments.size > 0) {
            for (let attachment of message[1].attachments) {
                 ticketImages.push(new ImageRun({
                     data: attachment[1].attachment.toString(),
                     transformation: {
                        width: attachment[1].width,
                        height: attachment[1].height,
                    },
                 }))   
            }
        };
        ticketMessages.push(new TextRun(
            `
            \n
            --- Message start ---
            Sender: ${message[1].author.tag}\n
            Type: ${message[1].content || 'Embed or Attachment'}
            Time: ${message[1].createdTimestamp}
            --- Message end ---
            \n
        `));
    }
    const ticketSave = new Document({
        sections: [{
            children: [
                new Paragraph({
                    children: ticketMessages,
                }),
                new Paragraph({
                    children: ticketImages,
                }),
            ],
        }]
    });
    const ticketBuffer = await Packer.toBuffer(ticketSave);
    const untilTime = new Date().toLocaleString('tr-TR', {weekday: "long", year: "numeric", month: "long", day: "numeric" });
    fs.writeFileSync(`logs/${untilTime}/${author.username}-${channel.id}.docx`, ticketBuffer);
    sendLog(channel.guild, {files: [{ attachment: `logs/${author.username}-${channel.id}.docx` }]});
    await channel.send("Channel is being deleted...").then(() => {
        setTimeout(() => 
            channel.delete()
        , 1000)
    })

    return;
}

async function sendLog(guild: Guild, content: APIMessageContentResolvable | MessageAdditions | (MessageOptions & {split?: false})): Promise<void> {
    const logChannel = guild.channels.cache.find(channel=> channel.name == process.env.LOG_CHANNEL_NAME as string) as TextChannel
        if (!logChannel) {
                await guild.channels.create(process.env.LOG_CHANNEL_NAME as string, {
                    type: 'text',
                    permissionOverwrites: [
                {
                    id: guild.id,
                    deny: ['VIEW_CHANNEL']
                },
            ]
        })
    }
    logChannel.send(content);
    return;
}

