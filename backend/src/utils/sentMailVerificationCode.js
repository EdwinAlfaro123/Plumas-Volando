const HTMLVerificationEmail = (code) => {
    return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verificación de Cuenta</title>
  </head>
  
  <body style="
    margin:0;
    padding:0;
    background:#E6E0CF;
    font-family:Arial, Helvetica, sans-serif;
  ">
  
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:40px 15px;">
  <tr>
  <td align="center">
  
  <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="
    background:#F8F8F8;
    border-radius:18px;
    box-shadow:0 6px 15px rgba(90,86,80,0.35);
  ">
  
    <tr>
      <td align="center" style="padding:40px 30px 20px;">
        
        <h1 style="
          margin:0;
          color:#3F3B38;
          font-size:34px;
          font-weight:bold;
        ">
          Verificación de Cuenta
        </h1>
  
        <p style="
          margin-top:15px;
          color:#5A5650;
          font-size:15px;
          line-height:1.6;
        ">
          Hemos recibido una solicitud para verificar tu cuenta.
          Utiliza el siguiente código para completar el proceso.
        </p>
  
      </td>
    </tr>
  
    <tr>
      <td align="center" style="padding:10px 20px 30px;">
  
        <div style="
          display:inline-block;
          background:#DCCB85;
          padding:18px 40px;
          border-radius:12px;
          box-shadow:0 4px 8px rgba(90,86,80,0.35);
        ">
  
          <span style="
            font-size:34px;
            font-weight:bold;
            letter-spacing:8px;
            color:#3F3B38;
          ">
            ${code}
          </span>
  
        </div>
  
      </td>
    </tr>
  
    <!-- MENSAJE -->
    <tr>
      <td align="center" style="padding:0 35px 30px;">
  
        <p style="
          color:#5A5650;
          font-size:14px;
          line-height:1.7;
          margin:0;
        ">
          Este código estará disponible durante
          <strong style="color:#3F3B38;">15 minutos</strong>.
        </p>
  
        <p style="
          color:#5A5650;
          font-size:14px;
          line-height:1.7;
          margin-top:15px;
        ">
          Si no solicitaste esta verificación, puedes ignorar este mensaje.
        </p>
  
      </td>
    </tr>
  
    <!-- AVISO -->
    <tr>
      <td style="padding:0 30px 30px;">
  
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="
          background:#EFE9D7;
          border-radius:12px;
        ">
          <tr>
            <td style="padding:18px;">
  
              <p style="
                margin:0;
                color:#3F3B38;
                font-size:13px;
                line-height:1.6;
              ">
                <strong>Importante:</strong>
                Nunca compartas este código con otras personas.
              </p>
  
            </td>
          </tr>
        </table>
  
      </td>
    </tr>
  
    <!-- FOOTER -->
    <tr>
      <td align="center" style="
        background:#E6E0CF;
        padding:25px;
        border-radius:0 0 18px 18px;
      ">
  
        <p style="
          margin:0;
          color:#3F3B38;
          font-size:13px;
          font-weight:bold;
        ">
          Sistema Administrativo
        </p>
  
        <p style="
          margin-top:8px;
          color:#5A5650;
          font-size:12px;
        ">
          Correo generado automáticamente.
        </p>
  
      </td>
    </tr>
  
  </table>
  
  </td>
  </tr>
  </table>
  
  </body>
  </html>
  `;
};
  
  export default HTMLVerificationEmail;