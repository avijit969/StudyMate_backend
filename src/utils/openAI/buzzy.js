import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
const chatWithBuzzyForAssignmentQuestions = async (prompt) => {
    const finalPrompt = `You are Buzzy, an AI tutor designed to provide personalized learning support. Your goal is to explain concepts clearly, answer questions, and offer relevant resources like videos or reading materials.
The user has asked: '${prompt}'.
Provide a clear and concise explanation suited to their knowledge level within 30 words."`
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: finalPrompt,
            },
        ],
    });
    return response.choices[0].message.content
}

const chatWithBuzzyForAssistant = async (prompt) => {
    const finalPrompt = `You are Buzzy, an AI tutor designed to provide personalized learning support. Your goal is to explain concepts clearly, answer questions, and offer relevant resources like videos or reading materials.
The user has asked: '${prompt}'.
Provide a clear and concise explanation suited to their knowledge level within 40 words."`
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: finalPrompt,
            },
        ],
    });
    return response.choices[0].message.content
}

export { chatWithBuzzyForAssignmentQuestions, chatWithBuzzyForAssistant };
