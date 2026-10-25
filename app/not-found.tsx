import "./globals.css";

export default function NotFound() {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col items-center justify-center bg-ink-900 text-center text-white">
        <p className="text-6xl font-black text-signal-500">404</p>
        <p className="mt-4 text-ink-300">페이지를 찾을 수 없습니다. / Page not found.</p>
        <a href="/" className="btn-primary mt-8">Home</a>
      </body>
    </html>
  );
}
