import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      about: 'About',
      chatHere: 'Chat Here',
      contact: 'Contact',
      
      // Splash Screen
      tagline: 'Arogya AI — Your WhatsApp health assistant for Odisha',
      
      // Home Page
      heroTitle: 'AI-Powered Health Assistant for Odisha',
      heroSubtitle: 'Get instant health guidance through WhatsApp in your preferred language - English, Hindi, or Odia',
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
      testimonial3: 'The AI is very helpful and provides accurate health information in Odia.',
      
      // CTA Section
      ctaTitle: 'Ready to Get Started?',
      ctaSubtitle: 'Join thousands of users who trust Arogya AI for their healthcare needs',
      getStarted: 'Get Started Today',
      multilingualTitle: 'Multilingual Support',
      multilingualDesc: 'Chat in English, Hindi (हिन्दी), or Odia (ଓଡ଼ିଆ)',
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
      tagline: 'आरोग्य AI — ओडिशा के लिए आपका व्हाट्सऐप स्वास्थ्य सहायक',
      
      // Home Page
      heroTitle: 'ओडिशा के लिए AI-संचालित स्वास्थ्य सहायक',
      heroSubtitle: 'अपनी पसंदीदा भाषा में व्हाट्सऐप के माध्यम से तत्काल स्वास्थ्य मार्गदर्शन प्राप्त करें - अंग्रेजी, हिंदी, या ओडिया',
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
      testimonial3: 'AI बहुत मददगार है और ओडिया में सटीक स्वास्थ्य जानकारी प्रदान करता है।',
      
      // CTA Section
      ctaTitle: 'शुरू करने के लिए तैयार हैं?',
      ctaSubtitle: 'हजारों उपयोगकर्ताओं में शामिल हों जो अपनी स्वास्थ्य आवश्यकताओं के लिए आरोग्य AI पर भरोसा करते हैं',
      getStarted: 'आज ही शुरुआत करें',
      multilingualTitle: 'बहुभाषी समर्थन',
      multilingualDesc: 'अंग्रेजी, हिंदी (हिन्दी), या ओडिया (ଓଡ଼ିଆ) में चैट करें',
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
      tagline: 'ଆରୋଗ୍ୟ AI — ଓଡ଼ିଶା ପାଇଁ ଆପଣଙ୍କର ହ୍ୱାଟସ୍ଆପ୍ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ',
      
      // Home Page
      heroTitle: 'ଓଡ଼ିଶା ପାଇଁ AI-ଚାଳିତ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ',
      heroSubtitle: 'ଆପଣଙ୍କର ପସନ୍ଦିତ ଭାଷାରେ ହ୍ୱାଟସ୍ଆପ୍ ମାଧ୍ୟମରେ ତୁରନ୍ତ ସ୍ୱାସ୍ଥ୍ୟ ମାର୍ଗଦର୍ଶନ ପାଆନ୍ତୁ - ଇଂରାଜୀ, ହିନ୍ଦୀ, କିମ୍ବା ଓଡ଼ିଆ',
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
      testimonial3: 'AI ବହୁତ ସହାୟକ ଏବଂ ଓଡ଼ିଆରେ ସଠିକ୍ ସ୍ୱାସ୍ଥ୍ୟ ତଥ୍ୟ ପ୍ରଦାନ କରେ।',
      
      // CTA Section
      ctaTitle: 'ଆରମ୍ଭ କରିବା ପାଇଁ ପ୍ରସ୍ତୁତ?',
      ctaSubtitle: 'ହଜାରେ ଉପଯୋଗକାରୀଙ୍କ ସହିତ ଯୋଗ ଦିଅନ୍ତୁ ଯେଉଁମାନେ ସେମାନଙ୍କର ସ୍ୱାସ୍ଥ୍ୟ ଆବଶ୍ୟକତା ପାଇଁ ଆରୋଗ୍ୟ AI ଉପରେ ଭରସା କରନ୍ତି',
      getStarted: 'ଆଜି ହିଁ ଆରମ୍ଭ କରନ୍ତୁ',
      multilingualTitle: 'ବହୁଭାଷିକ ସମର୍ଥନ',
      multilingualDesc: 'ଇଂରାଜୀ, ହିନ୍ଦୀ (हिन्दी), କିମ୍ବା ଓଡ଼ିଆ (ଓଡ଼ିଆ)ରେ ଚାଟ୍ କରନ୍ତୁ',
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
      stopListening: 'ଶୁଣିବା ବନ୍ଦ କରନ୍ତୁ',
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