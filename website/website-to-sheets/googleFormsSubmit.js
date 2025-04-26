export async function submitToGoogleForms({ url, data }) {
  const formBody = new URLSearchParams(data).toString();

  const response = await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formBody,
  });

  return response;
}