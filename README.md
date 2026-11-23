# Atelier Capelli & Stile — Sito Vetrina, Booking Online & Gestionale Salone

Webapp completa sviluppata in **React + Vite + Tailwind CSS** che integra:
1. **Sito Vetrina & Motore di Prenotazione Clienti** (wizard in 4 step con calcolo dinamico slot liberi).
2. **Dashboard Gestionale Titolare** (PIN demo: `1234`) con gestione agenda, orari/slot, servizi, personale e invio conferme/promemoria tramite **Meta WhatsApp Cloud API (v21.0)**.

## Avvio Rapido in Locale

1. Estrai l'archivio ZIP ed entra nella cartella:
   ```bash
   cd atelier-capelli-stile-webapp
   ```
2. Installa le dipendenze:
   ```bash
   npm install
   ```
3. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```
4. Apri il browser all'indirizzo indicato da Vite (solitamente `http://localhost:5173`).

## Configurazione Meta WhatsApp API
- Accedi all'**Area Titolare** (PIN `1234`) -> scheda **Meta WhatsApp API**.
- Puoi testare subito gli invii in **Sandbox Simulazione (Demo)** oppure passare a **Produzione Live Meta API** inserendo il tuo `Phone Number ID` e il `Permanent Access Token` generati dal Meta Developer Portal.
- Per la messa online, nella cartella `/api/send-whatsapp.js` trovi anche il proxy serverless pronto da usare con le variabili d'ambiente in `.env.example`.
