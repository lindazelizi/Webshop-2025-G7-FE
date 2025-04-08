export function getBaseUrl() {
  if (!window.location.href.includes('localhost')) {
    return "https://webshop-2025-be-g7-temp.vercel.app/"
  }
  return "http://localhost:3000/";
}

export async function fetchProducts(endpoint = "api/products") {
  //! DONT USE THIS IN PRODUCTION
  const url = `${getBaseUrl()}${endpoint}`;
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return [];
}

export async function addProducts(endpoint = "api/products", product) {
  const url = `${getBaseUrl()}${endpoint}`;
  let user = JSON.parse(localStorage.getItem("user"))
  console.log(user)
  const response = await fetch(url, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${user}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  const data = await response.json();
  console.log("Added Product:", data);
}

export async function getCategories(endpoint = "api/categories") {
  const url = `${getBaseUrl()}${endpoint}`;
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    return data;
  }
}

export async function checkAdmin(endpoint = "null") {

}