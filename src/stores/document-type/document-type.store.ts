import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DocumentType } from "@/types/interfaces/document-type/document-type.interface";

interface State {
  documentTypes: DocumentType[];
  setDocumentTypes: (DocumentType: DocumentType[]) => void;
}

export const useDocumentTypeStore = create<State>()(
  persist(
    (set) => ({
      documentTypes: [],

      setDocumentTypes: (documentTypes: DocumentType[]) => {
        set({ documentTypes });
      },
      
    }),
    {
      name: "document-type-store",
    }
  )
);
