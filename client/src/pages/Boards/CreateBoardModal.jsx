import { Hash } from "lucide-react";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import Modal from "../../components/ui/Modal";
import { useState } from "react";
import { useWorkspaceStore } from "../../store";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function CreateBoardModal({ onClose  }) {
  const { createBoard, isLoading } = useWorkspaceStore();
  const {projectId} = useParams();
  const [boardName, setBoardName] = useState("");
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setBoardName(e.target.value);    
  };
  console.log("Project ID in CreateBoardModal:", boardName); // Log the projectId to verify it's being passed correctly
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!boardName.trim()) {
      setError("Board name is required");
      return;
    }
    try {
        console.log("Creating board with nameeeeeeeeggggg:", boardName); // Log the board name to verify it's being passed correctly
      await createBoard({ projectId, name: boardName });
      toast.success("Board created successfully!");
      onClose();
    } catch (error) {
      console.log(error);
      setError("Failed to create board");
    }
  };
  return (
    <Modal title="New board" onClose={onClose}>
       <form onSubmit={handleSubmit}>
          <Field
            label="Board name"
            required
            icon={Hash}
            placeholder="e.g. Product Team"
            name="name"
            value={boardName}
            onChange={handleChange}
          />
          {error && (
            <div style={{ color: "red", fontSize: 12 }}>
              {error}
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <Button
              variant="secondary"
              full
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              full
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Board"}
            </Button>
          </div>
      </form>
    </Modal>
  );
}

export default CreateBoardModal;