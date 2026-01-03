-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public._prisma_migrations (
  id character varying NOT NULL,
  checksum character varying NOT NULL,
  finished_at timestamp with time zone,
  migration_name character varying NOT NULL,
  logs text,
  rolled_back_at timestamp with time zone,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  applied_steps_count integer NOT NULL DEFAULT 0,
  CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.branch_user (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  branch_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  cash_register_id uuid,
  CONSTRAINT branch_user_pkey PRIMARY KEY (id),
  CONSTRAINT branch_user_cash_register_id_fkey FOREIGN KEY (cash_register_id) REFERENCES public.cash_register(id),
  CONSTRAINT branch_user_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT branch_user_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);
CREATE TABLE public.branches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tax_address text,
  currency_symbol text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  company_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  CONSTRAINT branches_pkey PRIMARY KEY (id),
  CONSTRAINT branches_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id)
);
CREATE TABLE public.brands (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  company_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  CONSTRAINT brands_pkey PRIMARY KEY (id),
  CONSTRAINT brands_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id)
);
CREATE TABLE public.cash_register (
  description text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  branch_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT cash_register_pkey PRIMARY KEY (id),
  CONSTRAINT cash_register_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);
CREATE TABLE public.cash_register_closure (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  start_date timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_date timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cash_balance double precision NOT NULL DEFAULT 0,
  calculate_total double precision NOT NULL DEFAULT 0,
  real_total double precision NOT NULL DEFAULT 0,
  status text NOT NULL,
  difference double precision NOT NULL DEFAULT 0,
  initial_cash double precision NOT NULL DEFAULT 0,
  user_id uuid NOT NULL,
  cash_register_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  CONSTRAINT cash_register_closure_pkey PRIMARY KEY (id),
  CONSTRAINT cash_register_closure_cash_register_id_fkey FOREIGN KEY (cash_register_id) REFERENCES public.cash_register(id),
  CONSTRAINT cash_register_closure_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.cash_register_movements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  date timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  amount double precision NOT NULL,
  description text NOT NULL,
  chamge_due double precision NOT NULL,
  payment_method_id uuid NOT NULL,
  user_id uuid NOT NULL,
  cash_register_closure_id uuid NOT NULL,
  sale_id uuid,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  movementCategory text NOT NULL DEFAULT ''::text,
  movementType text NOT NULL DEFAULT ''::text,
  paymentMethodCod text NOT NULL DEFAULT ''::text,
  CONSTRAINT cash_register_movements_pkey PRIMARY KEY (id),
  CONSTRAINT cash_register_movements_payment_method_id_fkey FOREIGN KEY (payment_method_id) REFERENCES public.payment_methods(id),
  CONSTRAINT cash_register_movements_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sales(id),
  CONSTRAINT cash_register_movements_cash_register_closure_id_fkey FOREIGN KEY (cash_register_closure_id) REFERENCES public.cash_register_closure(id),
  CONSTRAINT cash_register_movements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  image_url text,
  is_default boolean NOT NULL DEFAULT false,
  company_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id)
);
CREATE TABLE public.clients_suppliers (
  name text NOT NULL,
  address text,
  phone text,
  email text,
  natural_identifier text,
  legal_identifier text,
  person_type text NOT NULL,
  company_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  is_default boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'A'::text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT clients_suppliers_pkey PRIMARY KEY (id),
  CONSTRAINT clients_suppliers_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id)
);
CREATE TABLE public.companies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Genérica'::text,
  tax_id text,
  tax_address text,
  currency_symbol text NOT NULL,
  auth_id text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  user_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  image_url text,
  country text NOT NULL DEFAULT 'Perú'::text,
  currency text NOT NULL DEFAULT 'PEN'::text,
  iso text NOT NULL DEFAULT 'PE'::text,
  tax_glose text NOT NULL DEFAULT 'IGV'::text,
  tax_value double precision NOT NULL DEFAULT 18.00,
  CONSTRAINT companies_pkey PRIMARY KEY (id),
  CONSTRAINT companies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.document_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  company_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  CONSTRAINT document_types_pkey PRIMARY KEY (id),
  CONSTRAINT document_types_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id)
);
CREATE TABLE public.kardex (
  motive text NOT NULL,
  quantity double precision NOT NULL,
  type text NOT NULL,
  status text NOT NULL,
  total double precision NOT NULL,
  cost double precision NOT NULL,
  previous_stock double precision NOT NULL,
  current_stock double precision NOT NULL,
  user_id uuid NOT NULL,
  product_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT kardex_pkey PRIMARY KEY (id),
  CONSTRAINT kardex_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT kardex_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.multi_prices (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sale_price double precision NOT NULL,
  quantity double precision NOT NULL,
  product_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  CONSTRAINT multi_prices_pkey PRIMARY KEY (id),
  CONSTRAINT multi_prices_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.payment_methods (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  company_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  cod text NOT NULL,
  color text NOT NULL DEFAULT ''::text,
  CONSTRAINT payment_methods_pkey PRIMARY KEY (id),
  CONSTRAINT payment_methods_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id)
);
CREATE TABLE public.permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  module_cod text NOT NULL,
  role_id uuid NOT NULL,
  is_group boolean NOT NULL DEFAULT false,
  role_cod text NOT NULL,
  CONSTRAINT permissions_pkey PRIMARY KEY (id),
  CONSTRAINT permissions_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id),
  CONSTRAINT permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sale_price double precision NOT NULL DEFAULT 0,
  purchase_price double precision NOT NULL DEFAULT 0,
  barcode text,
  internal_code text,
  unit_sale text NOT NULL,
  is_inventary_control boolean NOT NULL DEFAULT false,
  is_multi_price boolean NOT NULL DEFAULT false,
  company_id uuid NOT NULL,
  category_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  cod text NOT NULL,
  description text NOT NULL,
  company_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  is_default boolean NOT NULL DEFAULT false,
  CONSTRAINT roles_pkey PRIMARY KEY (id),
  CONSTRAINT roles_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id)
);
CREATE TABLE public.sale_details (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  quantity double precision NOT NULL DEFAULT 1,
  sale_price double precision NOT NULL,
  total double precision NOT NULL,
  description text NOT NULL,
  purchase_price double precision NOT NULL,
  status text NOT NULL DEFAULT 'A'::text,
  sale_id uuid NOT NULL,
  product_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  CONSTRAINT sale_details_pkey PRIMARY KEY (id),
  CONSTRAINT sale_details_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT sale_details_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sales(id)
);
CREATE TABLE public.sales (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  total_amount double precision NOT NULL DEFAULT 0,
  payment_type text NOT NULL DEFAULT ''::text,
  status text NOT NULL DEFAULT 'A'::text,
  total_taxes double precision NOT NULL DEFAULT 0,
  balance double precision NOT NULL DEFAULT 0,
  paid_with double precision NOT NULL DEFAULT 0,
  card_reference text NOT NULL DEFAULT ''::text,
  change double precision NOT NULL DEFAULT 0,
  cash double precision NOT NULL DEFAULT 0,
  credit double precision NOT NULL DEFAULT 0,
  card double precision NOT NULL DEFAULT 0,
  product_count integer NOT NULL DEFAULT 0,
  sub_total double precision NOT NULL DEFAULT 0,
  user_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  company_id uuid NOT NULL,
  client_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  CONSTRAINT sales_pkey PRIMARY KEY (id),
  CONSTRAINT sales_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id),
  CONSTRAINT sales_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT sales_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  image_url text,
  auth_id text,
  auth_type text NOT NULL DEFAULT 'credentials'::text,
  document_number text,
  phone text,
  address text,
  status text NOT NULL DEFAULT 'ACTIVE'::text,
  document_type_id uuid,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  role_id text NOT NULL DEFAULT 'CASHIER'::text,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_document_type_id_fkey FOREIGN KEY (document_type_id) REFERENCES public.document_types(id)
);
CREATE TABLE public.warehouses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  stock double precision NOT NULL DEFAULT 0,
  minimum_stock double precision NOT NULL DEFAULT 0,
  branch_id uuid NOT NULL,
  product_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone,
  CONSTRAINT warehouses_pkey PRIMARY KEY (id),
  CONSTRAINT warehouses_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT warehouses_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);