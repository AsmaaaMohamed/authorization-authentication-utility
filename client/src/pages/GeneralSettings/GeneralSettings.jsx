import PageHeader from "../../components/PageHeader";
import Field from "../../components/ui/Field";
import FileDrop from "../../components/ui/FileDrop";
import Button from "../../components/ui/Button";
import { User, Mail, Lock } from "lucide-react";
import { C } from "../../constants/theme";

function GeneralSettingsPage() {
  return (
    <div>
        <PageHeader title="Settings" subtitle="Product Team workspace & your profile" />
        <div style={{ padding: "22px 28px", maxWidth: 520 }}>
                <div style={{ fontSize: 11, color: C.textFaint, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 12 }}>Profile</div>
                <Field label="Full name" required icon={User} value="Ali Fouda" onChange={() => {}} />
                <Field label="Email" required icon={Mail} value="ali@example.com" onChange={() => {}} />
                <FileDrop label="Avatar" hint="JPG or PNG, up to 5MB" />
                <Button>Save profile</Button>
                <div style={{ fontSize: 11, color: C.textFaint, textTransform: "uppercase", letterSpacing: 0.4, margin: "30px 0 12px" }}>Change password</div>
                <Field label="Current password" required icon={Lock} type="password" placeholder="••••••••" />
                <Field label="New password" required icon={Lock} type="password" placeholder="At least 8 characters" />
                <Field label="Confirm new password" required icon={Lock} type="password" placeholder="Repeat new password" />
                <Button variant="secondary">Update password</Button>                
        </div>
    </div>
  );
}

export default GeneralSettingsPage;