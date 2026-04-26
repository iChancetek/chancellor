
async function checkVideo() {
  try {
    const response = await fetch('http://localhost:3000/Chancellor_CRM_ERP2.mp4', { method: 'HEAD' });
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));
    console.log('Content-Length:', response.headers.get('content-length'));
  } catch (e) {
    console.error('Fetch failed:', e.message);
  }
}

checkVideo();
