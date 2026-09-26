/**
 * VOXENTRA Browser Speech & Voice Synthesis Service
 */

const SpeechRecognition = typeof window !== 'undefined' 
  ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
  : null;

export const speechService = {
  isRecognitionSupported() {
    return !!SpeechRecognition;
  },

  createRecognizer({ onResult, onInterim, onEnd, onError, language = null }) {
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API is not supported in this browser.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    
    // Multilingual recognition:
    // If a language tag is provided based on the conversation context, use it.
    // Otherwise, adapt to user's system/browser locale without hardcoding a single language.
    if (language) {
      recognition.lang = language;
    } else if (typeof navigator !== 'undefined' && navigator.language) {
      recognition.lang = navigator.language;
    }

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (interimTranscript && onInterim) {
        onInterim(interimTranscript);
      }
      if (finalTranscript && onResult) {
        onResult(finalTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error event:', event.error);
      if (onError) onError(event.error);
    };

    recognition.onend = () => {
      if (onEnd) onEnd();
    };

    return recognition;
  },

  speak(text, language = null) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Cancel existing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick appropriate voice matching target language
    const voices = window.speechSynthesis.getVoices();
    const cleanLang = (language || (typeof navigator !== 'undefined' && navigator.language) || 'en-IN').toLowerCase();
    const prefix = cleanLang.split('-')[0];

    let selectedVoice = voices.find(v => v.lang.toLowerCase() === cleanLang);
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
    }
    if (!selectedVoice && prefix === 'en') {
      selectedVoice = voices.find(v => v.lang.includes('IN')) || voices.find(v => v.lang.startsWith('en'));
    }
    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    window.speechSynthesis.speak(utterance);
  }
};
