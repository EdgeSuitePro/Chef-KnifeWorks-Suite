-- Chef KnifeWorks / EdgeSuite Pro
-- Safe additive migration: preserve arrival_window daypart and store the customer's exact one-hour expected arrival separately.

alter table public.work_orders
  add column if not exists arrival_slot text;

alter table public.work_orders
  drop constraint if exists work_orders_arrival_slot_check;

alter table public.work_orders
  add constraint work_orders_arrival_slot_check
  check (
    arrival_slot is null or arrival_slot in (
      '08:00-09:00',
      '09:00-10:00',
      '10:00-11:00',
      '11:00-12:00',
      '12:00-13:00',
      '13:00-14:00',
      '14:00-15:00',
      '15:00-16:00',
      '16:00-17:00',
      '17:00-18:00',
      '18:00-19:00',
      '19:00-20:00'
    )
  );

comment on column public.work_orders.arrival_slot is
  'Customer-selected one-hour expected arrival window. arrival_window remains the broader morning/midday/evening grouping.';
