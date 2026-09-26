import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  RotateCcw, 
  PhoneCall, 
  PhoneOff, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Send,
  MessageSquare,
  ShieldAlert,
  Radio,
  ExternalLink,
  Flame,
  Check,
  HelpCircle,
  Clock,
  Layers,
  Activity
} from 'lucide-react';
import { api } from '../services/api';
import { speechService } from '../services/speech';

export default function CitizenPortal({ onBackToDashboard }) {
  const [mode, setMode] = useState('voice'); // 'voice' or 'phone'
  const [sessionId, setSessionId] = useState('SES-' + Date.now());
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Please tell me your problem.',
      lang: null
    }
  ]);
  const [citizenPhone, setCitizenPhone] = useState('+91 98421 55678');
  const [citizenName, setCitizenName] = useState('Citizen');
  const [manualText, setManualText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [registeredComplaint, setRegisteredComplaint] = useState(null);
  const [simulatedSms, setSimulatedSms] = useState(null);

  // Progressive slot memory tracked from AI responses
  const [conversationStage, setConversationStage] = useState('COLLECTING_INFORMATION');
  const [slots, setSlots] = useState({
    category: null,
    area: null,
    street: null,
    landmark: null,
    duration: null,
    severity: null,
    isEmergency: false,
    confirmedByCitizen: false
  });
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [currentConversationLanguage, setCurrentConversationLanguage] = useState(null);
  const [responseLanguage, setResponseLanguage] = useState(null);
  const [activeSpeechLang, setActiveSpeechLang] = useState(null);

  // Phone Call Simulator State
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Phone timer
  useEffect(() => {
    let timer;
    if (callActive) {
      timer = setInterval(() => setCallDuration(d => d + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callActive]);

  // Handle Turn Submission
  const handleUserUtterance = async (utterance) => {
    if (!utterance || !utterance.trim() || isProcessing) return;

    const userText = utterance.trim();
    setIsProcessing(true);

    // Add citizen message to chat
    setMessages(prev => [...prev, { role: 'citizen', text: userText }]);
    setManualText('');

    try {
      const response = await api.voiceInteract(userText, sessionId, citizenPhone, citizenName);

      // Update slot tracking HUD & state machine stage
      if (response.slots) {
        setSlots(response.slots);
      }
      if (response.stage) {
        setConversationStage(response.stage);
      }
      if (response.detectedLanguage) {
        setDetectedLanguage(response.detectedLanguage);
      }
      if (response.currentConversationLanguage) {
        setCurrentConversationLanguage(response.currentConversationLanguage);
        // Automatically sync speech recognition language with active conversation language
        if (response.currentConversationLanguage === 'TAMIL') {
          setActiveSpeechLang('ta-IN');
        } else {
          setActiveSpeechLang('en-IN');
        }
      }
      if (response.responseLanguage) {
        setResponseLanguage(response.responseLanguage);
      }

      // Add assistant response with correction annotations if applicable
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: response.reply,
        lang: response.currentConversationLanguage || response.language,
        stage: response.stage,
        slots: response.slots,
        corrections: response.corrections,
        originalText: response.originalText,
        normalizedText: response.normalizedText
      }]);

      // Speak assistant reply in matching voice
      const isTamilVoice = response.currentConversationLanguage === 'TAMIL' || response.responseLanguage === 'TAMIL';
      const activeVoice = isTamilVoice ? 'ta-IN' : 'en-IN';
      speechService.speak(response.reply, activeVoice);

      // Check if complaint registered
      if (response.shouldRegister && response.complaint) {
        setRegisteredComplaint(response.complaint);
        setSimulatedSms({
          phone: citizenPhone,
          message: `VOXENTRA: Your civic complaint ${response.complaint.id} for "${response.complaint.category}" at ${response.complaint.area_name} is registered. Priority: ${response.complaint.priority.toUpperCase()}. Verification SMS dispatched.`
        });
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Sorry, communication error occurred. Please try speaking again.',
        lang: 'ENGLISH'
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Web Speech Recognition toggle
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (!speechService.isRecognitionSupported()) {
      alert('Speech Recognition is not supported in this browser. Please use the test scenario buttons or type below.');
      return;
    }

    try {
      const recognizer = speechService.createRecognizer({
        onResult: (transcript) => {
          setIsListening(false);
          handleUserUtterance(transcript);
        },
        onEnd: () => {
          setIsListening(false);
        },
        onError: (err) => {
          console.warn('Speech error:', err);
          setIsListening(false);
        },
        language: activeSpeechLang
      });

      if (recognizer) {
        recognitionRef.current = recognizer;
        recognizer.start();
        setIsListening(true);
      }
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Reset Session
  const handleReset = async () => {
    await api.resetVoiceSession(sessionId);
    const newId = 'SES-' + Date.now();
    setSessionId(newId);
    setRegisteredComplaint(null);
    setSimulatedSms(null);
    setConversationStage('COLLECTING_INFORMATION');
    setDetectedLanguage(null);
    setCurrentConversationLanguage(null);
    setResponseLanguage(null);
    setActiveSpeechLang(null);
    setSlots({
      category: null,
      area: null,
      street: null,
      landmark: null,
      duration: null,
      severity: null,
      isEmergency: false,
      confirmedByCitizen: false
    });
    setMessages([
      {
        role: 'assistant',
        text: 'Please tell me your problem.',
        lang: null
      }
    ]);
  };

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-deep)',
      display: 'flex',
      flexDirection: 'column',
      backgroundImage: 'radial-gradient(circle at 50% 15%, rgba(0, 240, 255, 0.05) 0%, transparent 60%)'
    }}>
      {/* Top Banner */}
      <div style={{
        height: '64px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        background: 'var(--bg-canvas)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Radio size={18} color="#06090E" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, letterSpacing: '0.04em', color: '#fff' }}>
              VOXENTRA
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              Conversational Civic AI Assistant
            </div>
          </div>
        </div>

        {/* Switch to Command Center */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <button 
              onClick={() => setMode('voice')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: mode === 'voice' ? '#fff' : 'var(--text-secondary)',
                background: mode === 'voice' ? 'var(--bg-surface)' : 'transparent',
                border: mode === 'voice' ? '1px solid var(--border-cyan)' : 'none'
              }}
            >
              🎙️ Voice Assistant
            </button>
            <button 
              onClick={() => { setMode('phone'); setCallActive(true); }}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: mode === 'phone' ? '#fff' : 'var(--text-secondary)',
                background: mode === 'phone' ? 'var(--bg-surface)' : 'transparent',
                border: mode === 'phone' ? '1px solid var(--border-cyan)' : 'none'
              }}
            >
              📞 Phone Call Mode
            </button>
          </div>

          <button 
            className="btn-secondary"
            onClick={onBackToDashboard}
            style={{ fontSize: '12px', padding: '8px 14px' }}
          >
            <span>Admin Command Center</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div style={{
        flex: 1,
        maxWidth: '960px',
        width: '100%',
        margin: '0 auto',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        
        {/* Header Hero */}
        <div style={{ textAlign: 'center', margin: '4px 0 8px 0' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            Tell us your problem
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto' }}>
            Speak naturally. VOXENTRA will automatically understand your language.
          </p>
        </div>

        {/* Dynamic Slot Memory Tracker HUD */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '12px 16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={14} color="var(--cyan)" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Conversation State Machine Memory
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ fontSize: '10px', background: 'rgba(0, 240, 255, 0.15)', color: 'var(--cyan)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-cyan)' }}>
                LANGUAGE: {currentConversationLanguage || 'AUTO-DETECTING'}
              </span>
              <span className={`status-pill ${
                conversationStage === 'REGISTERED' ? 'emergency' :
                conversationStage === 'FINAL_CONFIRMATION' ? 'high' : 'medium'
              }`} style={{ fontSize: '10px' }}>
                {conversationStage === 'COLLECTING_INFORMATION' ? '1. COLLECTING SLOTS' :
                 conversationStage === 'FINAL_CONFIRMATION' ? '2. AWAITING CONFIRMATION' :
                 '3. REGISTERED & ROUTED'}
              </span>
            </div>
          </div>

          {/* Slot Badges Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
            {/* Category */}
            <div style={{
              background: slots.category ? 'rgba(0, 240, 255, 0.08)' : 'var(--bg-deep)',
              border: slots.category ? '1px solid var(--border-cyan)' : '1px dashed var(--border-subtle)',
              borderRadius: '8px',
              padding: '6px 10px'
            }}>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Category</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: slots.category ? '#fff' : 'var(--text-muted)' }}>
                {slots.category || '— Pending —'}
              </div>
            </div>

            {/* Area & Taluk */}
            <div style={{
              background: slots.area ? 'rgba(0, 240, 255, 0.08)' : 'var(--bg-deep)',
              border: slots.area ? '1px solid var(--border-cyan)' : '1px dashed var(--border-subtle)',
              borderRadius: '8px',
              padding: '6px 10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Area & Taluk</span>
                {slots.locationPrecision && (
                  <span style={{ fontSize: '8px', fontWeight: 700, padding: '1px 4px', borderRadius: '3px', background: slots.locationPrecision === 'EXACT' ? '#00e59922' : '#00f0ff22', color: slots.locationPrecision === 'EXACT' ? 'var(--success)' : 'var(--cyan)' }}>
                    {slots.locationPrecision}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: slots.area ? '#fff' : 'var(--text-muted)' }}>
                {slots.area ? `${slots.area}${slots.taluk ? ` (${slots.taluk})` : ''}` : '— Pending —'}
              </div>
            </div>

            {/* Street */}
            <div style={{
              background: slots.street ? 'rgba(0, 240, 255, 0.08)' : 'var(--bg-deep)',
              border: slots.street ? '1px solid var(--border-cyan)' : '1px dashed var(--border-subtle)',
              borderRadius: '8px',
              padding: '6px 10px'
            }}>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Street / Road</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: slots.street ? '#fff' : 'var(--text-muted)' }}>
                {slots.street || '— Pending —'}
              </div>
            </div>

            {/* Landmark */}
            <div style={{
              background: slots.landmark ? 'rgba(0, 240, 255, 0.08)' : 'var(--bg-deep)',
              border: slots.landmark ? '1px solid var(--border-cyan)' : '1px dashed var(--border-subtle)',
              borderRadius: '8px',
              padding: '6px 10px'
            }}>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Landmark</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: slots.landmark ? '#fff' : 'var(--text-muted)' }}>
                {slots.landmark || '— Pending —'}
              </div>
            </div>

            {/* Duration */}
            <div style={{
              background: slots.duration ? 'rgba(0, 240, 255, 0.08)' : 'var(--bg-deep)',
              border: slots.duration ? '1px solid var(--border-cyan)' : '1px dashed var(--border-subtle)',
              borderRadius: '8px',
              padding: '6px 10px'
            }}>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Duration</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: slots.duration ? '#fff' : 'var(--text-muted)' }}>
                {slots.duration || '— Pending —'}
              </div>
            </div>

            {/* Severity */}
            <div style={{
              background: slots.severity ? 'rgba(0, 240, 255, 0.08)' : 'var(--bg-deep)',
              border: slots.severity ? '1px solid var(--border-cyan)' : '1px dashed var(--border-subtle)',
              borderRadius: '8px',
              padding: '6px 10px'
            }}>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Severity / Status</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: slots.severity ? '#fff' : 'var(--text-muted)' }}>
                {slots.severity || '— Pending —'}
              </div>
            </div>
          </div>
        </div>

        {/* Preset Test Scenarios for the 3 Languages */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '14px 16px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>One-Click Voice Dialogue Demos (Tamil, English, Tanglish)</span>
            <span style={{ color: 'var(--cyan)' }}>Strictly 3 Languages Only</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginBottom: '10px' }}>
            {/* 1. English Demo */}
            <button
              onClick={() => handleUserUtterance("There is a damaged road in Saravanampatti.")}
              style={{
                background: 'rgba(0, 229, 153, 0.08)',
                border: '1px solid rgba(0, 229, 153, 0.4)',
                borderRadius: '8px',
                padding: '8px 10px',
                textAlign: 'left',
                color: '#fff',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--success)', marginBottom: '2px' }}>
                🌐 Test 1: English
              </div>
              <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                "There is a damaged road in Saravanampatti."
              </div>
            </button>

            {/* 2. Tamil Demo */}
            <button
              onClick={() => handleUserUtterance("சரவணம்பட்டியில் ரோடு ரொம்ப மோசமா இருக்கு.")}
              style={{
                background: 'rgba(234, 179, 8, 0.08)',
                border: '1px solid rgba(234, 179, 8, 0.4)',
                borderRadius: '8px',
                padding: '8px 10px',
                textAlign: 'left',
                color: '#fff',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 700, color: '#FACC15', marginBottom: '2px' }}>
                🇮🇳 Test 2: Tamil (தமிழ்)
              </div>
              <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                "சரவணம்பட்டியில் ரோடு ரொம்ப மோசமா இருக்கு."
              </div>
            </button>

            {/* 3. Tanglish Demo */}
            <button
              onClick={() => handleUserUtterance("Saravanampatti-la road romba damage aayirukku.")}
              style={{
                background: 'rgba(0, 240, 255, 0.08)',
                border: '1px solid var(--border-cyan)',
                borderRadius: '8px',
                padding: '8px 10px',
                textAlign: 'left',
                color: '#fff',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--cyan)', marginBottom: '2px' }}>
                🗣️ Test 3: Tanglish
              </div>
              <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                "Saravanampatti-la road romba damage aayirukku."
              </div>
            </button>

            {/* 4. Language Switch to Tamil */}
            <button
              onClick={() => handleUserUtterance("அது ரொம்ப மோசமா இருக்கு.")}
              style={{
                background: 'rgba(168, 85, 247, 0.08)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                borderRadius: '8px',
                padding: '8px 10px',
                textAlign: 'left',
                color: '#fff',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 700, color: '#C084FC', marginBottom: '2px' }}>
                🔄 Test 4: Switch to Tamil
              </div>
              <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                "அது ரொம்ப மோசமா இருக்கு."
              </div>
            </button>
          </div>

          {/* Quick Follow-up Test Buttons across Languages */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Quick Replies:</span>
            
            {/* English follow-ups */}
            <button
              onClick={() => handleUserUtterance("Sathy Road near Reliance Mall.")}
              style={{ background: 'var(--bg-deep)', border: '1px solid rgba(0, 229, 153, 0.3)', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', color: 'var(--success)', cursor: 'pointer' }}
            >
              English: "Sathy Road near Reliance Mall."
            </button>
            <button
              onClick={() => handleUserUtterance("For 3 days, vehicles moving slowly.")}
              style={{ background: 'var(--bg-deep)', border: '1px solid rgba(0, 229, 153, 0.3)', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', color: 'var(--success)', cursor: 'pointer' }}
            >
              English: "For 3 days, vehicles moving slowly."
            </button>
            <button
              onClick={() => handleUserUtterance("Yes, please register.")}
              style={{ background: 'rgba(0, 229, 153, 0.15)', border: '1px solid var(--success)', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', color: 'var(--success)', fontWeight: 700, cursor: 'pointer' }}
            >
              ✅ English: "Yes"
            </button>

            {/* Tamil follow-ups */}
            <button
              onClick={() => handleUserUtterance("சத்தி ரோடு, ரிலையன்ஸ் மால் அருகில்.")}
              style={{ background: 'var(--bg-deep)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', color: '#FACC15', cursor: 'pointer' }}
            >
              தமிழ்: "சத்தி ரோடு, ரிலையன்ஸ் மால் அருகில்."
            </button>
            <button
              onClick={() => handleUserUtterance("3 நாட்கள், மெதுவாக செல்ல முடிகிறது.")}
              style={{ background: 'var(--bg-deep)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', color: '#FACC15', cursor: 'pointer' }}
            >
              தமிழ்: "3 நாட்கள், மெதுவாக..."
            </button>
            <button
              onClick={() => handleUserUtterance("ஆம், பதிவு செய்யவும்.")}
              style={{ background: 'rgba(234, 179, 8, 0.15)', border: '1px solid #FACC15', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', color: '#FACC15', fontWeight: 700, cursor: 'pointer' }}
            >
              தமிழ்: "ஆம், பதிவு செய்யவும்"
            </button>

            {/* Tanglish follow-ups */}
            <button
              onClick={() => handleUserUtterance("Sathy Road-la Reliance Mall pakkam.")}
              style={{ background: 'var(--bg-deep)', border: '1px solid var(--border-cyan)', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', color: 'var(--cyan)', cursor: 'pointer' }}
            >
              Tanglish: "Sathy Road-la Reliance Mall pakkam."
            </button>
            <button
              onClick={() => handleUserUtterance("3 days-ah, vehicles slow-ah poga mudiyuthu.")}
              style={{ background: 'var(--bg-deep)', border: '1px solid var(--border-cyan)', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', color: 'var(--cyan)', cursor: 'pointer' }}
            >
              Tanglish: "3 days-ah, vehicles slow-ah..."
            </button>
            <button
              onClick={() => handleUserUtterance("Aama, confirm pannunga.")}
              style={{ background: 'rgba(0, 240, 255, 0.15)', border: '1px solid var(--border-cyan)', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', color: 'var(--cyan)', fontWeight: 700, cursor: 'pointer' }}
            >
              Tanglish: "Aama, confirm"
            </button>
          </div>
        </div>

        {/* Simulated Incoming SMS Notification Banner */}
        {simulatedSms && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15) 0%, rgba(138, 43, 226, 0.2) 100%)',
            border: '1px solid var(--border-cyan)',
            borderRadius: '12px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            animation: 'modal-in 0.3s ease-out'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'var(--cyan)',
              color: '#06090E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <MessageSquare size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--cyan)', fontWeight: 700 }}>
                  INCOMING SMS TO CITIZEN PHONE ({simulatedSms.phone})
                </span>
                <span style={{ fontSize: '10px', color: 'var(--success)', fontWeight: 600 }}>DISPATCHED</span>
              </div>
              <div style={{ fontSize: '13px', color: '#fff', marginTop: '2px' }}>
                {simulatedSms.message}
              </div>
            </div>
          </div>
        )}

        {/* Main Conversation Container (ChatGPT Style) */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '440px',
          overflow: 'hidden'
        }}>
          {/* Chat / Phone Header */}
          <div style={{
            padding: '14px 20px',
            background: 'var(--bg-deep)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={`pulse-indicator ${isListening ? '' : 'cyan'}`}></span>
              <span style={{ fontWeight: 600, fontSize: '13px', color: '#fff' }}>
                {mode === 'phone' ? `TELEPHONE HELPLINE (1800-422-VOX) • ${formatSeconds(callDuration)}` : 'VOICE COMPLAINT INTERACTION'}
              </span>
            </div>

            <button 
              onClick={handleReset}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                color: 'var(--text-muted)'
              }}
              title="Reset conversation"
            >
              <RotateCcw size={13} />
              <span>Reset Conversation</span>
            </button>
          </div>

          {/* Conversation Bubbles */}
          <div style={{
            padding: '24px',
            overflowY: 'auto',
            maxHeight: '420px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            flex: 1
          }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.role === 'citizen' ? 'flex-end' : 'flex-start',
                  gap: '4px'
                }}
              >
                <div style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>{m.role === 'citizen' ? 'Citizen' : 'VOXENTRA AI Assistant'}</span>
                  {m.lang && <span className="mono" style={{ color: 'var(--cyan)' }}>[{m.lang}]</span>}
                  {m.stage === 'FINAL_CONFIRMATION' && (
                    <span style={{ color: 'var(--warning)', fontWeight: 600 }}>• Final Confirmation</span>
                  )}
                </div>

                <div style={{
                  maxWidth: '82%',
                  padding: '12px 18px',
                  borderRadius: m.role === 'citizen' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background: m.role === 'citizen' 
                    ? 'linear-gradient(135deg, #1E293B 0%, #334155 100%)' 
                    : 'linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(138, 43, 226, 0.12) 100%)',
                  border: m.role === 'citizen' ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--border-cyan)',
                  color: '#fff',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                  whiteSpace: 'pre-line'
                }}>
                  {m.text}

                  {/* Smart phonetic error correction indicator */}
                  {m.corrections && m.corrections.length > 0 && (
                    <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed rgba(255,255,255,0.15)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>Smart Error Correction: </span>
                      <span style={{ textDecoration: 'line-through', color: 'var(--emergency)' }}>"{m.originalText}"</span>
                      <span> → </span>
                      <span style={{ color: 'var(--success)' }}>"{m.normalizedText}"</span>
                    </div>
                  )}

                  {/* Confirmation Quick Action Buttons inside Assistant Message */}
                  {m.stage === 'FINAL_CONFIRMATION' && !registeredComplaint && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button
                        className="btn-primary"
                        onClick={() => handleUserUtterance("Yes, please register.")}
                        style={{ padding: '6px 14px', fontSize: '12px', background: 'var(--success)', borderColor: 'var(--success)', color: '#06090E' }}
                      >
                        <Check size={14} />
                        <span>Yes, Register Complaint</span>
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => handleUserUtterance("No, details need correction.")}
                        style={{ padding: '6px 14px', fontSize: '12px' }}
                      >
                        <span>Change Details</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan)', fontSize: '12px' }}>
                <span className="pulse-indicator cyan"></span>
                <span>VOXENTRA AI is listening, normalizing speech, and assessing next question...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Live Mic Wave & Controls */}
          <div style={{
            padding: '20px',
            background: 'var(--bg-deep)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px'
          }}>
            {/* Main Microphone Button */}
            <div className="mic-ring-container">
              <button
                className={`mic-btn-main ${isListening ? 'recording' : ''}`}
                onClick={toggleListening}
                title={isListening ? "Listening... Click to stop" : "Start Voice Complaint"}
              >
                {isListening ? <MicOff size={36} /> : <Mic size={36} />}
              </button>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: isListening ? 'var(--emergency)' : '#fff' }}>
                {isListening ? 'Listening... Speak your complaint now' : 'Start Voice Complaint'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                "Speak naturally. VOXENTRA will automatically understand your language."
              </div>
              <div className={`sound-waves ${isListening ? 'active' : ''}`}>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
              </div>
            </div>

            {/* Manual Text fallback input */}
            <div style={{ display: 'flex', width: '100%', maxWidth: '680px', gap: '8px' }}>
              <input 
                type="text"
                placeholder="Type your message (e.g. Saravanampatti-la Prozone Mall pakkathula road damage)..."
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUserUtterance(manualText)}
                style={{ flex: 1 }}
              />
              <button 
                className="btn-primary" 
                onClick={() => handleUserUtterance(manualText)}
                disabled={!manualText.trim() || isProcessing}
              >
                <Send size={15} />
                <span>Send</span>
              </button>
            </div>

            {/* Landmark Intelligence Quick Scenarios */}
            <div style={{ width: '100%', maxWidth: '680px', marginTop: '6px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span>🚩 Test Coimbatore Landmark Intelligence:</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {[
                  "Saravanampatti-la Prozone Mall pakkathula road damage.",
                  "Coimbatore railway station near garbage problem.",
                  "Marudhamalai temple pogura road-la problem.",
                  "RS Puram DB Road-la pothole irukku.",
                  "Gandhipuram bus stand pakkathula water leakage.",
                  "Railway station pakkathula problem.",
                  "ப்ரோசோன் மால் அருகில் சாலை சேதமடைந்துள்ளது."
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setManualText(prompt);
                      handleUserUtterance(prompt);
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--cyan)';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.background = 'rgba(0, 240, 255, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    }}
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Successfully Registered Complaint Card */}
        {registeredComplaint && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--success)',
            borderRadius: '14px',
            padding: '24px',
            boxShadow: 'var(--success-glow)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={24} color="var(--success)" />
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff' }}>
                    Complaint Verified & Successfully Registered!
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Lodge confirmed by citizen. Dispatched to Coimbatore Municipal Department.
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="mono" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--cyan)' }}>
                  {registeredComplaint.id}
                </div>
                <span className={`status-pill ${registeredComplaint.priority}`}>
                  {registeredComplaint.priority.toUpperCase()} PRIORITY
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'var(--bg-deep)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Category</div>
                <div style={{ fontWeight: 600, color: '#fff' }}>{registeredComplaint.category}</div>
              </div>
              <div style={{ background: 'var(--bg-deep)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Location / Area</div>
                <div style={{ fontWeight: 600, color: '#fff' }}>{registeredComplaint.area_name}</div>
              </div>
              <div style={{ background: 'var(--bg-deep)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Routed Department</div>
                <div style={{ fontWeight: 600, color: 'var(--cyan)' }}>{registeredComplaint.department_name}</div>
              </div>
              <div style={{ background: 'var(--bg-deep)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Initial Status</div>
                <div style={{ fontWeight: 600, color: 'var(--warning)' }}>Received (Queued for Field Crew)</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="btn-primary"
                onClick={onBackToDashboard}
              >
                <span>View on Command Center Map & Dashboard</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
