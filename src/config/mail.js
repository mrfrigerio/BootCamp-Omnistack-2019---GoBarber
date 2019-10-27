/**
 *
 * Serviços de e-mail:
 * - => Amazon SES (utilizado na Rocketseat);
 * - Mailgun;
 * - Sparkpost;
 * - Mandril (Só para quem utiliza o Mailchimp).
 * - Mailtrap (Funciona apenas para ambiente de desenvolvimento)
 * Não é interessante utilizar o SMTP do próprio GMail porque ele tem um limite
 * e bloqueia a utilização
 */

export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
}
