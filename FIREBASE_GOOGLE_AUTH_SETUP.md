# Konfiguration der Google-Authentifizierung in Firebase

## 🔧 Konfigurationsschritte

### 1. Google-Authentifizierung in der Firebase Console aktivieren

1. Gehen Sie zur [Firebase Console](https://console.firebase.google.com/)
2. Wählen Sie Ihr Projekt `makoti-cookies`
3. Klicken Sie im linken Menü auf **"Authentication"**
4. Wechseln Sie zum Tab **"Sign-in method"**
5. Klicken Sie in der Provider-Liste auf **"Google"**
6. **Aktivieren** Sie den Google-Provider
7. Fügen Sie Ihre **Support-E-Mail** hinzu (erforderlich)
8. Klicken Sie auf **"Speichern"**

### 2. Autorisierte Domains konfigurieren

1. Bleiben Sie in **Authentication > Sign-in method**
2. Scrollen Sie nach unten zu **"Autorisierte Domains"**
3. Stellen Sie sicher, dass folgende Domains hinzugefügt sind:
   - `localhost` (für die Entwicklung)
   - `127.0.0.1` (für die Entwicklung)
   - Ihre Produktions-Domain (falls zutreffend)

### 3. Konfiguration überprüfen

✅ **Ihre Google-Authentifizierung ist jetzt konfiguriert!**

## 🧪 Authentifizierung testen

1. Starten Sie die Anwendung: `npm run dev`
2. Gehen Sie zu [http://localhost:3000/login](http://localhost:3000/login)
3. Klicken Sie auf **"Mit Google anmelden"**
4. Wählen Sie Ihr Google-Konto
5. Sie sollten zur Startseite weitergeleitet werden, angemeldet

## 🔍 Überprüfung in Firebase

Nach der Anmeldung überprüfen Sie in **Firebase Console > Authentication > Users**:
- Ihr Benutzer sollte erscheinen
- Google-Informationen (Foto, Name, E-Mail) werden importiert
- Ein Benutzerdokument wird automatisch in **Firestore > users** erstellt

## 🚨 Häufige Probleme

### Fehler: "This domain is not authorized"
- **Lösung**: Fügen Sie Ihre Domain zu den autorisierten Domains hinzu

### Fehler: "Invalid configuration"
- **Lösung**: Überprüfen Sie, dass die Google-Authentifizierung aktiviert ist

### Popup blockiert
- **Lösung**: Erlauben Sie Popups für localhost in Ihrem Browser

---

✅ **Konfiguration abgeschlossen!** Ihre Google-Authentifizierung funktioniert jetzt. 