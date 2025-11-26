// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

serve(async (req: Request) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Sadece ana sayfa ve /index.html için çalışsın
  if (pathname !== "/" && pathname !== "/index.html") {
    // Diğer tüm yollar → normal statik dosya sun
    return serveDir(req, { fsRoot: ".", quiet: true });
  }

  const userAgent = (req.headers.get("user-agent") || "").toLowerCase();

  // Googlebot ve diğer Google crawler'larını kesin yakala
  const isGooglebot = /googlebot|mediapartners-google|adsbot-google|google-inspectiontool|googleweblight|apis-google|feedfetcher-google/i.test(userAgent);

  if (isGooglebot) {
    console.log("Googlebot detected → serving index.html");
    // Googlebot'a index.html göster (SEO için)
    return serveDir(req, { fsRoot: ".", quiet: true });
  }

  console.log("Normal user → redirecting to tr.html");
  // Normal kullanıcıları tr.html'e yönlendir
  return Response.redirect(`${url.origin}/tr.html`, 302);
});
