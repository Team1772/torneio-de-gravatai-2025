import { setCookie, getCookie } from "./cookies.js"

export async function sha256(text) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
}

export async function autenticar(correctHash, callback) {
  let logged = getCookie("autenticado")

  if (logged === correctHash) {
    callback()
    return
  }

  const passkey = prompt("Digite a senha de acesso:")
  const hashedPasskey = await sha256(passkey)

  if (hashedPasskey === correctHash) {
    setCookie("autenticado", correctHash, 1)
    callback()
  } else {
    document.body.innerHTML = "<h1>Acesso negado</h1>"
  }
}
