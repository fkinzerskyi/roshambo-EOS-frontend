const chain =
  "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906";
export const environment = {
  production: true,
  gcontract: "roshambogame",
  appName: "roshambo-EOS-frontend-jungle",
  coinName: "EOS",
  cryptolionsLink: "http://cryptolions.io/",
  network: {
    blockchain: "eos",
    host: "intapi.eos.cryptolions.io",
    port: 443,
    protocol: "https",
    expireInSeconds: 120,
    chainId: chain,
  },
  chain: chain,
  Eos: {
    httpEndpoint: "https://intapi.eos.cryptolions.io",
    chainId: chain,
    verbose: false,
  },
  botName: "roshambopunk",
  version: "2.0.0",
  style: {
    body: {
      background:
        "url('./assets/images/section-background.svg') 50% 17vh no-repeat,linear-gradient(to left top,#09c5f9,#3483d9) no-repeat",
    },
    ukLabel: {
      background: "#3387db",
    },
    ukButtonPrimary: {
      background: "#3387db",
      "box-shadow": "",
      border: "",
    },
    logoText: "roshambo",
    title: "roshambo EOS game | by Cryptolions",
  },
};
