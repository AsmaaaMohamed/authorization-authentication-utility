import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";
import Button from "../../components/ui/Button";

function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { acceptInvitation, isLoading } = useWorkspaceStore();
  const [error, setError] = useState("");
  const inviteToken = searchParams.get("token");

  const handleAccept = async () => {
    if (!inviteToken) {
      setError("Invitation token is missing.");
      return;
    }
    try {
      const result = await acceptInvitation(inviteToken);
      toast.success(result.message || "Invitation accepted successfully.");
      navigate(`/workspaces/${result.workspaceId}/board`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Invalid or expired invitation."
      );
    }
  };
  useEffect(() => {
    if (!inviteToken) {
      setError("This invitation link is invalid or missing a token.");
    }
  }, [inviteToken]);
  return (
    <div>
      <h2>Workspace Invitation</h2>
      {error && <p>{error}</p>}
      <Button
        onClick={handleAccept}
        disabled={!inviteToken || isLoading}
      >
        {isLoading ? "Accepting..." : "Accept Invitation"}
      </Button>
    </div>
  );
}

export default AcceptInvitePage;