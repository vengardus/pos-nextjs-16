"use client";

import { Modal } from "@/components/common/modals/modal";
import { PosTicket } from "./pos-ticket/pos-ticket";

interface PosTicketModalProps {
  handleCloseModal: (value: boolean) => void;
}

export const PosTicketModal = ({ handleCloseModal }: PosTicketModalProps) => {
  return (
    <Modal className="w-[95%] md:w-[60%] h-[88%]">
      <PosTicket handleCloseForm={() => handleCloseModal(false)} />
    </Modal>
  );
};
