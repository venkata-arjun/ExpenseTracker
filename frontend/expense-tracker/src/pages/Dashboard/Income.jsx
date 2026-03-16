import React, { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import IncomeList from "../../components/Income/IncomeList";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import useUserAuth from "../../hooks/useUserAuth";
import toast from "react-hot-toast";

const Income = () => {
  useUserAuth();

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingIncome, setAddingIncome] = useState(false);

  // Get All Income Details
  const fetchIncomeDetails = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`,
      );

      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle Add Income
  const handleAddIncome = async (income) => {
    if (addingIncome) return;

    const { source, amount, date, icon } = income;
    const parsedAmount = Number(amount);

    // Validation Checks
    if (!source.trim()) {
      toast.error("Source is required.");
      return;
    }

    if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      setAddingIncome(true);

      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount: parsedAmount,
        date,
        icon,
      });

      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      await fetchIncomeDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add income");
      console.error(
        "Error adding income:",
        error.response?.data?.message || error.message,
      );
    } finally {
      setAddingIncome(false);
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
  }, [fetchIncomeDetails]);

  const handleDeleteIncome = async (incomeId) => {
    if (!incomeId) return;

    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(incomeId));
      toast.success("Income deleted successfully");
      await fetchIncomeDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete income");
    }
  };

  const confirmDeleteIncome = async () => {
    const incomeId = openDeleteAlert.data;
    if (!incomeId) return;

    await handleDeleteIncome(incomeId);
    setOpenDeleteAlert({ show: false, data: null });
  };

  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "income_details.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download income details");
    }
  };

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-4 mx-auto px-1 sm:my-5 sm:px-0">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>
          <IncomeList
            transactions={incomeData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadIncomeDetails}
          />
        </div>
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income?"
            onDelete={confirmDeleteIncome}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
