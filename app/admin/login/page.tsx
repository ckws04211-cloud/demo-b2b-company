import AuthCard from "@/components/admin/AuthCard";
import LoginForm from "@/components/admin/LoginForm";
import { adminConfig } from "@/lib/admin-config";

export default function LoginPage() {
  return (
    <AuthCard step={1} title="관리자 로그인" desc="아이디와 비밀번호를 입력해 주세요.">
      <LoginForm demo={adminConfig.demo ? { id: adminConfig.id, password: adminConfig.password } : undefined} />
    </AuthCard>
  );
}
