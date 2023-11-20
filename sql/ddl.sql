create table question (id bigint not null, question varchar(255), primary key (id));

create table questionRoomLink (id bigint not null, json_data varchar(255), question_order integer, room_id integer, primary key (id));

create table room (id bigint not null, create_date date, room_code varchar(255), room_owner_id bigint, primary key (id));

create table user (id bigint not null, correct_count integer, end_status varchar(255), room_code varchar(255), user_name varchar(255), user_order integer, user_role integer, primary key (id));