import { useState } from "react";
import "/src/banner.css";

const ChromeFlagsBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="banner">
      <p>
        ⚠️ <strong>Important:</strong> This app requires Chrome's AI APIs.
        To enable them, open a new tab and go to <code>chrome://flags</code>, 
        then search for <strong>Experimental Web Platform features</strong> and enable it.
      </p>
      <button className="close-btn" onClick={() => setVisible(false)}>✖</button>
    </div>
  );
};

export default ChromeFlagsBanner;
