import { useState } from "react";
import "/src/banner.css/";

const ChromeFlagsBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="banner">
      <p>
        ⚠️ <strong>Important:</strong> This application requires Chrome's AI APIs.
        Please enable <strong>Experimental Web Platform features</strong> in Chrome Flags.
        <a href="chrome://flags" target="_blank" rel="noopener noreferrer">
          Open Chrome Flags
        </a>
      </p>
      <button className="close-btn" onClick={() => setVisible(false)}>✖</button>
    </div>
  );
};

export default ChromeFlagsBanner;

