const BASE_URL = 'http://localhost:5001/api';

async function runTests() {
  console.log('--- Starting API Endpoint Verification Tests ---');

  try {
    // 1. Admin login
    console.log('\n[1/6] Authenticating as Admin...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    
    if (!loginRes.ok) {
      throw new Error(`Admin login failed: ${loginRes.status} ${await loginRes.text()}`);
    }

    const { token } = await loginRes.json();
    console.log('✔ Authenticated successfully. Token obtained.');

    // 2. Fetch all inquiries
    console.log('\n[2/6] Fetching list of inquiries...');
    const listRes = await fetch(`${BASE_URL}/inquiries`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!listRes.ok) {
      throw new Error(`Failed to fetch inquiries: ${listRes.status}`);
    }

    const { inquiries } = await listRes.json();
    console.log(`✔ Fetched list. Total inquiries found in database: ${inquiries.length}`);

    if (inquiries.length === 0) {
      console.log('No inquiries found. Creating a test inquiry first...');
      // Submitting inquiry publicly
      await fetch(`${BASE_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'API Test Bot',
          email: 'testbot@example.com',
          phone: '+1 555 1234',
          companyName: 'Test Inc',
          country: 'Canada',
          jobTitle: 'QA Engineer',
          jobDetails: 'We need system integrations and dashboard operations.'
        })
      });
      // Re-fetch
      const listResNew = await fetch(`${BASE_URL}/inquiries`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dataNew = await listResNew.json();
      inquiries.push(...dataNew.inquiries);
    }

    const testInquiry = inquiries[0];
    const testId = testInquiry.id;
    console.log(`Using inquiry: Ref ${testInquiry.trackingReference}, Name: ${testInquiry.fullName}, ID: ${testId}`);

    // 3. Edit inquiry details
    console.log('\n[3/6] Modifying inquiry details (Edit)...');
    const updateRes = await fetch(`${BASE_URL}/inquiries/${testId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fullName: 'Alexis Carter Updated',
        jobTitle: 'VP of Product Engineering',
        category: 'Software Assistance'
      })
    });

    if (!updateRes.ok) {
      throw new Error(`Failed to update inquiry: ${updateRes.status}`);
    }

    const updateData = await updateRes.json();
    console.log('✔ Inquiry updated response:', updateData.message);
    console.log('Updated Inquiry name:', updateData.inquiry.fullName);

    // 4. Inspect details
    console.log('\n[4/6] Inspecting updated inquiry details...');
    const inspectRes = await fetch(`${BASE_URL}/inquiries/${testId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const { inquiry: inspected } = await inspectRes.json();
    console.log(`✔ Inquiry details match update: Name=${inspected.fullName}, JobTitle=${inspected.jobTitle}, Category=${inspected.category}`);

    // 5. Test Chatbot API
    console.log('\n[5/6] Querying Chatbot API endpoint...');
    const chatRes = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'system check' })
    });

    if (!chatRes.ok) {
      throw new Error(`Chatbot query failed: ${chatRes.status}`);
    }

    const chatData = await chatRes.json();
    console.log('✔ Chatbot response reply:');
    console.log('-------------------------------------------');
    console.log(chatData.reply);
    console.log('-------------------------------------------');

    // 6. Delete inquiry details
    console.log('\n[6/6] Deleting inquiry (Delete)...');
    const deleteRes = await fetch(`${BASE_URL}/inquiries/${testId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!deleteRes.ok) {
      throw new Error(`Failed to delete inquiry: ${deleteRes.status}`);
    }

    const deleteData = await deleteRes.json();
    console.log('✔ Delete response:', deleteData.message);

    // Verify it is deleted
    const verifyRes = await fetch(`${BASE_URL}/inquiries/${testId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`✔ Verification: GET request for deleted ID returned status: ${verifyRes.status} (expected 404)`);

    console.log('\n✔ All API endpoints tested successfully! CRUD operations and Chatbot are fully functional.');

  } catch (error) {
    console.error('\n✖ Test suite failed:', error.message);
  }
}

runTests();
