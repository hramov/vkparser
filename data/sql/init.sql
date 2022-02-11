--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE database_admin;
ALTER ROLE database_admin WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:EGcmrc17e7dlFUZctyMd+w==$L9c/7krsa46z1/PAwXvzelCxKBl3Da5cwvcrcPtH3Lw=:t5fvDi9FtGtxl2ieX7KzAz/OyIdK8EeWb7GqKIznUUQ=';
-- CREATE ROLE postgres;
-- ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:wRWFMFUus6lFAoqrkIwsDg==$QdX6JvNRbhTpeKHomN0xlO2CIv8HFxL4n2GLT8Kjp8c=:YLjGRXCES8kYggEjhE3NiazhASguCkUy7v/L2LRu1JE=';






--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1 (Debian 14.1-1.pgdg110+1)
-- Dumped by pg_dump version 14.1 (Debian 14.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1 (Debian 14.1-1.pgdg110+1)
-- Dumped by pg_dump version 14.1 (Debian 14.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: somefunc(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.somefunc() RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    quantity integer := 30;
BEGIN
    RAISE NOTICE 'Quantity here is %', quantity;  -- Prints 30
    quantity := 50;
    --
    -- Create a subblock
    --
    DECLARE
        quantity integer := 80;
    BEGIN
        RAISE NOTICE 'Quantity here is %', quantity;  -- Prints 80
        RAISE NOTICE 'Outer quantity here is %', outerblock.quantity;  -- Prints 50
    END;

    RAISE NOTICE 'Quantity here is %', quantity;  -- Prints 50

    RETURN quantity;
END;
$$;


ALTER FUNCTION public.somefunc() OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

--
-- Database "shop" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1 (Debian 14.1-1.pgdg110+1)
-- Dumped by pg_dump version 14.1 (Debian 14.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: shop; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE shop WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE shop OWNER TO postgres;

\connect shop

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    id integer NOT NULL,
    customer_id integer
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- Name: cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cart_id_seq OWNER TO postgres;

--
-- Name: cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_id_seq OWNED BY public.cart.id;


--
-- Name: cart_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_product (
    cart_id integer,
    product_id integer
);


ALTER TABLE public.cart_product OWNER TO postgres;

--
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer (
    id integer NOT NULL,
    name character varying(50),
    email character varying(255)
);


ALTER TABLE public.customer OWNER TO postgres;

--
-- Name: customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customer_id_seq OWNER TO postgres;

--
-- Name: customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customer_id_seq OWNED BY public.customer.id;


--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    price integer
);


ALTER TABLE public.product OWNER TO postgres;

--
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_id_seq OWNER TO postgres;

--
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;


--
-- Name: cart id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public.cart_id_seq'::regclass);


--
-- Name: customer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer ALTER COLUMN id SET DEFAULT nextval('public.customer_id_seq'::regclass);


--
-- Name: product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (id, customer_id) FROM stdin;
1	1
2	2
\.


--
-- Data for Name: cart_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_product (cart_id, product_id) FROM stdin;
1	1
1	3
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer (id, name, email) FROM stdin;
1	Sergey	hramov@gmail.com
2	Oleg	oleg@gmail.com
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (id, title, price) FROM stdin;
1	iPhone	100
2	Mac	400
3	Apple watch	50
5	Test	100
8	Test	100
9	Test	100
\.


--
-- Name: cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_id_seq', 2, true);


--
-- Name: customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_id_seq', 16, true);


--
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_id_seq', 9, true);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- Name: customer customer_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_email_key UNIQUE (email);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: cart cart_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(id);


--
-- Name: cart_product cart_product_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_product
    ADD CONSTRAINT cart_product_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.cart(id);


--
-- Name: cart_product cart_product_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_product
    ADD CONSTRAINT cart_product_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id);


--
-- PostgreSQL database dump complete
--

--
-- Database "tutorial" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1 (Debian 14.1-1.pgdg110+1)
-- Dumped by pg_dump version 14.1 (Debian 14.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: tutorial; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE tutorial WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE tutorial OWNER TO postgres;

\connect tutorial

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: flight; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flight (
    flightid integer NOT NULL,
    flightdate timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_DATE
);


ALTER TABLE public.flight OWNER TO postgres;

--
-- Name: concat_id(public.flight); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.concat_id(in_t public.flight) RETURNS text
    LANGUAGE plpgsql
    AS $$
    begin
        return in_t;
    end;
$$;


ALTER FUNCTION public.concat_id(in_t public.flight) OWNER TO postgres;

--
-- Name: foo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.foo (
    fooid integer,
    foosubid integer,
    fooname text
);


ALTER TABLE public.foo OWNER TO postgres;

--
-- Name: get_all_foo(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_all_foo() RETURNS SETOF public.foo
    LANGUAGE plpgsql
    AS $$
declare 
    r foo%rowtype;
begin
    for r in
        select * from foo where fooid > 0
    loop
        return next r;
    end loop;
    return;
end
$$;


ALTER FUNCTION public.get_all_foo() OWNER TO postgres;

--
-- Name: get_available_flightid(date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_available_flightid(date) RETURNS SETOF integer
    LANGUAGE plpgsql
    AS $_$
begin
    return query select flightid
    from flight
    where flightdate >= $1
    and flightdate < ($1 + 1);

    if not found then
        raise exception 'No flight at %.', $1;
    end if;
    return;
end
$_$;


ALTER FUNCTION public.get_available_flightid(date) OWNER TO postgres;

--
-- Name: poly(anyelement, anyelement); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.poly(x anyelement, y anyelement) RETURNS anyelement
    LANGUAGE plpgsql
    AS $$
    begin

        return x + y;

    end;
$$;


ALTER FUNCTION public.poly(x anyelement, y anyelement) OWNER TO postgres;

--
-- Name: return_setof_int(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.return_setof_int() RETURNS SETOF integer
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN NEXT 1;
  RETURN NEXT 2;
  RETURN NEXT 3;
  RETURN; -- Необязательный
END
$$;


ALTER FUNCTION public.return_setof_int() OWNER TO postgres;

--
-- Name: somefunc(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.somefunc() RETURNS integer
    LANGUAGE plpgsql
    AS $$
    declare
        variable integer = 10;
    begin
        variable = variable + 10;
        if variable > 15
        then
            raise notice 'Variable is: %', variable;
        end if;
        return variable;
    end;
$$;


ALTER FUNCTION public.somefunc() OWNER TO postgres;

--
-- Name: sum_n_product(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sum_n_product(x integer, y integer, OUT sum integer, OUT prod integer) RETURNS record
    LANGUAGE plpgsql
    AS $$
    begin
        sum = x + y;
        prod = x * y;
    end;
$$;


ALTER FUNCTION public.sum_n_product(x integer, y integer, OUT sum integer, OUT prod integer) OWNER TO postgres;

--
-- Name: flight_flightid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.flight_flightid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.flight_flightid_seq OWNER TO postgres;

--
-- Name: flight_flightid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.flight_flightid_seq OWNED BY public.flight.flightid;


--
-- Name: flight flightid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flight ALTER COLUMN flightid SET DEFAULT nextval('public.flight_flightid_seq'::regclass);


--
-- Data for Name: flight; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flight (flightid, flightdate, created_at) FROM stdin;
1	2022-02-10 00:00:00+00	2022-02-10 00:00:00+00
2	2022-02-10 04:14:23.985575+00	2022-02-10 00:00:00+00
\.


--
-- Data for Name: foo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.foo (fooid, foosubid, fooname) FROM stdin;
1	2	three
4	5	six
\.


--
-- Name: flight_flightid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.flight_flightid_seq', 2, true);


--
-- Name: flight flight_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flight
    ADD CONSTRAINT flight_pkey PRIMARY KEY (flightid);


--
-- PostgreSQL database dump complete
--

--
-- Database "vkparser" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1 (Debian 14.1-1.pgdg110+1)
-- Dumped by pg_dump version 14.1 (Debian 14.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: vkparser; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE vkparser WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE vkparser OWNER TO database_admin;

\connect vkparser

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: add_to_done(integer, timestamp with time zone, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.add_to_done(order_id integer, taken_at timestamp with time zone, result jsonb) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.add_to_done(order_id integer, taken_at timestamp with time zone, result jsonb) OWNER TO database_admin;

--
-- Name: add_to_queue(integer, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.add_to_queue(client_id integer, vkid character varying) RETURNS integer
    LANGUAGE plpgsql
    AS $$
    declare
        _parse_id integer := 0;
        _order_id integer := 0;
    begin
        insert into parse (vkid) values (vkid) returning id into _parse_id;
        if _parse_id <> 0 then
            insert into orders (client_id, parse_id) values (client_id, _parse_id) returning id into _order_id;
            if _order_id <> 0 then
                insert into queue (order_id, vkid) values (_order_id, vkid);
            else
                return 0;
            end if;
            else
                return 0;
        end if;
        return _order_id;
    end;
$$;


ALTER FUNCTION public.add_to_queue(client_id integer, vkid character varying) OWNER TO database_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client (
    id integer NOT NULL,
    email character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public.client OWNER TO database_admin;

--
-- Name: client_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.client_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.client_id_seq OWNER TO database_admin;

--
-- Name: client_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.client_id_seq OWNED BY public.client.id;


--
-- Name: done; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.done (
    id integer NOT NULL,
    vkid character varying NOT NULL,
    taken_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    done_at timestamp with time zone,
    data jsonb,
    client_id integer
);


ALTER TABLE public.done OWNER TO database_admin;

--
-- Name: done_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.done_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.done_id_seq OWNER TO database_admin;

--
-- Name: done_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.done_id_seq OWNED BY public.done.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    client_id integer,
    parse_id integer,
    done boolean DEFAULT false NOT NULL
);


ALTER TABLE public.orders OWNER TO database_admin;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO database_admin;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: parse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parse (
    id integer NOT NULL,
    vkid character varying NOT NULL
);


ALTER TABLE public.parse OWNER TO database_admin;

--
-- Name: parse_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parse_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.parse_id_seq OWNER TO database_admin;

--
-- Name: parse_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parse_id_seq OWNED BY public.parse.id;


--
-- Name: queue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.queue (
    id integer NOT NULL,
    vkid character varying,
    processed_at timestamp with time zone,
    added_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    taken boolean DEFAULT false NOT NULL,
    order_id integer
);


ALTER TABLE public.queue OWNER TO database_admin;

--
-- Name: queue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.queue_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.queue_id_seq OWNER TO database_admin;

--
-- Name: queue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.queue_id_seq OWNED BY public.queue.id;


--
-- Name: client id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client ALTER COLUMN id SET DEFAULT nextval('public.client_id_seq'::regclass);


--
-- Name: done id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.done ALTER COLUMN id SET DEFAULT nextval('public.done_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: parse id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parse ALTER COLUMN id SET DEFAULT nextval('public.parse_id_seq'::regclass);


--
-- Name: queue id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue ALTER COLUMN id SET DEFAULT nextval('public.queue_id_seq'::regclass);

--
-- Name: client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_id_seq', 4, true);


--
-- Name: done_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.done_id_seq', 11, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 10, true);


--
-- Name: parse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parse_id_seq', 11, true);


--
-- Name: queue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.queue_id_seq', 27, true);


--
-- Name: client client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY (id);


--
-- Name: done done_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.done
    ADD CONSTRAINT done_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: parse parse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parse
    ADD CONSTRAINT parse_pkey PRIMARY KEY (id);


--
-- Name: queue queue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue
    ADD CONSTRAINT queue_pkey PRIMARY KEY (id);


--
-- Name: queue queue_vkid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue
    ADD CONSTRAINT queue_vkid_key UNIQUE (vkid);


--
-- Name: done done_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.done
    ADD CONSTRAINT done_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: orders orders_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: orders orders_parse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_parse_id_fkey FOREIGN KEY (parse_id) REFERENCES public.parse(id);


--
-- Name: queue queue_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue
    ADD CONSTRAINT queue_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: DATABASE vkparser; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON DATABASE vkparser TO database_admin;


--
-- PostgreSQL database dump complete
--

--
-- Database "wishlist" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1 (Debian 14.1-1.pgdg110+1)
-- Dumped by pg_dump version 14.1 (Debian 14.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: wishlist; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE wishlist WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE wishlist OWNER TO postgres;

\connect wishlist

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: concat_lower_or_upper(text, text, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.concat_lower_or_upper(a text, b text, uppercase boolean DEFAULT false) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
select CASE
        when $3 then upper($1 || ' ' || $2)
        else lower($1 || ' ' || $2)
        end;
$_$;


ALTER FUNCTION public.concat_lower_or_upper(a text, b text, uppercase boolean) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: foo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.foo (
    fooid integer,
    foosubid integer,
    fooname text
);


ALTER TABLE public.foo OWNER TO postgres;

--
-- Name: get_all_foo(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_all_foo() RETURNS SETOF public.foo
    LANGUAGE plpgsql
    AS $$
declare 
    r foo%rowtype;
begin
    for r in
        select * from foo where fooid > 0
    loop
        return next r;
    end loop;
    return;
end
$$;


ALTER FUNCTION public.get_all_foo() OWNER TO postgres;

--
-- Name: client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client (
    id integer NOT NULL,
    tgid character varying(10) NOT NULL,
    lover_id character varying(10),
    username character varying(20)
);


ALTER TABLE public.client OWNER TO postgres;

--
-- Name: client_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.client_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.client_id_seq OWNER TO postgres;

--
-- Name: client_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.client_id_seq OWNED BY public.client.id;


--
-- Name: transact; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transact (
    user_id integer,
    wish_id integer
);


ALTER TABLE public.transact OWNER TO postgres;

--
-- Name: wish; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wish (
    id integer NOT NULL,
    client_id integer,
    href character varying(255) NOT NULL,
    title character varying(255),
    img character varying(255),
    price numeric
);


ALTER TABLE public.wish OWNER TO postgres;

--
-- Name: wish_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wish_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.wish_id_seq OWNER TO postgres;

--
-- Name: wish_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wish_id_seq OWNED BY public.wish.id;


--
-- Name: client id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client ALTER COLUMN id SET DEFAULT nextval('public.client_id_seq'::regclass);


--
-- Name: wish id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wish ALTER COLUMN id SET DEFAULT nextval('public.wish_id_seq'::regclass);


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client (id, tgid, lover_id, username) FROM stdin;
\.


--
-- Data for Name: foo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.foo (fooid, foosubid, fooname) FROM stdin;
1	2	three
4	5	six
\.


--
-- Data for Name: transact; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transact (user_id, wish_id) FROM stdin;
\.


--
-- Data for Name: wish; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wish (id, client_id, href, title, img, price) FROM stdin;
\.


--
-- Name: client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_id_seq', 1, false);


--
-- Name: wish_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wish_id_seq', 1, false);


--
-- Name: client client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY (id);


--
-- Name: wish wish_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wish
    ADD CONSTRAINT wish_pkey PRIMARY KEY (id);


--
-- Name: transact transact_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transact
    ADD CONSTRAINT transact_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.client(id);


--
-- Name: transact transact_wish_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transact
    ADD CONSTRAINT transact_wish_id_fkey FOREIGN KEY (wish_id) REFERENCES public.wish(id);


--
-- Name: wish wish_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wish
    ADD CONSTRAINT wish_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

