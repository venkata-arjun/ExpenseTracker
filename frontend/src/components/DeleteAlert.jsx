import React from "react";

const DeleteAlert = ({
  content,
  onDelete,
  onCancel,
  deleteLabel = "Delete",
  isDeleting = false,
}) => {
  return (
    <div>
      <p className="text-sm">{content}</p>

      <div className="flex justify-end gap-3 mt-6">
        {onCancel && (
          <button
            type="button"
            className="add-btn"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : deleteLabel}
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
