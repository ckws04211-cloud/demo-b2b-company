import { redirect } from "next/navigation";
import QRCode from "qrcode";
import AuthCard from "@/components/admin/AuthCard";
import OtpForm from "@/components/admin/OtpForm";
import { adminConfig } from "@/lib/admin-config";
import { getPending } from "@/lib/auth";
import { otpauthUrl, totpCode } from "@/lib/totp";

export const dynamic = "force-dynamic";

export default async function OtpPage() {
  const pending = await getPending();
  if (!pending) redirect("/admin/login");

  const qr = adminConfig.demo
    ? await QRCode.toDataURL(otpauthUrl(adminConfig.totpSecret, adminConfig.id, "Hanbit Admin"), { margin: 1, width: 180 })
    : null;
  const secondsLeft = 30 - (Math.floor(Date.now() / 1000) % 30);

  return (
    <AuthCard step={2} title="2단계 인증" desc="Google Authenticator 앱에 표시된 6자리 코드를 입력해 주세요.">
      {qr && (
        <div className="mb-6 flex items-center gap-4 rounded-lg bg-ink-50 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="OTP 등록 QR" width={96} height={96} className="rounded bg-white" />
          <p className="text-xs leading-relaxed text-ink-500">
            처음이라면 Google Authenticator 앱으로 QR을 스캔해 등록하세요. 데모 환경에서는 아래 코드를 그대로 입력해도 됩니다.
          </p>
        </div>
      )}
      <OtpForm demoCode={adminConfig.demo ? totpCode(adminConfig.totpSecret) : undefined} secondsLeft={secondsLeft} />
    </AuthCard>
  );
}
