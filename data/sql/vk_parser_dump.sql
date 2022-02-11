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


ALTER FUNCTION public.add_to_done(order_id integer, taken_at timestamp with time zone, result jsonb) OWNER TO postgres;

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


ALTER FUNCTION public.add_to_queue(client_id integer, vkid character varying) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client (
    id integer NOT NULL,
    email character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
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


ALTER TABLE public.done OWNER TO postgres;

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


ALTER TABLE public.done_id_seq OWNER TO postgres;

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


ALTER TABLE public.orders OWNER TO postgres;

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


ALTER TABLE public.orders_id_seq OWNER TO postgres;

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


ALTER TABLE public.parse OWNER TO postgres;

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


ALTER TABLE public.parse_id_seq OWNER TO postgres;

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


ALTER TABLE public.queue OWNER TO postgres;

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


ALTER TABLE public.queue_id_seq OWNER TO postgres;

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
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client (id, email, created_at) FROM stdin;
1	trykhramov@gmail.com	2022-02-10 08:52:56.03053+00
\.


--
-- Data for Name: done; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.done (id, vkid, taken_at, done_at, data, client_id) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, client_id, parse_id, done) FROM stdin;
\.


--
-- Data for Name: parse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parse (id, vkid) FROM stdin;
\.


--
-- Data for Name: queue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.queue (id, vkid, processed_at, added_at, taken, order_id) FROM stdin;
\.


--
-- Name: client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_id_seq', 1, true);


--
-- Name: done_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.done_id_seq', 10, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 9, true);


--
-- Name: parse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parse_id_seq', 10, true);


--
-- Name: queue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.queue_id_seq', 26, true);


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
-- PostgreSQL database dump complete
--

