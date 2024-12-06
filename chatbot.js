(function() {
    // Wait for the entire page to load
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Chatbot script initialized');

        // Comprehensive debug logging function
        function debugLog(message, element = null) {
            console.log(`🤖 CHATBOT DEBUG: ${message}`);
            if (element) {
                console.log('Element details:', {
                    exists: !!element,
                    classList: element.classList ? Array.from(element.classList) : 'No classes',
                    style: element.style ? element.style.cssText : 'No inline styles'
                });
            }
        }

        // Select all required elements with detailed logging
        const chatbotContainer = document.querySelector('.chatbot-container');
        const chatbotToggle = document.querySelector('.chatbot-toggle');
        const chatbotWindow = document.querySelector('.chatbot-window');
        const chatbotClose = document.querySelector('.chatbot-close');
        const chatbotInput = document.querySelector('#user-message');
        const chatbotSend = document.querySelector('#send-message');
        const chatbotMessages = document.querySelector('.chatbot-messages');

        // Validate and log element status
        function validateElements() {
            const elements = [
                { element: chatbotContainer, name: 'Chatbot Container' },
                { element: chatbotToggle, name: 'Chatbot Toggle' },
                { element: chatbotWindow, name: 'Chatbot Window' },
                { element: chatbotClose, name: 'Chatbot Close' },
                { element: chatbotInput, name: 'Chatbot Input' },
                { element: chatbotSend, name: 'Chatbot Send' },
                { element: chatbotMessages, name: 'Chatbot Messages' }
            ];

            elements.forEach(item => {
                debugLog(`${item.name} status`, item.element);
            });

            return elements.every(item => !!item.element);
        }

        // Enhanced toggle function with extensive logging
        function toggleChatbot(event) {
            debugLog('Toggle chatbot triggered', event.currentTarget);
            
            if (!chatbotWindow) {
                debugLog('❌ Chatbot window element not found');
                return;
            }

            // Log current state before toggle
            debugLog(`Current window display: ${chatbotWindow.style.display}`);
            debugLog(`Current window classes: ${chatbotWindow.classList}`);

            // Toggle active class
            chatbotWindow.classList.toggle('active');

            // Log state after toggle
            debugLog(`New window display: ${chatbotWindow.style.display}`);
            debugLog(`New window classes: ${chatbotWindow.classList}`);
        }

        // Predefined responses with more context
        const responses = {
            'services': `🌟 CSC Kanish Online Services Catalog 🌟

1. 📄 PAN Card Services
   • New PAN Card Application
   • PAN Card Correction
   • PAN Card Reprint

2. 🛂 Passport Services
   • Passport Application
   • Passport Renewal
   • Address Change in Passport

3. 🏦 Banking Services
   • Account Opening
   • Aadhaar Seeding
   • Bank Statement
   • Passbook Printing

4. 🏛️ Government Services
   • Aadhaar Card Services
   • Income Tax Filing
   • Electricity Bill Payment
   • Water Bill Payment

5. 🔐 Digital Signature Certificate
   • Class 2 DSC
   • Class 3 DSC

6. 📋 Other Services
   • Voter ID Card
   • Driving License
   • Birth/Death Certificates

Need more details? Just ask about a specific service!`,
            'contact': '📞 Contact CSC Kanish\n• Email: csckanish@gmail.com\n• Phone: +91 7002044069\n• Address: Fulertal Mukam, Cachar, Assam - 788106',
            'hello': '👋 Hello! Welcome to CSC Kanish Online Services. I\'m your digital assistant. How can I help you today?',
            'help': '🆘 I can assist you with:\n• Information about our services\n• Contact details\n• General queries about CSC Kanish',
            'default': '🤔 I didn\'t quite understand. Could you rephrase that? Try asking about our services, contact information, or specific queries.'
        };

        // Send message function with improved rendering
        function sendMessage() {
            const userInput = document.querySelector('#user-message');
            const chatbotMessages = document.querySelector('.chatbot-messages');

            if (!userInput || !chatbotMessages) {
                console.error('❌ Message input or messages container not found');
                return;
            }

            const messageText = userInput.value.trim();
            if (messageText === '') return;

            // Create user message element
            const userMessageEl = document.createElement('div');
            userMessageEl.classList.add('chatbot-message', 'user');
            userMessageEl.innerHTML = `<p>${messageText}</p>`;
            chatbotMessages.appendChild(userMessageEl);

            // Clear input
            userInput.value = '';

            // Scroll to bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            // Simulate bot response
            setTimeout(() => {
                const botResponse = processUserMessage(messageText);
                const botMessageEl = document.createElement('div');
                botMessageEl.classList.add('chatbot-message', 'bot');
                botMessageEl.innerHTML = `<p>${botResponse}</p>`;
                chatbotMessages.appendChild(botMessageEl);

                // Scroll to bottom after bot response
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 500);
        }

        // Get bot response
        function getBotResponse(userMessage) {
            const lowerMessage = userMessage.toLowerCase();
            
            // Enhanced keyword matching
            const keywords = {
                'services': ['service', 'what do you offer', 'services list', 'what services', 'available services'],
                'contact': ['contact', 'phone', 'email', 'address', 'reach out', 'connect'],
                'hello': ['hi', 'hey', 'hello', 'greetings', 'howdy', 'welcome'],
                'help': ['help', 'assist', 'support', 'guidance', 'what can you do']
            };

            // Check for keyword matches
            for (let [key, keywordList] of Object.entries(keywords)) {
                if (keywordList.some(keyword => lowerMessage.includes(keyword))) {
                    return responses[key];
                }
            }
            
            return responses['default'];
        }

        // Process user message
        function processUserMessage(userMessage) {
            return getBotResponse(userMessage);
        }

        // Setup event listeners with error handling
        function setupEventListeners() {
            if (!validateElements()) {
                debugLog('❌ Cannot set up event listeners - missing elements');
                return;
            }

            // Toggle chatbot on toggle button click
            chatbotToggle.addEventListener('click', toggleChatbot);
            debugLog('✅ Toggle click event listener added');

            // Close chatbot on close button click
            chatbotClose.addEventListener('click', toggleChatbot);
            debugLog('✅ Close click event listener added');

            // Send message on button click
            chatbotSend.addEventListener('click', sendMessage);
            debugLog('✅ Send button event listener added');

            // Send message on Enter key
            chatbotInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            debugLog('✅ Input enter event listener added');
        }

        // Initialize chatbot
        function initChatbot() {
            debugLog('Initializing chatbot');
            setupEventListeners();
        }

        // Run initialization
        initChatbot();
    });
})();
