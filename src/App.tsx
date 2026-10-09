import { useEffect, useState } from "react";
import ToastContainer from "./components/ui/Toast";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";

const getCurrentRoute = () => {
  if (typeof window === "undefined") return "home";

  const pathname = window.location.pathname;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "admin";
  if (pathname === "/product" || pathname.startsWith("/product/")) return "product";
  if (pathname === "/products" || pathname.startsWith("/products/")) return "product";

  return "home";
};

const getProductIdFromPath = () => {
  if (typeof window === "undefined") return "";

  const pathname = window.location.pathname;
  const match = pathname.match(/^\/product\/(.+)|^\/products\/(.+)$/);
  const value = match?.[1] ?? match?.[2] ?? "";
  return value;
};

function App() {
  const [route, setRoute] = useState(getCurrentRoute);
  const [productId, setProductId] = useState(getProductIdFromPath);

  useEffect(() => {
    const updateRoute = () => {
      setRoute(getCurrentRoute());
      setProductId(getProductIdFromPath());
    };

    window.addEventListener("popstate", updateRoute);
    window.addEventListener("app-route-change", updateRoute);

    return () => {
      window.removeEventListener("popstate", updateRoute);
      window.removeEventListener("app-route-change", updateRoute);
    };
  }, []);

  return (
    <>
      <ToastContainer />
      {route === "admin" ? <Admin /> : route === "product" ? <ProductDetail productId={productId} /> : <Home />}
    </>
  );
}

export default App;