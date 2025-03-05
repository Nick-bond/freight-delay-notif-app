import twilio from 'twilio'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    message?: string,
    error?: string,
    workflowId?: string,
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    if (req.method === 'POST') {
        const {recipient, message } = req.body

        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
        const client = twilio(accountSid, authToken)

        client.messages.create({
            from: phoneNumber,
            to: recipient,
            body: message,
        }).then((message) => {
                res.status(200).json({message: message.sid});
            })
            .catch((err) => {
                res.status(500).json({error: err.message});
            })
    }
}