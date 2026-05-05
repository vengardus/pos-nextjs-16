"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { BranchUser } from "@/server/modules/branch-user/domain/branch-user.interface";
import { BranchAdd } from "./branch-add";
import { BranchList } from "./branch-list";
import { BranchForm } from "./branch-form";
import { CashRegisterForm } from "./cash-register-form";
import { CustomSlideOver } from "@/components/common/slide-over/custom-slide-over";
import { getModelMetadata } from "@/server/common/model-metadata";
import { useModalStore } from "@/stores/general/modal.store";
import { useBranchStore } from "@/stores/branch/branch.store";
import { useCashRegisterStore } from "@/stores/cash-register/cash-register.store";
import { useDebounce } from "@/hooks/debounce/use-debounce.hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BranchesUIProps {
  branchUsers: BranchUser[];
  companyId: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
  };
}
export const BranchesUI = ({ branchUsers, companyId, pagination }: BranchesUIProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const openModal = useModalStore((state) => state.openModal);
  const setOpenModal = useModalStore((state) => state.setOpenModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const setSelectedBranch = useBranchStore((state) => state.setSelectedBranch)
  
  const branchMetadata = getModelMetadata("branch");
  const cashRegisterMetadata = getModelMetadata("cashRegister");
  const selectedBranch = useBranchStore((state) => state.selectedBranch);
  const selectedCashRegister = useCashRegisterStore((state) => state.selectedCashRegister);

  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");
  const debouncedSearchValue = useDebounce(searchValue, 700);
  const isFirstMount = useRef(true);
  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    setSearchValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const currentSearch = searchParamsRef.current.get("search") ?? "";
    if (debouncedSearchValue === currentSearch) return;

    const params = new URLSearchParams(searchParamsRef.current.toString());

    if (debouncedSearchValue) {
      params.set("search", debouncedSearchValue);
    } else {
      params.delete("search");
    }

    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [debouncedSearchValue, pathname, router]);

  const handleAddBranch = () => {
    setSelectedBranch(null)
    setOpenModal("branch")
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <section className="flex flex-col gap-6 mt-3">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Buscar sucursal..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full"
          />
        </div>
        <BranchAdd handleClick={handleAddBranch } />
      </div>

      <div className={isPending ? "opacity-50 transition-opacity" : ""}>
        <BranchList branchUsers={branchUsers} />
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1 || isPending}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          <div className="text-sm font-medium">
            Página {pagination.currentPage} de {pagination.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages || isPending}
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
      
      {openModal === 'branch' && (
        <CustomSlideOver 
          title={`${selectedBranch ? "Editar" : "Agregar"} ${branchMetadata.singularName}`} 
          onClose={closeModal}
        >
          <BranchForm
            companyId={companyId}
            handleCloseForm={closeModal}
          />
        </CustomSlideOver>
      )}

      {openModal === 'cashRegister' && (
        <CustomSlideOver 
          title={`${selectedCashRegister ? "Editar" : "Agregar"} ${cashRegisterMetadata.singularName}`} 
          onClose={closeModal}
        >
          <CashRegisterForm
            handleCloseForm={closeModal}
          />
        </CustomSlideOver>
      )}
    </section>
  );
};
