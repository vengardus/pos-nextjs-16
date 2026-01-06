"use client";

import { useEffect, useState } from "react";
import type { Company } from "@/server/modules/company/domain/company.interface";
import type { DocumentType } from "@/server/modules/document-type/domain/document-type.interface";
import type { Branch } from "@/server/modules/branch/domain/branch.types";
import type { User } from "@/server/modules/user/domain/user.interface";
import type { Role } from "@/server/modules/role/domain/role.interface";
import type { UserWithRelations } from "@/server/modules/user/domain/user-with-relations.interface";
import { ListDef } from "./list-def";
import { useCompanyStore } from "@/stores/company/company.store";
import { useDocumentTypeStore } from "@/stores/document-type/document-type.store";
import { useBranchStore } from "@/stores/branch/branch.store";
import { useRoleStore } from "@/stores/role/role.store";

interface CustomCrudProps {
  data: {
    company: Company;
    documentTypes: DocumentType[];
    branches: Branch[];
    users: UserWithRelations[];
    roles: Role[]
  };
}
export const CustomCrud = ({ data }: CustomCrudProps) => {
  const setCompany = useCompanyStore((state) => state.setCompany);
  const setDocumentTypes = useDocumentTypeStore(
    (state) => state.setDocumentTypes
  );
  const setBranches = useBranchStore((state) => state.setBranches);
  const setRoles = useRoleStore((state) => state.setRoles);
  const [dataList, setDataList] = useState<User[]>(data.users);

  useEffect(() => {
    if (data.company) setCompany(data.company);
    if (data.documentTypes) setDocumentTypes(data.documentTypes);
    if (data.branches) setBranches(data.branches);
    if (data.users) setDataList(data.users);
    if (data.roles) setRoles(data.roles);
  }, [
    data.company,
    setCompany,
    data.documentTypes,
    setDocumentTypes,
    data.branches,
    setBranches,
    data.users,
    setDataList,
    data.roles,
    setRoles
  ]);

  return <ListDef data={dataList} setDataList={setDataList} />;
};
