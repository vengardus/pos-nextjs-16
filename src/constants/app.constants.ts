import { UserRole } from "@/types/enums/user-role.enum";
import type { NavbarItem } from "@/types/interfaces/ui/navbar-item.interface";
import { ModuleEnum } from "@/types/enums/module.enum";

export class AppConstants {
  static APP_NAME = "POS-EF2R";
  static URL_HOME = "/";
  static PROFILE_NAME_NAV = "profile";
  static LOGIN_NAME_NAV = "login";

  static DEFAULT_VALUES = {
    currencySymbol: "S/.",
    documentTypeName: "DNI",
    companyName: "Genérico",
    categoryName: "Genérica",
    brandName: "Genérica",
    clientName: "Genérico",
    categoryColor: "#fbbf24",
    authType: "credentials",
    igv: 18,
    messageUserPassword: "Contraseña establecida",
    states: {
      active: "A",
      inactive: "I",
    },
    personTypes: [
      {
        label: "Natural",
        value: "N",
      },
      {
        label: "Jurídico",
        value: "J",
      },
    ],
    colors : {
      chart: "#e4c4e5",
    },
  };


  //NavBar.v.1.1
  static NAVBAR_ITEMS: NavbarItem[] = [
    {
      name: "home",
      label: "Home",
      href: "/",
    },
    {
      name: ModuleEnum.pos,
      label: "Vender",
      href: "/pos",
    },
    {
      name: ModuleEnum.config,
      label: "Configurar",
      href: "/config",
    },
    {
      name: ModuleEnum.dashboard,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      name: "super-admin",
      label: 'SuperAdmin',
      role: UserRole.SUPER_ADMIN,
      children: [
        {
          name: "super-admin-users",
          label: 'Usuarios Registrados',
          href: '/super-admin/users',
        }
      ]
    }
  ];

  static NAVBAR_ITEMS_PROFILE: NavbarItem[] = [
    {
      //name: "your-account",
      name: ModuleEnum.profile,
      label: "Tu cuenta",
      href: "/profile",
    },
    {
      name: ModuleEnum.config,
      label: "Configurar",
      href: "/config",
    },
    {
      name: "logout",
      label: "Logout",
      isSystem: true
    },
  ];

  static CONFIG_MODULES: {
    title: string;
    subtitle: string;
    icon: string;
    link: string;
    name: string
  }[] = [
    {
      name: ModuleEnum.productCategories,
      title: "Categoria de productos",
      subtitle: "asigna categorias a tus productos",
      icon: "https://i.ibb.co/VYbMRLZ/categoria.png",
      link: "/config/categories",
    },
    {
      name: ModuleEnum.products,
      title: "Productos",
      subtitle: "registra tus productos",
      icon: "https://i.ibb.co/85zJ6yG/caja-del-paquete.png",
      link: "/config/products",
    },
    {
      name: ModuleEnum.paymentMethods,
      title: "Métodos de pago",
      subtitle: "todas tus opciones de pago", 
      icon: "https://i.ibb.co/PtjvQkB/transferencia-movil.png",
      link: "/config/payment-methods",
    },
    // {
    //   title: "Personal",
    //   subtitle: "ten el control de tu personal",
    //   icon: "https://i.ibb.co/5vgZ0fX/hombre.png",
    //   link: "/config/users",
    // },
    {
      name: ModuleEnum.clients,
      title: "Clientes",
      subtitle: "Clientes",
      icon: "https://i.ibb.co/5vgZ0fX/hombre.png",
      link: "/config/clients-suppliers",
    },
    {
      name: ModuleEnum.company,
      title: "Tu empresa",
      subtitle: "configura tus opciones básicas",
      icon: "https://i.ibb.co/x7mHPgm/administracion-de-empresas.png",
      link: "/config/companies",
    },
    // {
    //   title: "Marca de productos",
    //   subtitle: "gestiona tus marcas",
    //   icon: "https://i.ibb.co/1qsbCRb/piensa-fuera-de-la-caja.png",
    //   link: "/config/brands",
    // },
    {
      name: ModuleEnum.branches,
      title: "Sucursales y Cajas",
      subtitle: "gestiona tus sucursales",
      icon: "https://i.ibb.co/1qsbCRb/piensa-fuera-de-la-caja.png",
      link: "/config/branches",
    },
    {
      name: ModuleEnum.users,
      title: "Usuarios",
      subtitle: "gestiona tus usuarios",
      icon: "https://i.ibb.co/1qsbCRb/piensa-fuera-de-la-caja.png",
      link: "/config/users",
    },
    {
      name: ModuleEnum.roles,
      title: "Roles y Permisos",
      subtitle: "gestiona roloe y permisos de usuario",
      icon: "https://i.ibb.co/1qsbCRb/piensa-fuera-de-la-caja.png",
      link: "/config/roles",
    },
  ];

  static COMPANY_OPTIONS: {
    label: string;
    subOptions: {
      label: string;
      link: string;
    }[];
  }[] = [
    {
      label: "Empresa",
      subOptions: [
        {
          label: "Generales",
          link: "/config/companies/general",
        },
        {
          label: "Moneda",
          link: "/config/companies/currency",
        },
      ],
    },
    {
      label: "Esquemas",
      subOptions: [
        {
          label: "Macroprocesos",
          link: "/config/schemas/macroprocesses",
        },
      ],
    },
  ];
}
