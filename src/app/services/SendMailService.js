const mailer   = require('../../lib/mailer')

async function sendForgotEmail(user, token) {
  await mailer.sendMail({
    from: 'no-reply@foodfy.com.br',
    to: user.email,
    subject: 'Recuperação de senha',
    html: `
      <h2>Ixii, Esqueceu sua senha? 😥😥</h2>
      <p>Não se preocupe ${user.name}, clique no link abaixo para recuperar sua senha.</p>
      <p>
        <a href="http://localhost:3000/session/reset-password?token=${token}" target="_blank">
          Link para recuperar sua senha
        </a>
      </p>
      <p><strong>IMPORTANTE:</strong> Este Link é válido por 1 hora.</p>
      <br/>
      <p>Abraços - Equipe Foodfy 😘</p>
    `,
  })
}

async function sendNewUserEmail(newUser, token) {
  await mailer.sendMail({
    from: 'no-reply@foodfy.com.br',
    to: newUser.email,
    subject: 'Bem vindo ao Foodfy',
    html: `
      <h2>Olá ${newUser.name}. Bem vindo ao Foodfy!</h2>
      <p>É um prazer enorme ter você trabalhando conosco.   🤗🎉🥳</p>
      <br/>
      <p>Segue abaixo seus dados de usuário:</p>
      <p>Login: <strong>${newUser.email}</strong></p>
      <p>Senha: <strong>${newUser.password}</strong></p>
      <br/>
      <p>Pra começar com pé direito vamos melhorar a segurança mudando sua senha. 😀</p>
      <p>
        <a href="http://localhost:3000/session/reset-password?token=${token}" target="_blank">
          Link para mudança de senha
        </a>
      </p>
      <p><strong>IMPORTANTE:</strong> Este Link é válido por 1 dia.</p>
      <br/>
      <p>Abraços - Equipe Foodfy 😘</p>
    `,
  })
}

module.exports = {
  sendForgotEmail,
  sendNewUserEmail,
}