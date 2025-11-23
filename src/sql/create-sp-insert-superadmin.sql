CREATE OR REPLACE FUNCTION insert_superadmin(
  p_auth_id text,
  p_role_id text,
  p_email text, 
  p_currency_symbol text,
  p_company_name text,
  p_document_type_name text,
  p_category_name text,
  p_category_color text,
  p_password text,
  p_auth_type text,
  p_image_url text,
  p_user_name text,
  p_brand_name text,
  p_client_name text,
  p_person_type text
)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    new_company_id uuid;
    new_document_type_id uuid;
    new_branch_id uuid;
    new_user_id uuid;
    new_cash_register_id uuid;
    new_role_id uuid;
BEGIN
    BEGIN
    
        -- Insert user
        INSERT INTO users(role_id, email, auth_id, password, auth_type, image_url, name)
        VALUES(p_role_id, p_email, p_auth_id, p_password, p_auth_type, p_image_url, p_user_name)	
        RETURNING id INTO new_user_id;

        -- Insert company
        INSERT INTO companies(name, currency_symbol, auth_id, is_default, user_id)
        VALUES(p_company_name, p_currency_symbol, p_auth_id, true, new_user_id)
        RETURNING id INTO new_company_id;

        -- Insert doc_type
        INSERT INTO document_types(name, company_id, is_default)
        VALUES(p_document_type_name, new_company_id, true)
        RETURNING id INTO new_document_type_id;
        
        -- Insert branch
        INSERT INTO branches(name, company_id, is_default, currency_symbol)
        VALUES(p_company_name, new_company_id, true, p_currency_symbol)
        RETURNING id INTO new_branch_id;

        
        -- insert category
        INSERT INTO categories(name, color, company_id, is_default)
        VALUES(p_category_name, p_category_color, new_company_id, true);

        -- insert brand
        INSERT INTO brands(name, company_id, is_default)
        VALUES(p_brand_name, new_company_id, true);
        
        -- insert clients
        INSERT INTO clients_suppliers(name, company_id, is_default, person_type)
        VALUES(p_client_name, new_company_id, true, p_person_type);

        -- insert cash_register
        INSERT INTO cash_register(branch_id, description, is_default)
        VALUES(new_branch_id, 'Caja principal', true)
        RETURNING id INTO new_cash_register_id;


        -- insert user_branch
        INSERT INTO branch_user(branch_id, user_id, cash_register_id)
        VALUES(new_branch_id, new_user_id, new_cash_register_id);


        -- insert payment_method (4 registers)
        INSERT INTO payment_methods(name, company_id, is_default, cod, color)
        VALUES('Efectivo', new_company_id, true, 'CASH', '#a6f868');
        INSERT INTO payment_methods(name, company_id, is_default, cod, color)
        VALUES('Tarjeta', new_company_id, true, 'CREDIT_CARD', '#fba259');
        INSERT INTO payment_methods(name, company_id, is_default, cod, color)
        VALUES('Crédito', new_company_id, true, 'CREDIT', '#fb81c6');
        INSERT INTO payment_methods(name, company_id, is_default, cod, color)
        VALUES('Mixto', new_company_id, true, 'MIXED', '');

        -- insert roles (SUPER_ADMIN, GUEST, CASHIER)
        INSERT INTO roles(cod, description, company_id, is_default)
        VALUES('ADMIN', 'Administrador', new_company_id, true);
        INSERT INTO roles(cod, description, company_id, is_default)
        VALUES('GUEST', 'Invitado', new_company_id, true);
        
        INSERT INTO roles(cod, description, company_id, is_default)
        VALUES('CASHIER', 'Cajero', new_company_id, true)
        RETURNING id INTO new_role_id;

        -- insert permissions para 'CASHIER
        INSERT INTO permissions(role_id, module_cod, company_id, is_group, role_cod)
        VALUES(new_role_id, 'pos', new_company_id, false, 'CASHIER');
        INSERT INTO permissions(role_id, module_cod, company_id, is_group, role_cod)
        VALUES(new_role_id, 'clients', new_company_id, false, 'CASHIER');

        -- Update user with document_type_id
        UPDATE users 
        SET document_type_id = new_document_type_id 
        WHERE id = new_user_id;
        RETURN new_user_id;

    EXCEPTION
        WHEN unique_violation THEN
            RAISE EXCEPTION 'Error de violación de unicidad al insertar la compañía.';
        WHEN others THEN RAISE EXCEPTION 'Ocurrió un error inesperado: %', SQLERRM; 
    END;
END;
$$;