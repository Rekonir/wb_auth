import { useState } from "react";
import { observer } from "mobx-react-lite";

const WBKyesForm = () => {
  const [statysticKey, setStatysticKey] = useState("");
  const [advertKey, setAdvertKey] = useState("");
  const [analyticKey, setAnalyticKey] = useState("");
  let keys = {
    statystic: "",
    advert: "",
    analytic: "",
  };
  const saveWBKeys = () => {
    keys.statystic = statysticKey;
    keys.advert = advertKey;
    keys.analytic = analyticKey;

    setStatysticKey('')
    setAdvertKey('')
    setAnalyticKey('')
    console.log(keys)
  };
  return (
    <div>
        <br></br>
      <div>
        <input
          onChange={(e) => setStatysticKey(e.target.value)}
          value={statysticKey}
          type="text"
          placeholder="Statystic Key"
        />
      </div>
      <div>
        <input
          onChange={(e) => setAdvertKey(e.target.value)}
          value={advertKey}
          type="text"
          placeholder="Advert Key"
        />
      </div>
      <div>
        <input
          onChange={(e) => setAnalyticKey(e.target.value)}
          value={analyticKey}
          type="text"
          placeholder="Analytic Key"
        />
      </div>
      <button onClick={() => saveWBKeys()}>Вести ключи WB</button>
    </div>
  );
};

export default observer(WBKyesForm);
