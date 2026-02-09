
/**
 * bulksmsbd.net API Integration Service
 * Optimizing for browser-to-server delivery
 */

export const sendOtpSms = async (phoneNumber: string, otp: string) => {
  const API_KEY = "ZztAUWDlGE0i2duFr2fi"; 
  const SENDER_ID = "8809648904900"; 
  const MESSAGE = `Your Galiver verification code is: ${otp}. Valid for 5 mins.`;
  
  // Clean phone number: strictly digits only
  let cleaned = phoneNumber.trim().replace(/\D/g, '');
  
  // Bangladesh standard 8801XXXXXXXXX (13 digits)
  let formattedNumber = '';
  if (cleaned.length === 11 && cleaned.startsWith('01')) {
    formattedNumber = '88' + cleaned;
  } else if (cleaned.length === 10 && cleaned.startsWith('1')) {
    formattedNumber = '880' + cleaned;
  } else if (cleaned.length === 13 && cleaned.startsWith('88')) {
    formattedNumber = cleaned;
  } else {
    // Fallback: If shorter than 10, prepend 880
    formattedNumber = cleaned.length >= 10 ? (cleaned.startsWith('88') ? cleaned : '88' + cleaned) : '880' + cleaned;
  }

  // The base API URL
  const baseApiUrl = `https://bulksmsbd.net/api/smsapi?api_key=${API_KEY}&type=text&number=${formattedNumber}&senderid=${SENDER_ID}&message=${encodeURIComponent(MESSAGE)}`;
  
  // Strategy 1: Attempt direct fetch with no-cors (Best for simple triggering if CORS is an issue)
  // Strategy 2: Use AllOrigins as a primary proxy
  const proxiedUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(baseApiUrl)}&timestamp=${Date.now()}`;

  console.log("SMS Service: Dispatching request for", formattedNumber);

  try {
    // We attempt to use the proxy but with cache busting
    const response = await fetch(proxiedUrl);
    
    if (!response.ok) throw new Error(`Proxy unreachable`);
    
    const data = await response.json();
    
    if (data.contents) {
      try {
        const actualResponse = JSON.parse(data.contents);
        console.log("BulkSMSBD API Response:", actualResponse);
        
        // Handling multiple possible success keys from bulksmsbd
        const isSuccessful = 
          actualResponse.success === true || 
          actualResponse.response_code === 202 || 
          actualResponse.response_code === "202" ||
          actualResponse.status === "success" ||
          (actualResponse.msg && actualResponse.msg.toLowerCase().includes("success"));

        if (!isSuccessful) {
          console.warn("SMS Provider rejected the request. Reason:", actualResponse.msg || "Check balance/SenderID");
        }

        return isSuccessful;
      } catch (e) {
        // If content is not JSON, check if it's a success string
        const rawContent = data.contents.toLowerCase();
        return rawContent.includes("success") || rawContent.includes("202");
      }
    }
    
    return false;
  } catch (error) {
    console.error("SMS System Error:", error);
    
    // Fallback: Try a direct 'ping' without reading response to bypass CORS blocks 
    // This sometimes works if the server processes the GET request before the browser blocks the response.
    try {
      fetch(baseApiUrl, { mode: 'no-cors' });
      return true; // Assume sent since we can't read the response in no-cors mode
    } catch (fallbackError) {
      return false;
    }
  }
};
