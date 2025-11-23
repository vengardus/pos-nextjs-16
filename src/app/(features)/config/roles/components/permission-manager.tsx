"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";

import type { Permission } from "@/types/interfaces/permission/permission.interface";
import type { Module } from "@/types/interfaces/module/module.interface";
import { usePermissionStore } from "@/stores/permission/permission.store";
import { UserRole } from "@/types/enums/user-role.enum";

interface PermissionManagerProps {
  modules: Module[];
  permissions: Permission[];
  roleCod: string;
}

export function PermissionManager({
  modules,
  permissions,
  roleCod
}: PermissionManagerProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [groupCheckStates, setGroupCheckStates] = useState<Record<string, boolean>>({});
  const [checkedModules, setCheckedModules] = useState<Record<string, boolean>>({});
  const isAdmin = (roleCod === UserRole.ADMIN || roleCod === UserRole.GUEST);
  const updatePermissions = usePermissionStore((state) => state.updatePermissions); // Obtén la función del store

  const groupedModules = useMemo(() => {
    return modules.reduce<Record<string, Module[]>>((acc, module) => {
      if (!acc[ module.type]) acc[ module.type] = [];
      acc[ module.type].push(module);
      return acc;
    }, {});
  }, [modules]);

  const initialStates = useMemo(() => {
    console.log("Initialite.....", permissions)

    const initialCheckedModules: Record<string, boolean> = {};
    const initialGroupCheckStates: Record<string, boolean> = {};

    modules.forEach((module) => {
      initialCheckedModules[ module.name] = permissions?.some(
        (permission) => permission.moduleCod ===  module.name 
      ) || isAdmin;
    });

    Object.entries(groupedModules).forEach(([type, groupModules]) => {
      initialGroupCheckStates[type] = groupModules.every(
        (module) => initialCheckedModules[ module.name]
      );
    });

    return { initialCheckedModules, initialGroupCheckStates };
  }, [modules, permissions, groupedModules, isAdmin]);

  useEffect(() => {
    setCheckedModules(initialStates.initialCheckedModules);
    setGroupCheckStates(initialStates.initialGroupCheckStates);
  }, [initialStates]);

  const handleCheckboxChange = useCallback((moduleId: string, checked: boolean) => {
    setCheckedModules((prev) => ({
      ...prev,
      [moduleId]: checked,
    }));
    updatePermissions(moduleId, checked); // Actualiza el store
  }, [updatePermissions]);

  const toggleGroup = (type: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleGroupCheckboxChange = (type: string, checked: boolean) => {
    setGroupCheckStates((prev) => ({
      ...prev,
      [type]: checked,
    }));
    toggleAllInGroup(type, checked);
  };

  const toggleAllInGroup = (type: string, value: boolean) => {
    const updates: Record<string, boolean> = {};
    groupedModules[type].forEach((module) => {
      updates[ module.name] = value;
      updatePermissions( module.name, value); // Actualiza el store
    });
    setCheckedModules((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  return (
    <Card className="w-full max-w-2xl card">
      <CardContent className="space-y-4 mt-2">
        <section className="gap-y-6 ml-3 grid md:grid-cols-2">
          {Object.entries(groupedModules).map(([type, modules]) => (
            <section key={type} className="space-y-4">
              <section className="flex items-center gap-2 gap-x-2">
                <section
                  className="flex items-center gap-2 cursor-pointer select-none "
                  onClick={() => toggleGroup(type)}
                >
                  {collapsedGroups[type] ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                  <h3 className="font-semibold capitalize text-muted-foreground">{type}</h3>
                </section>
                <section className="flex justify-end">
                  <Checkbox
                    id={`group-checkbox-${type}`}
                    checked={groupCheckStates[type] || false}
                    onCheckedChange={(checked) => handleGroupCheckboxChange(type, checked === true)}
                    disabled={isAdmin}
                  />
                </section>
              </section>
              {!collapsedGroups[type] && (
                <div className="space-y-3">
                  {modules.map((module) => (
                    <div key={ module.name} className="flex items-start space-x-2 ml-5">
                      <Checkbox
                        id={`module-${ module.name}`}
                        checked={checkedModules[ module.name]}
                        onCheckedChange={(checked) => handleCheckboxChange( module.name, checked === true)}
                        disabled={isAdmin}
                      />
                      <label
                        htmlFor={`module-${ module.name}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        <div>{ module.title}</div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </section>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}