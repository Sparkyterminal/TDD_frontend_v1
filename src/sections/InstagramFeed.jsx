import React, { useEffect } from "react";

const InstagramFeed = () => {
  useEffect(() => {
    if (document.querySelector('script[src="https://elfsightcdn.com/platform.js"]'))
      return;
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <div
        className="elfsight-app-11af1f1d-d682-4f37-af19-df08584ea6d2"
        data-elfsight-app-lazy
      />
    </div>
  );
};

export default InstagramFeed;
