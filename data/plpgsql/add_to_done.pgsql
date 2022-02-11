create or replace function add_to_done(order_id integer, taken_at timestamptz, result jsonb)
returns boolean as
$$
    declare
        _vkid varchar := '';
        _client_id integer := 0;
        _done_id integer := 0;
    begin
        update orders set done = true where id = order_id;
        _vkid := (select vkid from parse where id = (select parse_id from orders where id = order_id));
        if _vkid = '' then
            return false;
        else
            update queue set processed_at = current_timestamp where vkid = _vkid;
            _client_id := (select client_id from orders where id = order_id);
            insert into done(vkid, taken_at, done_at, data, client_id) values (
                _vkid,
                taken_at,
                current_timestamp,
                result,
                _client_id
            ) returning id into _done_id;
            if _done_id = 0 then
                return false;
            end if;
        end if;
        return true;
    end;
$$ language plpgsql;