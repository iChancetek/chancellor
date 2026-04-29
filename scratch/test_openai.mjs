import fs from 'fs';
import OpenAI from 'openai';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const keyLine = envContent.split('\n').find(line => line.startsWith('OPENAI_API_KEY='));
const key = keyLine.split('=')[1].trim();

const openai = new OpenAI({ apiKey: key });

async function test() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'hello' }]
    });
    console.log('Success:', completion.choices[0].message.content);
  } catch (err) {
    console.error('Error:', err.message);
  }
}
test();
