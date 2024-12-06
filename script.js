document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.querySelector('.chat-window');
    const closeChat = document.querySelector('.close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const languageSelector = document.getElementById('language');

    // Chatbot conversation states
    const conversationStates = {
        INITIAL_GREETING: 'initial_greeting',
        AWAITING_SERVICE_REQUEST: 'awaiting_service_request',
        PROVIDING_SERVICE_INFO: 'providing_service_info'
    };

    let currentState = conversationStates.INITIAL_GREETING;

    // Toggle Chat Window
    chatToggle.addEventListener('click', function() {
        if (chatWindow.style.display === 'flex') {
            chatWindow.style.display = 'none';
            chatToggle.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)'; // Apply shadow to toggle button
        } else {
            chatWindow.style.display = 'flex';
            chatToggle.style.boxShadow = '0 0 0 rgba(0,0,0,0)'; // Ensure no shadow when open
            initializeChatbot();
        }
    });

    // Close Chat Window
    closeChat.addEventListener('click', function() {
        chatWindow.style.display = 'none';
    });

    // Ensure only the chat icon is visible initially
    chatWindow.style.display = 'none';
    chatToggle.style.display = 'block';
    chatToggle.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)'; // Initial shadow for toggle button

    // Add message to chat
    function addMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Language translations
    const translations = {
        en: {
            greeting: [
                'Hello! 👋 Welcome to CSC Kanish Online Services.',
                'I\'m your digital assistant ready to help you.',
                'How may I assist you today?'
            ],
            servicePrompt: 'What service can I assist you with today?',
            categoriesPrompt: 'Our Service Categories:',
            helpPrompt: 'I can help you with various services!',
            unrecognized: [
                'I\'m sorry, I didn\'t quite understand that.',
                'Could you please rephrase your request?',
                'You can ask about:',
                '- Aadhaar Services',
                '- Passport Support',
                '- Pension Schemes',
                '- Bill Payments',
                '- And more!'
            ]
        },
        bn: {
            greeting: [
                'হ্যালো! 👋 CSC Kanish Online Services-এ স্বাগতম।',
                'আমি আপনার ডিজিটাল সহকারী, আপনাকে সাহায্য করতে প্রস্তুত।',
                'আজ আমি আপনাকে কিভাবে সাহায্য করতে পারি?'
            ],
            servicePrompt: 'আজ আমি আপনাকে কোন পরিষেবায় সাহায্য করতে পারি?',
            categoriesPrompt: 'আমাদের পরিষেবা বিভাগ:',
            helpPrompt: 'আমি আপনাকে বিভিন্ন পরিষেবায় সাহায্য করতে পারি!',
            unrecognized: [
                'দুঃখিত, আমি ঠিক বুঝতে পারিনি।',
                'আপনি কি অনুগ্রহ করে আপনার অনুরোধটি পুনরায় বলতে পারেন?',
                'আপনি জিজ্ঞাসা করতে পারেন:',
                '- আধার পরিষেবা',
                '- পাসপোর্ট সহায়তা',
                '- পেনশন প্রকল্প',
                '- বিল পেমেন্ট',
                '- এবং আরও অনেক কিছু!'
            ]
        },
        as: {
            greeting: [
                'নমস্কাৰ! 👋 CSC Kanish Online Services-ত আপোনাক স্বাগতম।',
                'মই আপোনাৰ ডিজিটেল সহায়ক, আপোনাক সহায় কৰিবলৈ সাজু।',
                'আজি মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?'
            ],
            servicePrompt: 'আজি মই আপোনাক কোনটো সেৱাত সহায় কৰিব পাৰোঁ?',
            categoriesPrompt: 'আমাৰ সেৱা শ্ৰেণীবিভাগ:',
            helpPrompt: 'মই আপোনাক বিভিন্ন সেৱাত সহায় কৰিব পাৰোঁ!',
            unrecognized: [
                'মাফ কৰক, মই সঠিকভাৱে বুজিব পৰা নাই।',
                'আপুনি অনুগ্ৰহ কৰি আপোনাৰ অনুৰোধটো পুনৰ ক’ব পাৰেনে?',
                'আপুনি সোধিব পাৰে:',
                '- আধাৰ সেৱা',
                '- পাছপ’ৰ্ট সহায়',
                '- পেঞ্চন আঁচনি',
                '- বিল পেমেণ্ট',
                '- আৰু বহুত বেছি!'
            ]
        },
        hi: {
            greeting: [
                'नमस्ते! 👋 CSC Kanish Online Services में आपका स्वागत है।',
                'मैं आपका डिजिटल सहायक, आपकी मदद के लिए तैयार हूँ।',
                'आज मैं आपकी कैसे मदद कर सकता हूँ?'
            ],
            servicePrompt: 'आज मैं आपकी किस सेवा में मदद कर सकता हूँ?',
            categoriesPrompt: 'हमारी सेवा श्रेणियाँ:',
            helpPrompt: 'मैं आपको विभिन्न सेवाओं में मदद कर सकता हूँ!',
            unrecognized: [
                'मुझे खेद है, मैं इसे ठीक से समझ नहीं पाया।',
                'क्या आप कृपया अपने अनुरोध को दोबारा कह सकते हैं?',
                'आप पूछ सकते हैं:',
                '- आधार सेवाएँ',
                '- पासपोर्ट सहायता',
                '- पेंशन योजनाएँ',
                '- बिल भुगतान',
                '- और भी बहुत कुछ!'
            ]
        }
    };

    // Update chatbot language
    function updateLanguage() {
        const selectedLanguage = languageSelector.value;
        const langData = translations[selectedLanguage];
        chatMessages.innerHTML = '';
        langData.greeting.forEach(message => addMessage('bot', message));
    }

    languageSelector.addEventListener('change', updateLanguage);

    // Initialize Chatbot with selected language
    function initializeChatbot() {
        updateLanguage();
        currentState = conversationStates.INITIAL_GREETING;
    }

    // Service Categories
    const serviceCategories = {
        'Government Services': [
            'Aadhaar Card',
            'Passport Services',
            'Pension Schemes',
            'Birth/Death Certificates',
            'Utility Bill Payments'
        ],
        'Financial Services': [
            'Banking Support',
            'Insurance Services',
            'Loan Applications'
        ],
        'Digital Services': [
            'Online Registrations',
            'Digital Literacy Programs',
            'Skill Development'
        ]
    };

    // Process User Input
    function processUserInput(input) {
        input = input.toLowerCase().trim();

        // Initial greeting responses
        const greetings = ['hi', 'hello', 'hey', 'hola', 'namaste'];
        if (greetings.some(greeting => input.includes(greeting))) {
            return [
                'Hello! 😊 Welcome to CSC Kanish Online Services.',
                'I\'m here to help you with various government and citizen services.',
                'What service can I assist you with today?'
            ];
        }

        // Service request handling
        const serviceKeywords = {
            'aadhaar': 'Aadhaar Card Services: Enrollment, updates, and printing support. Required documents: Identity Proof, Address Proof, Photograph.',
            'passport': 'Passport Services: Application assistance and tracking. Documents needed: Birth Certificate, Aadhaar, Educational Certificates.',
            'pension': 'Pension Schemes: Support for various government pension plans. Required: Aadhaar, Age Proof, Bank Details.',
            'bill': 'Utility Bill Payments: Electricity, Water, Gas bill payment services available.',
            'certificate': 'Certificate Services: Birth, Death, and other essential document support.'
        };

        // Check for specific service keywords
        for (const [keyword, response] of Object.entries(serviceKeywords)) {
            if (input.includes(keyword)) {
                return [
                    response,
                    'Would you like more details about this service?',
                    'I can help you with document requirements and next steps.'
                ];
            }
        }

        // General service categories
        if (input.includes('service') || input.includes('help')) {
            let categoriesList = 'Our Service Categories:\n';
            Object.keys(serviceCategories).forEach((category, index) => {
                categoriesList += `${index + 1}. ${category}\n`;
            });
            
            return [
                'I can help you with various services!',
                categoriesList,
                'Which category interests you most?'
            ];
        }

        // Default response for unrecognized input
        return [
            'I\'m sorry, I didn\'t quite understand that.',
            'Could you please rephrase your request?',
            'You can ask about:',
            '- Aadhaar Services',
            '- Passport Support',
            '- Pension Schemes',
            '- Bill Payments',
            '- And more!'
        ];
    }

    // Event Listener for User Input
    userInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const input = userInput.value.trim();
            if (input) {
                // Add user message
                addMessage('user', input);
                
                // Get bot response
                const responses = processUserInput(input);
                
                // Add bot responses
                responses.forEach(response => {
                    addMessage('bot', response);
                });
                
                // Clear input
                userInput.value = '';
            }
        }
    });

    // Initial state
    initializeChatbot();
});
