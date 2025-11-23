import { AppConstants } from "@/constants/app.constants";
import { UserRole } from "@/types/enums/user-role.enum";
import { Module } from "@/types/interfaces/module/module.interface";

export const mapNavbarItemsToModules = (): Module[] => {
  const modules: Module[] = [];

  AppConstants.NAVBAR_ITEMS.filter(
    (item) => item.role !== UserRole.SUPER_ADMIN && item.href !== "/"
  ).map((item) => {
    modules.push({
      name: item.name,
      title: item.label,
      description: "",
      type: "navbar_item",
      link: item.href,
    });
  });

  AppConstants.NAVBAR_ITEMS_PROFILE.filter((item) => !item.isSystem).map(
    (item) => {
      modules.push({
        name: item.name,
        title: item.label,
        description: "",
        type: "navbar_item_profile",
        link: item.href,
      });
    }
  );

  AppConstants.CONFIG_MODULES.map((item) => {
    modules.push({
      name: item.name,
      title: item.title,
      description: item.subtitle,
      type: "module_config",
      link: item.link,
      icon: item.icon,
    });
  });

  return modules;
};