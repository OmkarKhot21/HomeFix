import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking by forbidding embedding in iframes
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Prevent MIME type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Referrer policy
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Disable dangerous browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), browsing-topics=()",
  },
  // XSS protection for legacy browsers
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // Enforce HTTPS
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Google sign-in popup helper script
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      // Firebase Auth APIs
      "connect-src 'self' https://*.googleapis.com https://apis.google.com https://nominatim.openstreetmap.org",
      // Firebase auth iframe (your-project.firebaseapp.com)
      "frame-src 'self' https://*.firebaseapp.com https://*.web.app",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    // Professional photos in the service popups (lib/services.ts)
    remotePatterns: [{ protocol: 'https', hostname: 'images.pexels.com', pathname: '/photos/**', search: '' }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
