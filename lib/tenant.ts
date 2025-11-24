export function getTenantFromRequest(hostname: string) {
  // restaurant1.yourdomain.com
  const subdomain = hostname.split(".")[0];
  return subdomain;
}
