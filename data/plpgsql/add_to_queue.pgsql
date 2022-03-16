create or replace function add_to_queue(client_id integer, vkid varchar, groups jsonb) 
returns integer
as
$$
    declare
        _parse_id integer := 0;
        _order_id integer := 0;
    begin
        insert into parse (vkid) values (vkid) returning id into _parse_id;
        if _parse_id <> 0 then
            insert into orders (client_id, parse_id) values (client_id, _parse_id) returning id into _order_id;
            if _order_id <> 0 then
                insert into queue (order_id, vkid, groups) values (_order_id, vkid, groups);
            else
                return 0;
            end if;
            else
                return 0;
        end if;
        return _order_id;
    end;
$$ language plpgsql;