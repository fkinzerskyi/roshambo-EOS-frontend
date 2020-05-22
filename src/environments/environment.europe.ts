const chain =
  "f778f7d2f124b110e0a71245b310c1d0ac1a0edd21f131c5ecb2e2bc03e8fe2e";
export const environment = {
  production: true,
  gcontract: "roshambogame",
  network: {
    blockchain: "eos",
    host: "api.xec.cryptolions.io",
    port: 443,
    protocol: "https",
    expireInSeconds: 120,
    chainId: chain,
  },
  chain: chain,
  Eos: {
    httpEndpoint: "https://api.xec.cryptolions.io",
    chainId: chain,
    verbose: false,
  },
  botName: "roshambopunk",
  version: "2.0.0",
  style: {
    body: {
      background:
        "url('./assets/images/section-background.svg') 50% 17vh no-repeat,linear-gradient(to left top, #3755BE, #091d32) 0 0 no-repeat",
    },
    ukLabel: {
      background: "#e2991b",
    },
    ukButtonPrimary: {
      color: "#010e1e",
      "box-shadow": "none",
      border: "1px solid #010e1e",
    },
    logoText: "Europechain roshambo",
    title: "Europechain roshambo EOS game | by Cryptolions",
  },
};
