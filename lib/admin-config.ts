import "server-only";

// 데모 기본값. 실제 운영 시 반드시 환경변수로 교체하세요.
export const adminConfig = {
  id: process.env.ADMIN_ID || "admin",
  password: process.env.ADMIN_PASSWORD || "demo1234",
  totpSecret: process.env.ADMIN_TOTP_SECRET || "JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP",
  /** 데모 모드: 로그인 화면에 계정·현재 OTP 코드를 표시 */
  demo: process.env.ADMIN_DEMO_MODE !== "false",
};
