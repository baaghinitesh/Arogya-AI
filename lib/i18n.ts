import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources for National Indian Footprint
const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      about: 'About',
      chatHere: 'Chat Here',
      contact: 'Contact',
      
      // Splash Screen
      tagline: 'Arogya AI — Your WhatsApp health assistant for India',
      
      // Home Page
      heroTitle: 'AI-Powered Health Assistant for India',
      heroSubtitle: 'Get instant health guidance through WhatsApp in your preferred language - English, Hindi, Odia, Bengali, Tamil, Telugu, and more',
      startChat: 'Start Chat on WhatsApp',
      tryWebChat: 'Try Web Chat',
      
      // Features
      featuresTitle: 'Features',
      featuresSubtitle: 'Experience healthcare assistance like never before with our AI-powered platform',
      
      // Trust indicators
      hipaaCompliant: 'HIPAA Compliant',
      available24_7: '24/7 Available',
      healthcareFocused: 'Healthcare Focused',
      
      // Testimonials
      testimonialsTitle: 'Trusted by Thousands',
      testimonialsSubtitle: 'See what our users say about Arogya AI',
      testimonial1: 'Arogya AI helped me understand my symptoms quickly. The multilingual support is amazing!',
      testimonial2: 'Great service! Got immediate help through WhatsApp when I needed health advice.',
      testimonial3: 'The AI is very helpful and provides accurate health information in multiple Indian languages.',
      
      // CTA Section
      ctaTitle: 'Ready to Get Started?',
      ctaSubtitle: 'Join thousands of users who trust Arogya AI for their healthcare needs',
      getStarted: 'Get Started Today',
      multilingualTitle: 'Multilingual Support',
      multilingualDesc: 'Chat in English, Hindi, Odia, Bengali, Tamil, Telugu, and other Indian languages',
      instant24Title: '24/7 Instant Support',
      instant24Desc: 'Get health guidance anytime through WhatsApp',
      personalizedTitle: 'Personalized Care',
      personalizedDesc: 'Tailored health advice based on your symptoms',
      
      // How it Works
      howItWorksTitle: 'How it Works',
      step1Title: 'Send Message',
      step1Desc: 'Start a conversation on WhatsApp',
      step2Title: 'Describe Symptoms',
      step2Desc: 'Tell us about your health concerns',
      step3Title: 'Get Guidance',
      step3Desc: 'Receive personalized health advice',
      
      // Chat Interface
      typingIndicator: 'AI is typing...',
      messagePlaceholder: 'Type your health question...',
      sendMessage: 'Send',
      newChat: 'New Chat',
      searchChats: 'Search chats...',
      noChatsFound: 'No chats found',
      noChatsYet: 'No chats yet',
      sidebarFooter: 'Your chat history is private',
      startListening: 'Start voice input',
      stopListening: 'Stop listening',
      listening: 'Listening...',
      
      // Contact Form
      contactTitle: 'Contact Us',
      nameLabel: 'Name',
      emailLabel: 'Email',
      messageLabel: 'Message',
      fileUploadLabel: 'Upload File (Optional)',
      submitButton: 'Submit',
      
      // Common
      loading: 'Loading...',
      error: 'Something went wrong. Please try again.',
      success: 'Success!',

      // Register page
      mobileNumber: 'Mobile Number',
      personalInfo: 'Personal Info',
      regionLanguage: 'Region & Language',
      ready: 'Ready!',
      stepOf: 'Step',
      registerTitle: 'Register for Arogya AI',
      registrationComplete: 'Registration Complete!',
      step1Hint: 'Validate your phone number to access our WhatsApp and Web chatbot.',
      step2Hint: 'Help the AI know you better for accurate health recommendations.',
      step3Hint: 'Enter your pincode for local health alerts and pick your language.',
      step4Hint: 'Your profile is ready. Access your health companion anytime.',
      phonePlaceholder: 'Enter 10-digit number',
      devTip: 'Testing? Use verification code',
      devTipSuffix: 'at login.',
      continueToProfile: 'Continue to Profile',
      fullName: 'Full Name',
      namePlaceholder: 'Enter your name',
      age: 'Age',
      agePlaceholder: 'Age',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      back: 'Back',
      continue: 'Continue',
      pincode: 'Indian Pincode (6 Digits)',
      pincodePlaceholder: 'e.g. 110001',
      pincodeNotFound: 'Pincode valid, area not found.',
      locationUnavailable: 'Location lookup unavailable.',
      preferredLanguage: 'Preferred Language',
      registering: 'Registering...',
      submitDetails: 'Submit Details',
      welcomeUser: 'Welcome to Arogya AI',
      successMessage: 'Your number',
      successMessageSuffix: 'is registered. You can now access AI health guidance.',
      startWebChat: 'Start Web Chat',
      goToWhatsApp: 'Go to WhatsApp',
      alreadyRegistered: 'Already registered?',
      loginHere: 'Log in with OTP here',
      invalidPhone: 'Please enter a valid 10-digit mobile number.',
      nameRequired: 'Please enter your full name.',
      invalidAge: 'Please enter a valid age (1–120).',
      genderRequired: 'Please select your gender.',
      invalidPincode: 'Please enter a valid 6-digit Indian pincode.',
      registrationFailed: 'Registration failed. Number may already be registered.',
      connectionFailed: 'Connection failed. Please check your backend server.',

      // Sign-in page
      signInSubtitle: "Verify your identity to access India's health assistant",
      otpSentTo: 'Enter the 6-digit code sent to',
      otpSent: 'OTP sent successfully!',
      otpResent: 'A new OTP has been sent.',
      notRegistered: 'Phone number is not registered. Please sign up first.',
      sendingCode: 'Sending code...',
      getVerificationCode: 'Get Verification Code',
      otpCode: '6-Digit OTP Code',
      otpPlaceholder: 'Enter 6-digit code',
      changeNumber: 'Change Number',
      resendIn: 'Resend in',
      resendCode: 'Resend Code',
      verifying: 'Verifying...',
      verifyLogin: 'Verify & Login',
      enterOtp: 'Please enter the 6-digit verification code.',
      invalidOtp: 'Invalid or expired OTP. Please try again.',
      verifyFailed: 'Failed to verify OTP. Please try again.',
      resendFailed: 'Failed to resend OTP.',
      authSuccess: 'Successfully authenticated!',
      newToArogya: 'New to Arogya AI?',
      registerMobile: 'Register mobile here',
      havingTrouble: 'Having trouble? Contact',
      supportTeam: 'Support Team',
    }
  },
  hi: {
    translation: {
      // Navigation
      home: 'होम',
      about: 'हमारे बारे में',
      chatHere: 'यहाँ चैट करें',
      contact: 'संपर्क',
      
      // Splash Screen
      tagline: 'आरोग्य AI — भारत के लिए आपका व्हाट्सऐप स्वास्थ्य सहायक',
      
      // Home Page
      heroTitle: 'भारत के लिए AI-संचालित स्वास्थ्य सहायक',
      heroSubtitle: 'अपनी पसंदीदा भाषा में व्हाट्सऐप के माध्यम से तत्काल स्वास्थ्य मार्गदर्शन प्राप्त करें - अंग्रेजी, हिंदी, ओडिया, बंगाली, तमिल, तेलुगु, और अधिक',
      startChat: 'व्हाट्सऐप पर चैट शुरू करें',
      tryWebChat: 'वेब चैट आज़माएं',
      
      // Features
      featuresTitle: 'विशेषताएं',
      featuresSubtitle: 'हमारे AI-संचालित प्लेटफॉर्म के साथ स्वास्थ्य सहायता का अनुभव करें जैसा पहले कभी नहीं हुआ',
      
      // Trust indicators
      hipaaCompliant: 'HIPAA अनुपालित',
      available24_7: '24/7 उपलब्ध',
      healthcareFocused: 'स्वास्थ्य पर केंद्रित',
      
      // Testimonials
      testimonialsTitle: 'हजारों द्वारा भरोसेमंद',
      testimonialsSubtitle: 'देखें कि हमारे उपयोगकर्ता आरोग्य AI के बारे में क्या कहते हैं',
      testimonial1: 'आरोग्य AI ने मुझे अपने लक्षणों को जल्दी समझने में मदद की। बहुभाषी समर्थन अद्भुत है!',
      testimonial2: 'बेहतरीन सेवा! जब मुझे स्वास्थ्य सलाह की जरूरत थी तो व्हाट्सऐप के माध्यम से तुरंत मदद मिली।',
      testimonial3: 'AI बहुत मददगार है और कई भारतीय भाषाओं में सटीक स्वास्थ्य जानकारी प्रदान करता है।',
      
      // CTA Section
      ctaTitle: 'शुरू करने के लिए तैयार हैं?',
      ctaSubtitle: 'हजारों उपयोगकर्ताओं में शामिल हों जो अपनी स्वास्थ्य आवश्यकताओं के लिए आरोग्य AI पर भरोसा करते हैं',
      getStarted: 'आज ही शुरुआत करें',
      multilingualTitle: 'बहुभाषी समर्थन',
      multilingualDesc: 'अंग्रेजी, हिंदी, ओडिया, बंगाली, तमिल, तेलुगु, और अन्य भारतीय भाषाओं में चैट करें',
      instant24Title: '24/7 तत्काल सहायता',
      instant24Desc: 'व्हाट्सऐप के माध्यम से कभी भी स्वास्थ्य मार्गदर्शन प्राप्त करें',
      personalizedTitle: 'व्यक्तिगत देखभाल',
      personalizedDesc: 'आपके लक्षणों के आधार पर अनुकूलित स्वास्थ्य सलाह',
      
      // How it Works
      howItWorksTitle: 'यह कैसे काम करता है',
      step1Title: 'संदेश भेजें',
      step1Desc: 'व्हाट्सऐप पर बातचीत शुरू करें',
      step2Title: 'लक्षण बताएं',
      step2Desc: 'अपनी स्वास्थ्य चिंताओं के बारे में बताएं',
      step3Title: 'मार्गदर्शन प्राप्त करें',
      step3Desc: 'व्यक्तिगत स्वास्थ्य सलाह प्राप्त करें',
      
      // Chat Interface
      typingIndicator: 'AI टाइप कर रहा है...',
      messagePlaceholder: 'अपना स्वास्थ्य प्रश्न टाइप करें...',
      sendMessage: 'भेजें',
      newChat: 'नई चैट',
      searchChats: 'चैट खोजें...',
      noChatsFound: 'कोई चैट नहीं मिली',
      noChatsYet: 'अभी तक कोई चैट नहीं',
      sidebarFooter: 'आपका चैट इतिहास निजी है',
      startListening: 'आवाज इनपुट शुरू करें',
      stopListening: 'सुनना बंद करें',
      listening: 'सुन रहा है...',
      
      // Contact Form
      contactTitle: 'हमसे संपर्क करें',
      nameLabel: 'नाम',
      emailLabel: 'ईमेल',
      messageLabel: 'संदेश',
      fileUploadLabel: 'फ़ाइल अपलोड करें (वैकल्पिक)',
      submitButton: 'सबमिट करें',
      
      // Common
      loading: 'लोड हो रहा है...',
      error: 'कुछ गलत हुआ है। कृपया फिर से कोशिश करें।',
      success: 'सफलता!',

      // Register page
      mobileNumber: 'मोबाइल नंबर',
      personalInfo: 'व्यक्तिगत जानकारी',
      regionLanguage: 'क्षेत्र और भाषा',
      ready: 'तैयार!',
      stepOf: 'चरण',
      registerTitle: 'आरोग्य AI के लिए पंजीकरण करें',
      registrationComplete: 'पंजीकरण पूर्ण!',
      step1Hint: 'WhatsApp और वेब चैटबॉट तक पहुंचने के लिए अपना फोन नंबर सत्यापित करें।',
      step2Hint: 'सटीक स्वास्थ्य सिफारिशों के लिए AI को आपके बारे में बेहतर जानने दें।',
      step3Hint: 'स्थानीय स्वास्थ्य अलर्ट के लिए पिनकोड दर्ज करें और अपनी भाषा चुनें।',
      step4Hint: 'आपकी प्रोफ़ाइल तैयार है। कभी भी अपने स्वास्थ्य सहायक तक पहुंचें।',
      phonePlaceholder: '10 अंकों का नंबर दर्ज करें',
      devTip: 'परीक्षण? सत्यापन कोड उपयोग करें',
      devTipSuffix: 'लॉगिन पर।',
      continueToProfile: 'प्रोफ़ाइल पर जारी रखें',
      fullName: 'पूरा नाम',
      namePlaceholder: 'अपना नाम दर्ज करें',
      age: 'आयु',
      agePlaceholder: 'आयु',
      gender: 'लिंग',
      male: 'पुरुष',
      female: 'महिला',
      other: 'अन्य',
      back: 'वापस',
      continue: 'जारी रखें',
      pincode: 'भारतीय पिनकोड (6 अंक)',
      pincodePlaceholder: 'जैसे 110001',
      pincodeNotFound: 'पिनकोड वैध है, क्षेत्र नहीं मिला।',
      locationUnavailable: 'स्थान लुकअप अनुपलब्ध।',
      preferredLanguage: 'पसंदीदा भाषा',
      registering: 'पंजीकरण हो रहा है...',
      submitDetails: 'विवरण सबमिट करें',
      welcomeUser: 'आरोग्य AI में आपका स्वागत है',
      successMessage: 'आपका नंबर',
      successMessageSuffix: 'पंजीकृत है। अब आप AI स्वास्थ्य मार्गदर्शन प्राप्त कर सकते हैं।',
      startWebChat: 'वेब चैट शुरू करें',
      goToWhatsApp: 'WhatsApp पर जाएं',
      alreadyRegistered: 'पहले से पंजीकृत हैं?',
      loginHere: 'OTP से लॉगिन करें',
      invalidPhone: 'कृपया एक वैध 10 अंकों का मोबाइल नंबर दर्ज करें।',
      nameRequired: 'कृपया अपना पूरा नाम दर्ज करें।',
      invalidAge: 'कृपया एक वैध आयु (1–120) दर्ज करें।',
      genderRequired: 'कृपया अपना लिंग चुनें।',
      invalidPincode: 'कृपया एक वैध 6 अंकों का भारतीय पिनकोड दर्ज करें।',
      registrationFailed: 'पंजीकरण विफल। नंबर पहले से पंजीकृत हो सकता है।',
      connectionFailed: 'कनेक्शन विफल। कृपया अपना बैकएंड सर्वर जांचें।',

      // Sign-in page
      signInSubtitle: 'भारत के स्वास्थ्य सहायक तक पहुंचने के लिए अपनी पहचान सत्यापित करें',
      otpSentTo: 'को भेजा गया 6 अंकों का कोड दर्ज करें',
      otpSent: 'OTP सफलतापूर्वक भेजा गया!',
      otpResent: 'एक नया OTP भेजा गया है।',
      notRegistered: 'फोन नंबर पंजीकृत नहीं है। कृपया पहले साइन अप करें।',
      sendingCode: 'कोड भेजा जा रहा है...',
      getVerificationCode: 'सत्यापन कोड प्राप्त करें',
      otpCode: '6 अंकों का OTP कोड',
      otpPlaceholder: '6 अंकों का कोड दर्ज करें',
      changeNumber: 'नंबर बदलें',
      resendIn: 'में पुनः भेजें',
      resendCode: 'कोड पुनः भेजें',
      verifying: 'सत्यापन हो रहा है...',
      verifyLogin: 'सत्यापित करें और लॉगिन करें',
      enterOtp: 'कृपया 6 अंकों का सत्यापन कोड दर्ज करें।',
      invalidOtp: 'अमान्य या समाप्त OTP। कृपया पुनः प्रयास करें।',
      verifyFailed: 'OTP सत्यापन विफल। कृपया पुनः प्रयास करें।',
      resendFailed: 'OTP पुनः भेजने में विफल।',
      authSuccess: 'सफलतापूर्वक प्रमाणित!',
      newToArogya: 'आरोग्य AI में नए हैं?',
      registerMobile: 'यहाँ मोबाइल पंजीकृत करें',
      havingTrouble: 'समस्या हो रही है? संपर्क करें',
      supportTeam: 'सहायता टीम',
    }
  },
  od: {
    translation: {
      // Navigation
      home: 'ଘର',
      about: 'ଆମ ବିଷୟରେ',
      chatHere: 'ଏଠାରେ ଚାଟ୍ କରନ୍ତୁ',
      contact: 'ଯୋଗାଯୋଗ',
      
      // Splash Screen
      tagline: 'ଆରୋଗ୍ୟ AI — ଭାରତ ପାଇଁ ଆପଣଙ୍କର ହ୍ୱାଟସ୍ଆପ୍ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ',
      
      // Home Page
      heroTitle: 'ଭାରତ ପାଇଁ AI-ଚାଳିତ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ',
      heroSubtitle: 'ଆପଣଙ୍କର ପସନ୍ଦିତ ଭାଷାରେ ହ୍ୱାଟସ୍ଆପ୍ ମାଧ୍ୟମରେ ତୁରନ୍ତ ସ୍ୱାସ୍ଥ୍ୟ ମାର୍ଗଦର୍ଶନ ପାଆନ୍ତୁ - ଇଂରାଜୀ, ହିନ୍ଦୀ, ଓଡ଼ିଆ, ବଙ୍ଗଳା, ତାମିଲ୍, ତେଲୁଗୁ ଏବଂ ଅନ୍ୟାନ୍ୟ',
      startChat: 'ହ୍ୱାଟସ୍ଆପରେ ଚାଟ୍ ଆରମ୍ଭ କରନ୍ତୁ',
      tryWebChat: 'ୱେବ୍ ଚାଟ୍ ଚେଷ୍ଟା କରନ୍ତୁ',
      
      // Features
      featuresTitle: 'ବିଶେଷତା',
      featuresSubtitle: 'ଆମର AI-ଚାଳିତ ପ୍ଲାଟଫର୍ମ ସହିତ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟତା ଅନୁଭବ କରନ୍ତୁ ଯେପରି ପୂର୍ବରୁ କେବେ ହୋଇନାହିଁ',
      
      // Trust indicators
      hipaaCompliant: 'HIPAA ଅନୁପାଳିତ',
      available24_7: '24/7 ଉପଲବ୍ଧ',
      healthcareFocused: 'ସ୍ୱାସ୍ଥ୍ୟ ଉପରେ କେନ୍ଦ୍ରିତ',
      
      // Testimonials
      testimonialsTitle: 'ହଜାରେ ଲୋକଙ୍କ ଦ୍ୱାରା ବିଶ୍ୱସ୍ତ',
      testimonialsSubtitle: 'ଦେଖନ୍ତୁ ଆମର ଉପଯୋଗକାରୀମାନେ ଆରୋଗ୍ୟ AI ବିଷୟରେ କଣ କୁହନ୍ତି',
      testimonial1: 'ଆରୋଗ୍ୟ AI ମୋର ଲକ୍ଷଣଗୁଡ଼ିକୁ ଶୀଘ୍ର ବୁଝିବାରେ ସାହାଯ୍ୟ କଲା। ବହୁଭାଷିକ ସମର୍ଥନ ଅଦ୍ଭୁତ!',
      testimonial2: 'ଉତ୍କୃଷ୍ଟ ସେବା! ଯେତେବେଳେ ମୁଁ ସ୍ୱାସ୍ଥ୍ୟ ପରାମର୍ଶ ଆବଶ୍ୟକ କରୁଥିଲି, ହ୍ୱାଟସ୍ଆପ୍ ମାଧ୍ୟମରେ ତୁରନ୍ତ ସାହାଯ୍ୟ ପାଇଲି।',
      testimonial3: 'AI ବହୁତ ସହାୟକ ଏବଂ ବିଭିନ୍ନ ଭାରତୀୟ ଭାଷାରେ ସଠିକ୍ ସ୍ୱାସ୍ଥ୍ୟ ତଥ୍ୟ ପ୍ରଦାନ କରେ।',
      
      // CTA Section
      ctaTitle: 'ଆରମ୍ଭ କରିବା ପାଇଁ ପ୍ରସ୍ତୁତ?',
      ctaSubtitle: 'ହଜାରେ ଉପଯୋଗକାରୀଙ୍କ ସହିତ ଯୋଗ ଦିଅନ୍ତୁ ଯେଉଁମାନେ ସେମାନଙ୍କର ସ୍ୱାସ୍ଥ୍ୟ ଆବଶ୍ୟକତା ପାଇଁ ଆରୋଗ୍ୟ AI ଉପରେ ଭରସା କରନ୍ତି',
      getStarted: 'ଆଜି ହିଁ ଆରମ୍ଭ କରନ୍ତୁ',
      multilingualTitle: 'ବହୁଭାଷିକ ସମର୍ଥନ',
      multilingualDesc: 'ଇଂରାଜୀ, ହିନ୍ଦୀ, ଓଡ଼ିଆ, ବଙ୍ଗଳା, ତାମିଲ୍, ତେଲୁଗୁ ଏବଂ ଅନ୍ୟ ଭାରତୀୟ ଭାଷାରେ ଚାଟ୍ କରନ୍ତୁ',
      instant24Title: '24/7 ତୁରନ୍ତ ସହାୟତା',
      instant24Desc: 'ହ୍ୱାଟସ୍ଆପ୍ ମାଧ୍ୟମରେ ଯେକୌଣସି ସମୟରେ ସ୍ୱାସ୍ଥ୍ୟ ମାର୍ଗଦର୍ଶନ ପାଆନ୍ତୁ',
      personalizedTitle: 'ବ୍ୟକ୍ତିଗତ ଯତ୍ନ',
      personalizedDesc: 'ଆପଣଙ୍କର ଲକ୍ଷଣ ଉପରେ ଆଧାରିତ ଅନୁକୂଳିତ ସ୍ୱାସ୍ଥ୍ୟ ପରାମର୍ଶ',
      
      // How it Works
      howItWorksTitle: 'ଏହା କିପରି କାମ କରେ',
      step1Title: 'ସନ୍ଦେଶ ପଠାନ୍ତୁ',
      step1Desc: 'ହ୍ୱାଟସ୍ଆପରେ ବାର୍ତ୍ତାଳାପ ଆରମ୍ଭ କରନ୍ତୁ',
      step2Title: 'ଲକ୍ଷଣ ବର୍ଣ୍ଣନା କରନ୍ତୁ',
      step2Desc: 'ଆପଣଙ୍କର ସ୍ୱାସ୍ଥ୍ୟ ଚିନ୍ତା ବିଷୟରେ କହନ୍ତୁ',
      step3Title: 'ମାର୍ଗଦର୍ଶନ ପାଆନ୍ତୁ',
      step3Desc: 'ବ୍ୟକ୍ତିଗତ ସ୍ୱାସ୍ଥ୍ୟ ପରାମର୍ଶ ପାଆନ୍ତୁ',
      
      // Chat Interface
      typingIndicator: 'AI ଟାଇପ୍ କରୁଛି...',
      messagePlaceholder: 'ଆପଣଙ୍କର ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଶ୍ନ ଟାଇପ୍ କରନ୍ତୁ...',
      sendMessage: 'ପଠାନ୍ତୁ',
      newChat: 'ନୂଆ ଚାଟ୍',
      searchChats: 'ଚାଟ୍ ଖୋଜନ୍ତୁ...',
      noChatsFound: 'କୌଣସି ଚାଟ୍ ମିଳିଲା ନାହିଁ',
      noChatsYet: 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଚାଟ୍ ନାହିଁ',
      sidebarFooter: 'ଆପଣଙ୍କର ଚାଟ୍ ଇତିହାସ ବ୍ୟକ୍ତିଗତ',
      startListening: 'ସ୍ୱର ଇନପୁଟ୍ ଆରମ୍ଭ କରନ୍ତୁ',
      stopListening: 'ଶຸଣିବା ବନ୍ଦ କରନ୍ତୁ',
      listening: 'ଶୁଣୁଛି...',
      
      // Contact Form
      contactTitle: 'ଆମ ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ',
      nameLabel: 'ନାମ',
      emailLabel: 'ଇମେଲ୍',
      messageLabel: 'ସନ୍ଦେଶ',
      fileUploadLabel: 'ଫାଇଲ୍ ଅପଲୋଡ୍ କରନ୍ତୁ (ଇଚ୍ଛାଧୀନ)',
      submitButton: 'ଦାଖଲ କରନ୍ତୁ',
      
      // Common
      loading: 'ଲୋଡ୍ ହେଉଛି...',
      error: 'କିଛି ଭୁଲ୍ ହୋଇଗଲା। ଦୟାକରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।',
      success: 'ସଫଳତା!',

      // Register page
      mobileNumber: 'ମୋବାଇଲ୍ ନମ୍ବର',
      personalInfo: 'ବ୍ୟକ୍ତିଗତ ତଥ୍ୟ',
      regionLanguage: 'ଅଞ୍ଚଳ ଏବଂ ଭାଷା',
      ready: 'ପ୍ରସ୍ତୁତ!',
      stepOf: 'ଧାପ',
      registerTitle: 'ଆରୋଗ୍ୟ AI ପାଇଁ ପଞ୍ଜୀକରଣ କରନ୍ତୁ',
      registrationComplete: 'ପଞ୍ଜୀକରଣ ସମ୍ପୂର୍ଣ!',
      step1Hint: 'WhatsApp ଏବଂ ୱେବ ଚ୍ୟାଟ୍ ବ୍ୟବହାର ପାଇଁ ଆପଣଙ୍କ ଫୋନ୍ ନମ୍ବର ଯାଞ୍ଚ କରନ୍ତୁ।',
      step2Hint: 'ସଠିକ୍ ସ୍ୱାସ୍ଥ୍ୟ ସୁପାରିଶ ପାଇଁ AI କୁ ଆପଣଙ୍କ ବିଷୟରେ ଜଣାନ୍ତୁ।',
      step3Hint: 'ସ୍ଥାନୀୟ ସ୍ୱାସ୍ଥ୍ୟ ସତର୍କତା ପାଇଁ ପିନ୍‌କୋଡ୍ ଦିଅନ୍ତୁ ଏବଂ ଭାଷା ବାଛନ୍ତୁ।',
      step4Hint: 'ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ପ୍ରସ୍ତୁତ। ଯେକୌଣସି ସମୟରେ ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ ବ୍ୟବହାର କରନ୍ତୁ।',
      phonePlaceholder: '10 ଅଙ୍କ ନମ୍ବର ଦିଅନ୍ତୁ',
      devTip: 'ପରୀକ୍ଷା? ଯାଞ୍ଚ କୋଡ୍ ବ୍ୟବହାର କରନ୍ତୁ',
      devTipSuffix: 'ଲଗଇନ୍‌ରେ।',
      continueToProfile: 'ପ୍ରୋଫାଇଲ୍‌କୁ ଜାରି ରଖନ୍ତୁ',
      fullName: 'ପୂରା ନାମ',
      namePlaceholder: 'ଆପଣଙ୍କ ନାମ ଦିଅନ୍ତୁ',
      age: 'ବୟସ',
      agePlaceholder: 'ବୟସ',
      gender: 'ଲିଙ୍ଗ',
      male: 'ପୁରୁଷ',
      female: 'ମହିଳା',
      other: 'ଅନ୍ୟ',
      back: 'ଫେରନ୍ତୁ',
      continue: 'ଜାରି ରଖନ୍ତୁ',
      pincode: 'ଭାରତୀୟ ପିନ୍‌କୋଡ୍ (6 ଅଙ୍କ)',
      pincodePlaceholder: 'ଯଥା 751001',
      pincodeNotFound: 'ପିନ୍‌କୋଡ୍ ବୈଧ, ଅଞ୍ଚଳ ମିଳିଲା ନାହିଁ।',
      locationUnavailable: 'ସ୍ଥାନ ଲୁକ୍‌ଅପ୍ ଅନୁପଲବ୍ଧ।',
      preferredLanguage: 'ପସନ୍ଦିତ ଭାଷା',
      registering: 'ପଞ୍ଜୀକରଣ ହେଉଛି...',
      submitDetails: 'ବିବରଣ ଦାଖଲ କରନ୍ତୁ',
      welcomeUser: 'ଆରୋଗ୍ୟ AI ରେ ସ୍ୱାଗତ',
      successMessage: 'ଆପଣଙ୍କ ନମ୍ବର',
      successMessageSuffix: 'ପଞ୍ଜୀକୃତ। ଆପଣ ଏବେ AI ସ୍ୱାସ୍ଥ୍ୟ ମାର୍ଗଦର୍ଶନ ପ୍ରାପ୍ତ କରିପାରିବେ।',
      startWebChat: 'ୱେବ ଚ୍ୟାଟ୍ ଆରମ୍ଭ କରନ୍ତୁ',
      goToWhatsApp: 'WhatsApp ରେ ଯାଆନ୍ତୁ',
      alreadyRegistered: 'ପୂର୍ବରୁ ପଞ୍ଜୀକୃତ?',
      loginHere: 'OTP ଦ୍ୱାରା ଲଗଇନ୍ କରନ୍ତୁ',
      invalidPhone: 'ଦୟାକରି ଏକ ବୈଧ 10 ଅଙ୍କ ମୋବାଇଲ୍ ନମ୍ବର ଦିଅନ୍ତୁ।',
      nameRequired: 'ଦୟାକରି ଆପଣଙ୍କ ପୂରା ନାମ ଦିଅନ୍ତୁ।',
      invalidAge: 'ଦୟାକରି ଏକ ବୈଧ ବୟସ (1–120) ଦିଅନ୍ତୁ।',
      genderRequired: 'ଦୟାକରି ଆପଣଙ୍କ ଲିଙ୍ଗ ବାଛନ୍ତୁ।',
      invalidPincode: 'ଦୟାକରି ଏକ ବୈଧ 6 ଅଙ୍କ ଭାରତୀୟ ପିନ୍‌କୋଡ୍ ଦିଅନ୍ତୁ।',
      registrationFailed: 'ପଞ୍ଜୀକରଣ ବିଫଳ। ନମ୍ବର ପୂର୍ବରୁ ପଞ୍ଜୀକୃତ ହୋଇଥାଇ ପାରେ।',
      connectionFailed: 'ସଂଯୋଗ ବିଫଳ। ଦୟାକରି ଆପଣଙ୍କ ବ୍ୟାକ୍‌ଏଣ୍ଡ ସର୍ଭର ଯାଞ୍ଚ କରନ୍ତୁ।',

      // Sign-in page
      signInSubtitle: 'ଭାରତର ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ ବ୍ୟବହାର ପାଇଁ ଆପଣଙ୍କ ପରିଚୟ ଯାଞ୍ଚ କରନ୍ତୁ',
      otpSentTo: 'ଏହି ନମ୍ବରରେ ପଠାଯାଇଥିବା 6 ଅଙ୍କ କୋଡ୍ ଦିଅନ୍ତୁ',
      otpSent: 'OTP ସଫଳତାର ସହ ପଠାଯାଇଛି!',
      otpResent: 'ଏକ ନୂଆ OTP ପଠାଯାଇଛି।',
      notRegistered: 'ଫୋନ୍ ନମ୍ବର ପଞ୍ଜୀକୃତ ନୁହେଁ। ଦୟାକରି ପ୍ରଥମେ ସାଇନ୍ ଅପ୍ କରନ୍ତୁ।',
      sendingCode: 'କୋଡ୍ ପଠାଯାଉଛି...',
      getVerificationCode: 'ଯାଞ୍ଚ କୋଡ୍ ପ୍ରାପ୍ତ କରନ୍ତୁ',
      otpCode: '6 ଅଙ୍କ OTP କୋଡ୍',
      otpPlaceholder: '6 ଅଙ୍କ କୋଡ୍ ଦିଅନ୍ତୁ',
      changeNumber: 'ନମ୍ବର ବଦଳାନ୍ତୁ',
      resendIn: 'ରେ ପୁଣି ପଠାନ୍ତୁ',
      resendCode: 'କୋଡ୍ ପୁଣି ପଠାନ୍ତୁ',
      verifying: 'ଯାଞ୍ଚ ହେଉଛି...',
      verifyLogin: 'ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ ଲଗଇନ୍ କରନ୍ତୁ',
      enterOtp: 'ଦୟାକରି 6 ଅଙ୍କ ଯାଞ୍ଚ କୋଡ୍ ଦିଅନ୍ତୁ।',
      invalidOtp: 'ଅବୈଧ ବା ମିଆଦ ଶେଷ OTP। ଦୟାକରି ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।',
      verifyFailed: 'OTP ଯାଞ୍ଚ ବିଫଳ। ଦୟାକରି ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।',
      resendFailed: 'OTP ପୁଣି ପଠାଇବାରେ ବିଫଳ।',
      authSuccess: 'ସଫଳତାର ସହ ପ୍ରମାଣୀକୃତ!',
      newToArogya: 'ଆରୋଗ୍ୟ AI ରେ ନୂଆ?',
      registerMobile: 'ଏଠାରେ ମୋବାଇଲ୍ ପଞ୍ଜୀକରଣ କରନ୍ତୁ',
      havingTrouble: 'ସମସ୍ୟା ହେଉଛି? ଯୋଗାଯୋଗ କରନ୍ତୁ',
      supportTeam: 'ସହାୟତା ଦଳ',
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false // react already does escaping
    }
  });

export default i18n;