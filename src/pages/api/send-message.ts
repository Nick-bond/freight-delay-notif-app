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
        const {recipient, message } = JSON.parse(req.body)

        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = twilio(accountSid, authToken)

        client.messages.create({
            from: '+13157125351',
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