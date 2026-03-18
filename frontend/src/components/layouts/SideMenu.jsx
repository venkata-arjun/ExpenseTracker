import React from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";
import { LuTrash, LuUpload } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import Modal from "../Modal";
import toast from "react-hot-toast";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);
  const previewObjectUrlRef = React.useRef(null);
  const [isSavingPhoto, setIsSavingPhoto] = React.useState(false);
  const [openPhotoEditor, setOpenPhotoEditor] = React.useState(false);
  const [selectedPhotoFile, setSelectedPhotoFile] = React.useState(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = React.useState("");
  const [markPhotoForDelete, setMarkPhotoForDelete] = React.useState(false);

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  const resetPhotoDraft = React.useCallback(() => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }

    setSelectedPhotoFile(null);
    setMarkPhotoForDelete(false);
    setPreviewPhotoUrl(user?.profileImageUrl || "");
  }, [user?.profileImageUrl]);

  const handleOpenPhotoEditor = () => {
    if (isSavingPhoto) return;
    resetPhotoDraft();
    setOpenPhotoEditor(true);
  };

  const handleClosePhotoEditor = () => {
    if (isSavingPhoto) return;
    setOpenPhotoEditor(false);
    resetPhotoDraft();
  };

  const handleChoosePhoto = () => {
    if (isSavingPhoto) return;
    fileInputRef.current?.click();
  };

  const handleProfilePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }

    const localPreviewUrl = URL.createObjectURL(file);
    previewObjectUrlRef.current = localPreviewUrl;

    setSelectedPhotoFile(file);
    setMarkPhotoForDelete(false);
    setPreviewPhotoUrl(localPreviewUrl);
    event.target.value = "";
  };

  const handleMarkDeletePhoto = () => {
    if (!previewPhotoUrl && !user?.profileImageUrl) return;

    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }

    setSelectedPhotoFile(null);
    setPreviewPhotoUrl("");
    setMarkPhotoForDelete(true);
  };

  const handleSavePhotoChanges = async () => {
    if (isSavingPhoto) return;

    try {
      setIsSavingPhoto(true);
      let response = null;

      if (markPhotoForDelete && user?.profileImageUrl) {
        response = await axiosInstance.delete(
          API_PATHS.AUTH.DELETE_PROFILE_IMAGE,
        );
      } else if (selectedPhotoFile) {
        const imgUploadRes = await uploadImage(selectedPhotoFile);
        const profileImageUrl = imgUploadRes?.imageUrl || "";

        if (!profileImageUrl) {
          throw new Error("Image upload failed");
        }

        response = await axiosInstance.put(
          API_PATHS.AUTH.UPDATE_PROFILE_IMAGE,
          {
            profileImageUrl,
          },
        );
      }

      if (response?.data?.user) {
        updateUser(response.data.user);

        if (markPhotoForDelete) {
          toast.success("Profile photo removed successfully");
        } else {
          toast.success("Profile photo updated successfully");
        }
      } else {
        toast("No changes to save");
      }

      setOpenPhotoEditor(false);
      resetPhotoDraft();
    } catch (error) {
      console.error("Failed to save profile photo changes", error);
      toast.error(
        error?.response?.data?.message || "Failed to update profile photo",
      );
    } finally {
      setIsSavingPhoto(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
    };
  }, []);

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-15.25 z-20">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleProfilePhotoChange}
      />

      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        <button
          type="button"
          onClick={handleOpenPhotoEditor}
          className="group relative rounded-full cursor-pointer"
          aria-label="Open profile photo editor"
        >
          {user?.profileImageUrl ? (
            <img
              src={user?.profileImageUrl || ""}
              alt="Profile Image"
              className="w-20 h-20 bg-slate-400 rounded-full object-cover ring-4 ring-slate-100 transition group-hover:brightness-95"
            />
          ) : (
            <CharAvatar
              fullName={user?.fullName}
              width="w-20"
              height="h-20"
              style="text-xl"
            />
          )}

          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100">
            Edit
          </span>
        </button>

        <h5 className="text-gray-950 font-medium leading-6">
          {user?.fullName || ""}
        </h5>
      </div>
      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu == item.label ? "text-white bg-primary" : ""
          } py-3 px-6 rounded-lg mb-3`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}

      <Modal
        isOpen={openPhotoEditor}
        onClose={handleClosePhotoEditor}
        title="Profile Photo"
      >
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            {previewPhotoUrl ? (
              <img
                src={previewPhotoUrl}
                alt="Profile preview"
                className="w-28 h-28 rounded-full object-cover ring-4 ring-slate-100"
              />
            ) : (
              <CharAvatar
                fullName={user?.fullName}
                width="w-28"
                height="h-28"
                style="text-2xl"
              />
            )}
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleChoosePhoto}
              disabled={isSavingPhoto}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LuUpload className="text-base" />
              Edit
            </button>

            <button
              type="button"
              onClick={handleMarkDeletePhoto}
              disabled={
                isSavingPhoto || (!previewPhotoUrl && !user?.profileImageUrl)
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LuTrash className="text-base" />
              Delete
            </button>
          </div>

          <div className="w-full flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={handleSavePhotoChanges}
              disabled={isSavingPhoto}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingPhoto ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SideMenu;
