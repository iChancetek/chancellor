const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

async function testAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY is missing in .env.local');
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });

  try {
    console.log('Testing OpenAI connectivity with model gpt-4o-mini...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say "Chancellor AI is online" if you can hear me.' }],
      max_tokens: 20
    });

    console.log('✅ AI Response:', completion.choices[0].message.content);
  } catch (error) {
    console.error('❌ AI Error:', error.message);
    process.exit(1);
  }
}

testAI();
