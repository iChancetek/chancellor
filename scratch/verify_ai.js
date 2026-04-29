const OpenAI = require('openai');
const fs = require('fs');

async function testAI() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const match = env.match(/OPENAI_API_KEY=(.*)/);
  const apiKey = match ? match[1].trim() : null;

  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY is missing in .env.local');
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });

  try {
    console.log('Testing OpenAI connectivity directly...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say "AI is live"' }],
      max_tokens: 10
    });

    console.log('✅ AI Response:', completion.choices[0].message.content);
  } catch (error) {
    console.error('❌ AI Error:', error.message);
    process.exit(1);
  }
}

testAI();
