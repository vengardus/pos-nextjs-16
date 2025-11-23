"use client";

import { useEffect, useState } from "react";

import type { UserDataBaseCustomForm } from "@/app/(features)/config/roles/types/user-data-base-custom-form.interface";
import type { Company } from "@/types/interfaces/company/company.interface";
import type { Role } from "@/types/interfaces/role/role.interface";
import { RoleBusiness } from "@/business/role.business";
import { useCompanyStore } from "@/stores/company/company.store";
import { useModuleStore } from "@/stores/module/module.store";
import { createListColumnsDef, createListColumnsResponsiveDef } from "./create-list-columns-def";
import { CustomForm } from "./custom-form";
import { ListDef } from "./list-def";
import { Module } from "@/types/interfaces/module/module.interface";
import { roleDeleteById } from "@/actions/roles/mutatiuons/role.delete-by-id.action";

interface CustomCrudProps {
  data: {
    company: Company;
    roles: Role[];
    modules: Module[];
  };
}
export const CustomCrud = ({ data }: CustomCrudProps) => {
  const setCompany = useCompanyStore((state) => state.setCompany);
  const setModules = useModuleStore((state) => state.setModules);
  const [dataList, setDataList] = useState<Role[]>(data.roles);

  useEffect(() => {
    const updateStoresFromData = () => {
      if (data.company) setCompany(data.company);
      if (data.roles) setDataList(data.roles);
      if (data.modules) setModules(data.modules);
    };

    updateStoresFromData();
  }, [data.company, data.roles, data.modules, setCompany, setModules, setDataList]);

  return (
    <ListDef<Role, UserDataBaseCustomForm>
      dataList={dataList}
      setDataList={setDataList}
      metadata={RoleBusiness.metadata}
      columnsDef={createListColumnsDef}
      columnsResponsiveDef={createListColumnsResponsiveDef}
      FormComponent={CustomForm}
      deleteAction={roleDeleteById}
    />
  );
};
