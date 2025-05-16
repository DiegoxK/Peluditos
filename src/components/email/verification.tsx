import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Img,
  Text,
} from "@react-email/components";

export function Verification({ token }: { token: string }) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Ingresa a tu cuenta</Preview>

      <Body style={styles.body}>
        <Container style={styles.containerTop}>
          <div style={styles.innerWrapper}>
            <Img
              src="https://p4231mtgev.ufs.sh/f/IrTl8hz3xIFkPl2zxAIjgkrBUeKIT7FtsL9uHQcmn6DfiM1q"
              alt="Peluditos logo"
              style={styles.logo}
            />

            <Heading as="h1" style={styles.heading}>
              PELUDITOS
            </Heading>
            <Text style={styles.tagline}>
              Dedicados al cuidado de los animales
            </Text>

            <Text style={styles.message}>
              ¡Hola! Este es tu código para ingresar al dashboard:
            </Text>

            <Text style={styles.label}>Código de verificación</Text>

            <Text style={styles.token}>
              <strong>{token}</strong>
            </Text>

            <Text style={styles.instructions}>
              Usa este código para <span style={styles.highlight}>entrar</span>{" "}
              en tu cuenta.
            </Text>

            <Text style={styles.expiry}>Este código vence en 10 minutos.</Text>
          </div>
        </Container>

        <Container style={styles.containerBottom}>
          <div style={styles.innerWrapper}>
            <Text style={styles.supportLabel}>
              <strong>¿Necesitas ayuda?</strong>
            </Text>
            <Text style={styles.supportText}>
              Si no solicitaste este código, puedes ignorar este correo
              electrónico de forma segura. Si tienes más preguntas, contacta a
              nuestro equipo de soporte:
              <Link href="mailto:diego.synthcode@gmail.com" style={styles.link}>
                diego.synthcode@gmail.com
              </Link>
            </Text>
            <Text style={styles.signature}>
              Gracias,
              <br />
              El equipo de Peluditos.
            </Text>
          </div>
        </Container>
      </Body>
    </Html>
  );
}

// Font stack: fallback to common fonts since Poppins doesn't load in most email clients
const baseFont = `'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif`;

const colors = {
  primary: "#78af7c",
  secondary: "#006b4e",
  foreground: "#ffffff",
  accentForeground: "#94c1af",
};

const styles = {
  body: {
    backgroundColor: "#f4f4f4",
    fontFamily: baseFont,
  },
  containerTop: {
    backgroundColor: colors.primary,
    color: colors.foreground,
    borderRadius: "8px 8px 0 0",
    maxWidth: "500px",
    margin: "0 auto",
    padding: "0",
  },
  containerBottom: {
    backgroundColor: colors.secondary,
    color: colors.foreground,
    borderRadius: "0 0 8px 8px",
    maxWidth: "500px",
    margin: "0 auto",
    padding: "0",
  },
  innerWrapper: {
    padding: "0 24px",
    boxSizing: "border-box" as const,
    width: "100%",
  },
  logo: {
    width: "120px",
    margin: "34px auto 20px auto",
    display: "block",
  },
  heading: {
    fontSize: "30px",
    fontWeight: 900,
    textAlign: "center" as const,
  },
  tagline: {
    textAlign: "center" as const,
    fontSize: "14px",
    fontWeight: 400,
    margin: "0 0 20px 0",
  },
  message: {
    textAlign: "center" as const,
    fontSize: "18px",
    margin: "10px 0",
  },
  label: {
    textAlign: "center" as const,
    fontWeight: 900,
    color: colors.secondary,
    margin: "10px 0",
    fontSize: "16px",
  },
  token: {
    textAlign: "center" as const,
    fontSize: "32px",
    textTransform: "uppercase" as const,
    margin: "20px 0",
  },
  instructions: {
    textAlign: "center" as const,
    marginTop: "10px",
    fontSize: "16px",
  },
  highlight: {
    color: colors.secondary,
  },
  expiry: {
    textAlign: "center" as const,
    marginTop: "8px",
    fontSize: "14px",
    fontStyle: "italic",
  },
  securityNote: {
    textAlign: "center" as const,
    marginTop: "10px",
    fontSize: "14px",
    color: "#333",
  },
  supportLabel: {
    fontSize: "16px",
    margin: "20px 0 10px 0",
  },
  supportText: {
    color: colors.accentForeground,
    fontSize: "14px",
    lineHeight: "1.5",
  },
  link: {
    color: colors.primary,
    textDecoration: "underline",
    marginLeft: "4px",
  },
  signature: {
    color: colors.accentForeground,
    fontSize: "14px",
    margin: "20px 0",
  },
};
