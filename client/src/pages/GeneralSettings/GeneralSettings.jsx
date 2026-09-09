import PageHeader from "../../components/PageHeader";
import Field from "../../components/ui/Field";
import FileDrop from "../../components/ui/FileDrop";
import Button from "../../components/ui/Button";
import { User, Mail } from "lucide-react";
import { C } from "../../constants/theme";
import { useAuthStore, getUserData } from "../../store";
import { useEffect } from "react";

function GeneralSettingsPage() {
  const {userData} = useAuthStore();
  useEffect(() => {
    getUserData();
  }, []);
  console.log("userData:", userData);
  return (
    <div style={{ paddingTop:100,display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <PageHeader title="Settings" subtitle="Product Team workspace & your profile" />
        <div style={{ padding: "22px 28px", maxWidth: 520,width: "100%",boxSizing: "border-box" }}>
                <div style={{ fontSize: 11, color: C.textFaint, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 12 }}>Profile</div>
                <form>
                    <Field label="Full name" required icon={User} value={userData?.name} readonly />
                    <Field label="Email" required icon={Mail} value={userData?.email} readonly />
                    <FileDrop label="Avatar" hint="JPG or PNG, up to 5MB" />
                    <Button>Save profile</Button>
                    {/* <div style={{ fontSize: 11, color: C.textFaint, textTransform: "uppercase", letterSpacing: 0.4, margin: "30px 0 12px" }}>Change password</div>
                    <Field label="Current password" required icon={Lock} type="password" placeholder="••••••••" />
                    <Field label="New password" required icon={Lock} type="password" placeholder="At least 8 characters" />
                    <Field label="Confirm new password" required icon={Lock} type="password" placeholder="Repeat new password" />
                    <Button variant="secondary">Update password</Button>                 */}
                </form>
        </div>
    </div>
  );
}

export default GeneralSettingsPage;