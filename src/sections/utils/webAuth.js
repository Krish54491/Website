import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";

/**
 * Login user with WebAuthn
 * Gets credential ID and returns it
 */
export async function webAuthnLogin() {
  try {
    let credentialId;

    try {
      const optionsRes = await fetch("/api/webauthn-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "auth-options" }),
      });
      const { options } = await optionsRes.json();

      const assertion = await startAuthentication({ optionsJSON: options });
      credentialId = assertion.id;
    } catch (authError) {
      console.log("Registering new user with WebAuthn", authError);

      const optionsRes = await fetch("/api/webauthn-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register-options" }),
      });
      const { options } = await optionsRes.json();

      const attestation = await startRegistration({ optionsJSON: options });
      credentialId = attestation.id;
    }

    return credentialId;
  } catch (error) {
    console.error("WebAuthn login error:", error);
    throw error;
  }
}
// OLD FINGERPRINTING CODE
/*
import FingerprintJS from "@fingerprintjs/fingerprintjs";

let fpInstance;

export async function loadFingerprinting() {
  fpInstance = await FingerprintJS.load();
  return fpInstance;
}

export async function getVisitorFingerprint() {
  if (!fpInstance) {
    await loadFingerprinting();
  }

  const fp = await fpInstance.get();
  return fp.visitorId;
}

*/
