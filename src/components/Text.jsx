import { useState } from "react";
import "/src/App.css";
import ChromeFlagsBanner from "./ChromeFlagsBanner.jsx"
import Bot from "/src/assets/bot-regular-24.png"
export default function Text() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);

  async function handleSend() {
    if (!inputText.trim()) return;

    const newMessage = {
      text: inputText,
      detectedLanguage: "Detecting...",
      summarizedText: "",
      translatedText: "",
      showSummarize: inputText.length > 150,
      selectedLanguage: "en",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText("");

    if ("ai" in window && "languageDetector" in window.ai) {
      try {
        const detector = await window.ai.languageDetector.create();
        const result = await detector.detect(inputText);
        newMessage.detectedLanguage = result[0]?.detectedLanguage || "Unknown";
      } catch (error) {
        console.log(error);
        newMessage.detectedLanguage = "Detection Failed";
      }
    } else {
      newMessage.detectedLanguage = "API Not Supported";
    }

    setMessages((prevMessages) => [...prevMessages.slice(0, -1), newMessage]);
  }

  async function handleSummarize(index) {
    setMessages((prevMessages) =>
      prevMessages.map((msg, i) =>
        i === index ? { ...msg, summarizedText: "Summarizing...", showSummarize: false } : msg
      )
    );

    try {
      const summarizer = await window.ai.summarizer.create();
      const summary = await summarizer.summarize(messages[index].text);

      setMessages((prevMessages) =>
        prevMessages.map((msg, i) =>
          i === index ? { ...msg, summarizedText: summary } : msg
        )
      );
    } catch (error) {
      console.log(error);
      setMessages((prevMessages) =>
        prevMessages.map((msg, i) =>
          i === index ? { ...msg, summarizedText: "Summarization Failed" } : msg
        )
      );
    }
  }

  async function handleTranslate(index) {
    setMessages((prevMessages) =>
      prevMessages.map((msg, i) =>
        i === index ? { ...msg, translatedText: "Translating..." } : msg
      )
    );

    try {
      if ("ai" in window && "translator" in window.ai) {
        const sourceLang = messages[index].detectedLanguage || "en";
        const targetLang = messages[index].selectedLanguage;

        const translator = await window.ai.translator.create({
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
        });

        const translatedText = await translator.translate(messages[index].text);

        setMessages((prevMessages) =>
          prevMessages.map((msg, i) =>
            i === index ? { ...msg, translatedText } : msg
          )
        );
      } else {
        throw new Error("Translator API not supported.");
      }
    } catch (error) {
      console.log(error);
      setMessages((prevMessages) =>
        prevMessages.map((msg, i) =>
          i === index ? { ...msg, translatedText: "Translation Failed" } : msg
        )
      );
    }
  }

  async function handleLanguageChange(index, value) {
    setMessages((prevMessages) =>
      prevMessages.map((msg, i) =>
        i === index ? { ...msg, selectedLanguage: value } : msg
      )
    );
  }

  return (
    <div className="chat-container">
      <ChromeFlagsBanner />
      <header className="header">
        <img src={Bot} />
        <h2>LinguaPro</h2>
      </header>
      <div className="chat-window">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <img src={Bot} alt="Welcome" />
            <h3>Welcome to LinguaPro!</h3>
            <p>Start typing to detect language, translate, or get summaries.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="chat-message">
              <p className="user-message">{msg.text}</p>
              <small className="timestamp">{msg.timestamp}</small>
      

              <small className="message-lang">Language: {msg.detectedLanguage}</small>

              <div >
                <select
                  onChange={(e) => handleLanguageChange(index, e.target.value)}
                  value={msg.selectedLanguage}
                  className="lang-option"
                >
                  <option value="en">English</option>
                  <option value="pt">Portuguese</option>
                  <option value="es">Spanish</option>
                  <option value="ru">Russian</option>
                  <option value="tr">Turkish</option>
                  <option value="fr">French</option>
                </select>
                <button onClick={() => handleTranslate(index)} className="translate-btn">Translate</button>

                {msg.showSummarize && (
                <button onClick={() => handleSummarize(index)} className="summarize-btn">Summarize</button>
              )}
              </div>

              {msg.translatedText && <p className="ai-message">Translated: {msg.translatedText}</p>}
              {msg.summarizedText && <p>Summary: {msg.summarizedText}</p>}
            </div>
          ))
        )}
      </div>

      <div className="chat-input">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>➤</button>
      </div>
    </div>
  );
}
