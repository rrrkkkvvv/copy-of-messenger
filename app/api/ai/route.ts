import { NextRequest, NextResponse } from 'next/server';
import {OpenAI} from 'openai'


export default async function requestToChatGPT(message:string)  {

    const openAi = new OpenAI({
        apiKey: process.env.GPT_API_KEY!
    });
    const response = await openAi.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages:[
 
            {
                role:"user",
                content:message,
            }
        ],
        temperature:0,
        max_tokens:1024,
        top_p:1,
        frequency_penalty:0,
        presence_penalty:0,
    })
    return response.choices[0].message.content;
 
}
 