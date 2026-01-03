# Ejecutar estos script para configurar la tabla cash_regiser_movements en supabase para la funcionalidad de Reak Time

## Eliminar scripts
```sql
drop trigger if exists trg_broadcast_cash_register_movement
on public.cash_register_movements;

drop function if exists public.broadcast_cash_register_movement();
```

## Crear función trigger
```sql
create or replace function public.broadcast_cash_register_movement()
returns trigger
language plpgsql
security definer
as $$
begin
  perform realtime.send(
    '{}'::jsonb,                    -- payload vacío; no necesitamos datos
    'movement_inserted',            -- nombre del evento
    'pos:cash_register_movements',  -- topic / canal
    false                           -- público (no privado)
  );

  -- En AFTER triggers se ignora el valor retornado, así que null es válido
  return null;
end;
$$;
```

## Crear trigger
```sql
create trigger trg_broadcast_cash_register_movement
after insert on public.cash_register_movements
for each row
execute function public.broadcast_cash_register_movement();
```

## Policy RLS
```sql
create policy "anon can receive broadcasts"
on realtime.messages
for select
to anon
using ( true );
```
