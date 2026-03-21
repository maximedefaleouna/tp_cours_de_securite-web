// Service d'Email - Envoie de vrais emails avec Nodemailer
// En production, utilisez un fournisseur d'email réel (SendGrid, AWS SES, etc.)
import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.from = "Université de Kara <noreply@univ-kara.tg>";
    
    // Configuration du transporteur SMTP
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true pour SSL/TLS, false pour STARTTLS
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      },
    });
  }

  // Envoie réel d'email via SMTP
  async sendEmail(to, subject, htmlContent, textContent) {
    const emailData = {
      from: this.from,
      to,
      subject,
      text: textContent,
      html: htmlContent,
      sentAt: new Date().toISOString(),
    };

    try {
      // Envoi de l'email via le transporteur SMTP
      const info = await this.transporter.sendMail({
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html,
      });

      console.log("\n" + "=".repeat(60));
      console.log("📧 EMAIL ENVOYÉ AVEC SUCCÈS");
      console.log("=".repeat(60));
      console.log(`De: ${emailData.from}`);
      console.log(`À: ${emailData.to}`);
      console.log(`Sujet: ${emailData.subject}`);
      console.log(`Envoyé à: ${emailData.sentAt}`);
      console.log(`Message ID: ${info.messageId}`);
      console.log("-".repeat(60));
      console.log("Contenu:");
      console.log(textContent || htmlContent);
      console.log("=".repeat(60) + "\n");

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error("❌ ÉCHEC DE L'ENVOI DE L'EMAIL:", error);
      throw new Error(`Erreur lors de l'envoi de l'email: ${error.message}`);
    }
  }

  // Envoyer les identifiants au nouveau personnel (admin/professeur)
  async sendPersonnelCredentials(email, prenom, nom, matricule, password, isAdmin) {
    const role = isAdmin ? "Administrateur" : "Professeur";
    const subject = `Vos identifiants de connexion - ${role} - Université de Kara`;

    // Utiliser l'URL frontend depuis les variables d'environnement
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";

    const textContent = `
Bonjour ${prenom} ${nom},

Votre compte a été créé avec succès sur la plateforme de gestion des notes de l'Université de Kara.

Voici vos identifiants de connexion :

Rôle : ${role}
Matricule : ${matricule}
Mot de passe temporaire : ${password}

Pour vous connecter, rendez-vous sur : ${frontendUrl}/admin/login

Important :
- Ce mot de passe est temporaire, veuillez le changer dès votre première connexion.
- Ne partagez jamais vos identifiants avec personne.

Cordialement,
L'équipe informatique - Université de Kara
    `;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
    .credential-item { margin: 10px 0; }
    .label { font-weight: bold; color: #667eea; }
    .warning { background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #ffc107; }
    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Université de Kara</h1>
      <p>Gestion des Notes - Identifiants de Connexion</p>
    </div>
    <div class="content">
      <p>Bonjour <strong>${prenom} ${nom}</strong>,</p>
      <p>Votre compte a été créé avec succès sur la plateforme de gestion des notes.</p>
      
      <div class="credentials">
        <h3>Vos identifiants :</h3>
        <div class="credential-item"><span class="label">Rôle :</span> ${role}</div>
        <div class="credential-item"><span class="label">Matricule :</span> ${matricule}</div>
        <div class="credential-item"><span class="label">Mot de passe temporaire :</span> ${password}</div>
      </div>
      
      <p><a href="${frontendUrl}/admin/login" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Se connecter</a></p>
      
      <div class="warning">
        <strong>⚠️ Important :</strong>
        <ul>
          <li>Ce mot de passe est temporaire, veuillez le changer dès votre première connexion.</li>
          <li>Ne partagez jamais vos identifiants avec personne.</li>
        </ul>
      </div>
      
      <div class="footer">
        <p>Cordialement,<br>L'équipe informatique - Université de Kara</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendEmail(email, subject, htmlContent, textContent);
  }

  // Envoyer les identifiants au nouvel étudiant
  async sendStudentCredentials(email, prenom, nom, numeroCarte, password) {
    const subject = "Vos identifiants de connexion - Étudiant - Université de Kara";

    // Utiliser l'URL frontend depuis les variables d'environnement
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";

    const textContent = `
Bonjour ${prenom} ${nom},

Votre compte étudiant a été créé avec succès sur la plateforme de gestion des notes de l'Université de Kara.

Voici vos identifiants de connexion :

Numéro de carte étudiant : ${numeroCarte}
Mot de passe temporaire : ${password}

Pour vous connecter, rendez-vous sur : ${frontendUrl}/auth

Important :
- Ce mot de passe est temporaire, veuillez le changer dès votre première connexion.
- Conservez précieusement votre numéro de carte étudiant.

Cordialement,
L'équipe informatique - Université de Kara
    `;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
    .credential-item { margin: 10px 0; }
    .label { font-weight: bold; color: #667eea; }
    .warning { background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #ffc107; }
    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Université de Kara</h1>
      <p>Gestion des Notes - Identifiants Étudiant</p>
    </div>
    <div class="content">
      <p>Bonjour <strong>${prenom} ${nom}</strong>,</p>
      <p>Votre compte étudiant a été créé avec succès sur la plateforme.</p>
      
      <div class="credentials">
        <h3>Vos identifiants :</h3>
        <div class="credential-item"><span class="label">Numéro de carte étudiant :</span> ${numeroCarte}</div>
        <div class="credential-item"><span class="label">Mot de passe temporaire :</span> ${password}</div>
      </div>
      
      <p><a href="${frontendUrl}/auth" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Se connecter</a></p>
      
      <div class="warning">
        <strong>⚠️ Important :</strong>
        <ul>
          <li>Ce mot de passe est temporaire, veuillez le changer dès votre première connexion.</li>
          <li>Conservez précieusement votre numéro de carte étudiant.</li>
        </ul>
      </div>
      
      <div class="footer">
        <p>Cordialement,<br>L'équipe informatique - Université de Kara</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendEmail(email, subject, htmlContent, textContent);
  }

  // Envoyer OTP pour l'inscription de l'étudiant
  async sendOTP(email, prenom, nom, otp) {
    const subject = "Code de vérification - Inscription Université de Kara";

    // Utiliser l'URL frontend depuis les variables d'environnement
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";

    const textContent = `
Bonjour ${prenom} ${nom},

Voici votre code de vérification pour compléter votre inscription :

Code OTP : ${otp}

Ce code est valable pendant 10 minutes.

Connectez-vous ici : ${frontendUrl}/auth

Si vous n'avez pas demandé cette inscription, veuillez ignorer cet email.

Cordialement,
L'équipe informatique - Université de Kara
    `;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; text-align: center; }
    .otp-code { background: white; padding: 30px; border-radius: 8px; margin: 20px 0; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; border: 2px dashed #667eea; }
    .warning { margin-top: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Université de Kara</h1>
      <p>Vérification de votre inscription</p>
    </div>
    <div class="content">
      <p>Bonjour <strong>${prenom} ${nom}</strong>,</p>
      <p>Voici votre code de vérification :</p>
      
      <div class="otp-code">${otp}</div>
      
      <p class="warning">Ce code est valable pendant 10 minutes.<br>
      Si vous n'avez pas demandé cette inscription, veuillez ignorer cet email.</p>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendEmail(email, subject, htmlContent, textContent);
  }

  // Envoyer l'email de réinitialisation de mot de passe
  async sendPasswordReset(email, prenom, nom, resetToken) {
    console.log("📧 Preparing password reset email for:", email);
    const subject = "Réinitialisation de mot de passe - Université de Kara";

    // Utiliser l'URL frontend depuis les variables d'environnement
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const textContent = `
Bonjour ${prenom} ${nom},

Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :

${resetUrl}

Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.

Le lien expirera dans 1 heure.

Cordialement,
L'équipe informatique - Université de Kara
    `;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .reset-link { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
    .warning { background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #ffc107; }
    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Université de Kara</h1>
      <p>Réinitialisation de mot de passe</p>
    </div>
    <div class="content">
      <p>Bonjour <strong>${prenom} ${nom}</strong>,</p>
      <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
      
      <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
      
      <a href="${resetUrl}" class="reset-link">Réinitialiser mon mot de passe</a>
      
      <div class="warning">
        <strong>⚠️ Important :</strong><br>
        - Le lien expirera dans 1 heure.<br>
        - Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.
      </div>
      
      <div class="footer">
        <p>Cordialement,<br>L'équipe informatique - Université de Kara</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    console.log("📤 Sending email with reset URL:", resetUrl);
    const result = await this.sendEmail(email, subject, htmlContent, textContent);
    console.log("✅ Email sent successfully:", result);
    return result;
  }

  // Envoyer l'email de code de mot de passe temporaire
  async sendTemporaryPasswordCode(email, prenom, nom, temporaryPassword) {
    console.log("📧 Preparing temporary password code email for:", email);
    const subject = "Code de réinitialisation de mot de passe - Université de Kara";

    // Utiliser l'URL frontend depuis les variables d'environnement
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";

    const textContent = `
Bonjour ${prenom} ${nom},

Votre mot de passe a été réinitialisé. Voici votre code temporaire à utiliser pour vous connecter :

Code temporaire : ${temporaryPassword}

Connectez-vous dès que possible avec ce code et changez votre mot de passe pour des raisons de sécurité.

Connectez-vous ici : ${frontendUrl}/auth

Si vous n'avez pas demandé cette réinitialisation, veuillez contacter immédiatement l'administrateur.

Cordialement,
L'équipe informatique - Université de Kara
    `;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .code-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b6b; }
    .code { font-family: monospace; font-size: 20px; font-weight: bold; color: #ff6b6b; letter-spacing: 3px; }
    .warning { background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #ffc107; }
    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Université de Kara</h1>
      <p>Code de Réinitialisation</p>
    </div>
    <div class="content">
      <p>Bonjour <strong>${prenom} ${nom}</strong>,</p>
      <p>Votre mot de passe a été réinitialisé. Voici votre code temporaire à utiliser pour vous connecter :</p>
      
      <div class="code-box">
        <p><strong>Code temporaire :</strong></p>
        <p class="code">${temporaryPassword}</p>
      </div>
      
      <p><a href="${frontendUrl}/auth" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Se connecter maintenant</a></p>
      
      <div class="warning">
        <strong>⚠️ Important :</strong><br>
        - Connectez-vous dès que possible avec ce code.<br>
        - Changez votre mot de passe immédiatement après la connexion.<br>
        - Si vous n'avez pas demandé cette réinitialisation, contactez l'administrateur immédiatement.
      </div>
      
      <div class="footer">
        <p>Cordialement,<br>L'équipe informatique - Université de Kara</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    console.log("📤 Sending temporary password code email with code:", temporaryPassword);
    const result = await this.sendEmail(email, subject, htmlContent, textContent);
    console.log("✅ Temporary password code email sent successfully:", result);
    return result;
  }
}

export default new EmailService();
export { EmailService };
