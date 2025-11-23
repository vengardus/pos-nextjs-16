import { Modal } from "@/components/common/modals/modal";
import SalePaymentDynamicForm from "./pos-payment/sale-payment-dynamic-form";

interface PosPaymentProps {
  handleCloseModal: (value: boolean) => void;
}

export const PosPayment = ({ handleCloseModal }: PosPaymentProps) => {
  return (
    <Modal
      className="w-[95%] md:w-[60%] h-[88%] "
      handleCloseForm={() => handleCloseModal(false)}
    >
      |{" "}
      <SalePaymentDynamicForm handleCloseForm={() => handleCloseModal(false)} />
    </Modal>
  );
};
