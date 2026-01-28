begin;

do $$
declare
  user1_id uuid := 'ca1f1291-e630-4637-9e2d-6d18e175007a';
  user2_id uuid := '881ef73a-8e4f-4859-acd7-c5329b2edb0b';
  i int;
begin
  delete from public.todos where user_id in (user1_id, user2_id);

  for i in 1..5 loop
    insert into public.todos (user_id, title, note, is_done)
    values (user1_id, format('User 1 - Task %s', i), format('Note for task %s', i), i = 5);

    insert into public.todos (user_id, title, note, is_done)
    values (user2_id, format('User 2 - Task %s', i), format('Note for task %s', i), i = 5);
  end loop;
end $$;

commit;
