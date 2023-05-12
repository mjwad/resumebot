import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate,
    MessagesPlaceholder,
  } from "langchain/prompts";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

const model = new ChatOpenAI({ 
  temperature: 0,
  openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY
});

const chatPrompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(
    "The following is a friendly conversation between a human and a Resume Bot."+
    "You are a Resume Bot, who just answer on talks about job and resume related questions"+
    "If the question you have been asked is not relevant to job or resume, you have to just say \`I don't know\`." +
    "Don't!!! answer to irrelevant questions, you'r just a resume bot."
  ),
  new MessagesPlaceholder("history"),
  HumanMessagePromptTemplate.fromTemplate("{text}")
]);

const chain = new ConversationChain({ llm: model,
  prompt: chatPrompt,
  memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
});

export const chatResponse = async (inst) => {
  const res = await chain.call({
    text: inst
  });

  return res
};

