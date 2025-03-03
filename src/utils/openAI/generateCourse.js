import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
const topicSchema = {
    type: "object",
    properties: {
        course_name: {
            type: "string",
            description: "Name of the course"
        },
        description: {
            type: "string",
            description: "Description of the course"
        },
        topics: {
            type: "array",
            description: "List of topics",
            items: {
                type: "object",
                properties: {
                    title: {
                        type: "string",
                        description: "Title of the topic"
                    },
                    description: {
                        type: "string",
                        description: "Description of the topic"
                    },
                    explanation: {
                        type: "string",
                        description: "Explanation of the topic with examples and practical applications of the concepts"
                    }
                },
                required: ["title", "description", "explanation"]
            }
        }
    },
    required: ["course_name", "description", "topics"]
};
const questionSchema = {
    type: "object",
    properties: {
        questions: {
            type: "array",
            description: "List of questions",
            items: {
                type: "object",
                properties: {
                    question: {
                        type: "string",
                        description: "Question related to the topic"
                    },
                    options: {
                        type: "array",
                        description: "Multiple choice options for the question",
                        items: {
                            type: "string"
                        }
                    },
                    answerIndex: {
                        type: "integer",
                        description: "Index of the correct answer in the options array and make sure that is correct answer index from options array"
                    },
                },
                required: ["question", "answerIndex", "options"]
            }
        }
    },
    required: ["questions"]
};

const generateCourse = async (courseName) => {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: `Generate a structured JSON object representing a course ${courseName} syllabus. The JSON should include the course name, a brief description, and a list of topics in sequential order from basic to advanced. Each topic must contain a title and a short description and long explanation. Ensure the topics cover essential concepts and practical applications for the course.`
            },
        ],
        functions: [
            {
                name: "generate_topics",
                parameters: topicSchema
            }
        ],
        function_call: {
            name: "generate_topics"
        }
    });

    const result = completion?.choices[0]?.message?.function_call?.arguments;
    return JSON.parse(result);
};
// generateCourse("12th grade physics").then(console.log);

const generateCourseAssessment = async (courseName) => {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: `Generate a structured JSON object representing an assessment for the course ${courseName}. The JSON should include a list of questions and answers for each topic in the course syllabus. Each question should cover key concepts and practical applications of the topic.`
            },
        ],
        functions: [
            {
                name: "generate_questions",
                parameters: questionSchema
            }
        ],
        function_call: {
            name: "generate_questions"
        }
    });

    const result = completion?.choices[0]?.message?.function_call?.arguments;
    return JSON.parse(result);
};

// generateCourseAssessment("java for beginners").then((data) => console.log(JSON.stringify(data, null, 4)));
export { generateCourse, generateCourseAssessment };