import { useAdminAuthStore } from "@/store/adminAuth";
import { useEffect, useState } from "react";
import AdminHeader from "./adminHeader";
import { OTPLogin } from "./otpLogin";

export default function AdminLayout() {
  const { isAuthenticated } = useAdminAuthStore();
  const [isAuth, setIsAuth] = useState<boolean | undefined>();
  useEffect(() => {
    setIsAuth(isAuthenticated);
  }, [isAuthenticated])
  return (
    <>
      {isAuth ?
        <>
          <AdminHeader />
        </> : <OTPLogin />}
      {/* <AdminHeader /> */}
    </>
  )
}
