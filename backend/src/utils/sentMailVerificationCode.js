const HTMLVerificationEmail = (code) => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Recuperación de Contraseña</title>

<style>
  body {
    margin: 0;
    padding: 0;
    background: #f5f5f5;
    font-family: Arial, Helvetica, sans-serif;
  }

  .container {
    width: 100%;
    max-width: 600px;
  }

  .title {
    font-size: 32px;
  }

  .code {
    font-size: 34px;
    letter-spacing: 8px;
  }

  @media only screen and (max-width: 600px) {

    .container {
      width: 100% !important;
    }

    .mobile-padding {
      padding-left: 20px !important;
      padding-right: 20px !important;
    }

    .title {
      font-size: 26px !important;
    }

    .code {
      font-size: 28px !important;
      letter-spacing: 4px !important;
    }

    .text {
      font-size: 14px !important;
    }
  }
</style>

</head>

<body>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  role="presentation"
  style="padding:30px 10px;"
>
  <tr>
    <td align="center">

      <table
        class="container"
        width="600"
        cellpadding="0"
        cellspacing="0"
        border="0"
        role="presentation"
        style="
          background:#FFFDF8;
          border:1px solid #E5D7B5;
          border-radius:20px;
          overflow:hidden;
        "
      >

        <!-- HEADER -->
        <tr>
          <td
            align="center"
            style="
              background:#E9D48D;
              padding:35px 20px;
            "
          >
            <h1
              class="title"
              style="
                margin:0;
                color:#8A5A00;
                font-size:32px;
                font-weight:bold;
              "
            >
              Recuperación de Contraseña
            </h1>
          </td>
        </tr>

        <!-- MENSAJE -->
        <tr>
          <td
            class="mobile-padding"
            align="center"
            style="
              padding:35px 35px 20px;
            "
          >
            <p
              class="text"
              style="
                margin:0;
                color:#4A4A4A;
                font-size:15px;
                line-height:1.8;
              "
            >
              Hemos recibido una solicitud para restablecer tu contraseña.
              Utiliza el siguiente código para continuar con el proceso.
            </p>
          </td>
        </tr>

        <!-- CODIGO -->
        <tr>
          <td align="center" style="padding:10px 20px 30px;">

            <table
              align="center"
              cellpadding="0"
              cellspacing="0"
              border="0"
              role="presentation"
              style="margin:0 auto;"
            >
              <tr>
                <td
                  align="center"
                  style="
                    background:#FFF3C4;
                    border:2px solid #D7B14A;
                    border-radius:14px;
                    padding:18px 32px;
                  "
                >

                  <span
                    class="code"
                    style="
                      display:block;
                      font-size:34px;
                      font-weight:bold;
                      color:#8A5A00;
                      letter-spacing:8px;
                      text-align:center;
                    "
                  >
                    ${code}
                  </span>

                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- MENSAJE SECUNDARIO -->
        <tr>
          <td
            class="mobile-padding"
            align="center"
            style="padding:0 35px 30px;"
          >

            <p
              class="text"
              style="
                margin:0;
                color:#666666;
                font-size:14px;
                line-height:1.7;
              "
            >
              Este código estará disponible durante
              <strong style="color:#8A5A00;">
                15 minutos
              </strong>.
            </p>

            <p
              class="text"
              style="
                margin-top:15px;
                color:#666666;
                font-size:14px;
                line-height:1.7;
              "
            >
              Si no solicitaste este cambio de contraseña,
              puedes ignorar este mensaje.
            </p>

          </td>
        </tr>

        <!-- AVISO -->
        <tr>
          <td
            class="mobile-padding"
            style="padding:0 35px 35px;"
          >

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              role="presentation"
              style="
                background:#FFF4F4;
                border-left:4px solid #D64545;
                border-radius:10px;
              "
            >
              <tr>
                <td style="padding:18px;">

                  <p
                    style="
                      margin:0;
                      color:#A12828;
                      font-size:13px;
                      line-height:1.6;
                    "
                  >
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
          <td
            align="center"
            style="
              background:#E9D48D;
              padding:22px;
            "
          >

            <p
              style="
                margin:0;
                color:#8A5A00;
                font-size:13px;
                font-weight:bold;
              "
            >
              Sistema Administrativo - Plumas Volando
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