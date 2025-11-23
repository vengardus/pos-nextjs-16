export interface Module {
    id?: string
    name: string
    title: string
    description?: string
    link?: string
    icon?: string
    type: 'navbar_item' | 'navbar_item_profile' | 'module_config' 
  }