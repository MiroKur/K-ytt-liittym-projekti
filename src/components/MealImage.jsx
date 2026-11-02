import { useState } from "react";
export default function MealImage({ src, name }) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} />
  ) : (
    <div
      className="image-placeholder"
      role="img"
      aria-label={`Kuva puuttuu: ${name}`}
    >
      <span aria-hidden="true">✳</span>
      <span>Kuva ei saatavilla</span>
    </div>
  );
}
