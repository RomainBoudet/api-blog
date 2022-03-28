
BEGIN;

DROP TABLE IF EXISTS category, post; -- suppresion des tables existanttes, portant le même nom.


CREATE DOMAIN text_length AS text -- un domaine pour les descriptions = mini 9 caractéres sans espace autour
    CHECK (
        char_length(trim(both from VALUE)) >= 9
    )
     CHECK (
        VALUE ~* '[^<>{}_*+$%#()=@&~/\\[\]|]*$'
    );

CREATE DOMAIN text_valid AS text -- un domaine pour les textes valides = mini 2 caractéres sans espaces autour
    CHECK (
        char_length(trim(both from VALUE)) >= 2
    )
     CHECK (
        VALUE ~* '[^<>{}_*+$%#()=@&~/\\[\]|]*$'
    );

CREATE DOMAIN text_slug AS text -- un domaine permettant de vérifier la présence d'un / via une regex
	CHECK (
		VALUE ~* '^/{1,}$'
	);



CREATE TABLE category (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "route" text_slug UNIQUE NOT NULL, -- "route" semble un mot réservé, i est passe entre quotes...
    label text_valid UNIQUE NOT NULL
);

create table post (
id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
slug text_valid UNIQUE NOT NULL,
title text_valid NOT NULL,
excerpt text_length NOT NULL,
content text_length NOT NULL,
category_id INT NOT NULL REFERENCES category(id)
);

COMMIT;