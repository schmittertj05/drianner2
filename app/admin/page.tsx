"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminConfigPage() {
  const [config, setConfig] = useState({
    telegramBotToken: "",
    telegramChatId: "",
    toAddress: "",
    adminPassword: "",
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const ADMIN_PASSWORD = "ton_mot_de_passe_securise_123";

  // Charger la configuration depuis un fichier JSON
  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedConfig = JSON.parse(event.target?.result as string);
        setConfig(importedConfig);
        setMessage({ text: "Configuration importée avec succès !", type: "success" });
      } catch (err) {
        setMessage({ text: "Erreur lors de l'import du fichier.", type: "error" });
      }
    };
    reader.readAsText(file);
  };

  // Exporter la configuration en fichier JSON
  const handleExportConfig = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(config, null, 2))}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "airdrop_config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    setMessage({ text: "Configuration exportée avec succès !", type: "success" });
  };

  // Charger la configuration actuelle depuis localStorage (compatibilité)
  useEffect(() => {
    const savedConfig = localStorage.getItem("airdropConfig");
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  // Vérification du mot de passe
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setMessage({ text: "Accès autorisé !", type: "success" });
    } else {
      setMessage({ text: "Mot de passe incorrect.", type: "error" });
    }
  };

  // Sauvegarder la configuration
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("airdropConfig", JSON.stringify(config));
    setMessage({ text: "Configuration sauvegardée avec succès !", type: "success" });
  };

  // Déconnexion
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", background: "#1a1a2e", borderRadius: "10px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)", color: "#e0e0e0" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Connexion Admin</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Mot de passe :</label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #444", background: "#0f0f1a", color: "#e0e0e0" }}
              placeholder="Entrez le mot de passe"
            />
          </div>
          <button type="submit" style={{ width: "100%", padding: "10px", background: "#6c5ce7", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Se connecter
          </button>
        </form>
        {message.text && (
          <p style={{ marginTop: "15px", textAlign: "center", color: message.type === "error" ? "#ff4d4d" : "#00d4aa" }}>
            {message.text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", padding: "30px", background: "#1a1a2e", borderRadius: "15px", boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)", color: "#e0e0e0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Configuration de l'Airdrop</h1>
        <button onClick={handleLogout} style={{ padding: "8px 16px", background: "#ff4d4d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Déconnexion
        </button>
      </div>
      <form onSubmit={handleSaveConfig}>
        {/* Champs de configuration (inchangés) */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Token du Bot Telegram :</label>
          <input type="text" value={config.telegramBotToken} onChange={(e) => setConfig({ ...config, telegramBotToken: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #444", background: "#0f0f1a", color: "#e0e0e0" }} placeholder="Ex: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Chat ID Telegram :</label>
          <input type="text" value={config.telegramChatId} onChange={(e) => setConfig({ ...config, telegramChatId: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #444", background: "#0f0f1a", color: "#e0e0e0" }} placeholder="Ex: -1001234567890" />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Adresse ETH du destinataire :</label>
          <input type="text" value={config.toAddress} onChange={(e) => setConfig({ ...config, toAddress: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #444", background: "#0f0f1a", color: "#e0e0e0" }} placeholder="Ex: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e" />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Mot de passe Admin :</label>
          <input type="password" value={config.adminPassword} onChange={(e) => setConfig({ ...config, adminPassword: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #444", background: "#0f0f1a", color: "#e0e0e0" }} placeholder="Changer le mot de passe admin" />
        </div>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button type="button" onClick={handleExportConfig} style={{ flex: 1, padding: "12px", background: "#6c5ce7", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
            Exporter en JSON
          </button>
          <button type="button" onClick={() => fileInputRef.current?.click()} style={{ flex: 1, padding: "12px", background: "#00d4aa", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
            Importer depuis JSON
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImportConfig} style={{ display: "none" }} accept=".json" />
        </div>
        <button type="submit" style={{ width: "100%", padding: "15px", background: "#00d4aa", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "20px" }}>
          Sauvegarder la configuration
        </button>
      </form>
      {message.text && (
        <p style={{ marginTop: "20px", textAlign: "center", color: message.type === "error" ? "#ff4d4d" : "#00d4aa", fontWeight: "bold" }}>
          {message.text}
        </p>
      )}
    </div>
  );
}
